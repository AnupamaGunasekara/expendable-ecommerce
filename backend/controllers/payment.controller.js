const prisma = require('../config/database');
const { buildCheckoutPayload } = require('../services/payhere.service');
const { verifyNotifyHash } = require('../utils/payhere');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/initiate
// Called AFTER the order has been created (paymentMethod = 'card').
// Returns the PayHere checkout URL + form params so the frontend can redirect.
// ─────────────────────────────────────────────────────────────────────────────
const initiatePayment = async (req, res) => {
  try {
    const { orderNumber } = req.body;
    const userId = req.user.id;

    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber is required' });
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        user: { select: { email: true } },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentMethod !== 'card') {
      return res.status(400).json({ error: 'This order is not a card payment order' });
    }

    // Guard: don't allow re-initiation for already paid orders
    if (order.payment?.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    const shippingAddr = JSON.parse(order.shippingAddress);
    const { checkoutUrl, params } = buildCheckoutPayload(order, shippingAddr);

    // Stamp the payment record with the payhereOrderId so the notify webhook
    // can look it up by order_id later.
    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        paymentGateway: 'payhere',
        payhereOrderId: order.orderNumber,
        paymentStatus: 'processing',
      },
    });

    // Mirror on the order itself
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'processing' },
    });

    return res.json({ checkoutUrl, params });
  } catch (error) {
    console.error('initiatePayment error:', error);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/notify
// PayHere calls this server-to-server (no browser involved).
// MUST return HTTP 200 — PayHere will retry on non-200.
// This is the ONLY trusted source of truth for payment status.
// ─────────────────────────────────────────────────────────────────────────────
const handleNotify = async (req, res) => {
  // Always respond 200 first to stop PayHere retrying while we process.
  // We do the work async / inside a try-catch with no early res.status(4xx).
  try {
    const payload = req.body;
    console.log('[PayHere notify]', JSON.stringify(payload));

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // ── 1. Verify hash ───────────────────────────────────────────────────────
    const isValid = verifyNotifyHash(payload, merchantSecret);
    if (!isValid) {
      console.error('[PayHere notify] Hash verification FAILED. Possible tampering.');
      return res.sendStatus(200); // Still 200 so PayHere stops retrying
    }

    // ── 2. Verify merchant_id ────────────────────────────────────────────────
    if (payload.merchant_id !== process.env.PAYHERE_MERCHANT_ID) {
      console.error('[PayHere notify] merchant_id mismatch');
      return res.sendStatus(200);
    }

    const { order_id, payment_id, status_code, payhere_amount, payhere_currency } = payload;

    // ── 3. Load payment record by payhereOrderId ─────────────────────────────
    const payment = await prisma.payment.findUnique({
      where: { payhereOrderId: order_id },
      include: { order: { include: { items: true } } },
    });

    if (!payment) {
      console.error(`[PayHere notify] No payment record for order_id=${order_id}`);
      return res.sendStatus(200);
    }

    // ── 4. Idempotency: skip if already processed as paid ────────────────────
    if (payment.paymentStatus === 'paid') {
      console.log(`[PayHere notify] order_id=${order_id} already marked paid. Skipping.`);
      return res.sendStatus(200);
    }

    // ── 5. Amount verification ───────────────────────────────────────────────
    const expectedAmount = parseFloat(payment.amount).toFixed(2);
    const receivedAmount = parseFloat(payhere_amount).toFixed(2);
    if (expectedAmount !== receivedAmount || payhere_currency !== 'LKR') {
      console.error(
        `[PayHere notify] Amount mismatch! expected=${expectedAmount} received=${receivedAmount}`
      );
      return res.sendStatus(200);
    }

    // ── 6. Map PayHere status_code → our internal status ────────────────────
    // PayHere status codes:
    //  2  = Success (payment completed)
    //  0  = Pending (pending payment from bank)
    // -1  = Cancelled by customer
    // -2  = Failed
    // -3  = Chargedback
    const statusMap = {
      '2': 'paid',
      '0': 'pending',
      '-1': 'cancelled',
      '-2': 'failed',
      '-3': 'failed',
    };
    const newPaymentStatus = statusMap[String(status_code)] || 'failed';

    // ── 7. Database transaction: update payment + order + stock ──────────────
    await prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: newPaymentStatus,
          transactionId: payment_id || null,
          payhereStatusCode: String(status_code),
          payhereStatusMessage: payload.status_message || null,
          paymentDetails: JSON.stringify(payload),
          notifyReceivedAt: now,
          paidAt: newPaymentStatus === 'paid' ? now : null,
        },
      });

      let newOrderStatus = payment.order.status;
      let newOrderPaymentStatus = newPaymentStatus;

      if (newPaymentStatus === 'paid') {
        newOrderStatus = 'confirmed';

        // Decrement stock now that payment is confirmed
        for (const item of payment.order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Clear the user's cart (best-effort; cart may already be gone)
        const cart = await tx.cart.findUnique({
          where: { userId: payment.order.userId },
        });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      } else if (newPaymentStatus === 'cancelled' || newPaymentStatus === 'failed') {
        newOrderStatus = 'cancelled';
        // No stock was decremented for card orders before payment, so nothing to restore.
      }

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: newOrderPaymentStatus,
          status: newOrderStatus,
          ...(newOrderStatus === 'cancelled' ? { cancelledAt: now } : {}),
        },
      });
    });

    console.log(`[PayHere notify] order_id=${order_id} → ${newPaymentStatus}`);
    return res.sendStatus(200);
  } catch (error) {
    console.error('[PayHere notify] Unhandled error:', error);
    // Still return 200 — otherwise PayHere retries indefinitely.
    // Log to investigate manually.
    return res.sendStatus(200);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/status/:orderNumber
// Frontend polls this after return_url to determine final payment state.
// NEVER trust return_url query params alone — always confirm via this endpoint.
// ─────────────────────────────────────────────────────────────────────────────
const getPaymentStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        payment: {
          select: {
            paymentStatus: true,
            payhereStatusCode: true,
            transactionId: true,
            paidAt: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: order.payment?.paymentStatus || 'pending',
      payhereStatusCode: order.payment?.payhereStatusCode || null,
      transactionId: order.payment?.transactionId || null,
      paidAt: order.payment?.paidAt || null,
    });
  } catch (error) {
    console.error('getPaymentStatus error:', error);
    return res.status(500).json({ error: 'Failed to get payment status' });
  }
};

module.exports = { initiatePayment, handleNotify, getPaymentStatus };
