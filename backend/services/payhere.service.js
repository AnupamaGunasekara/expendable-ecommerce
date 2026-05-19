const { generateCheckoutHash } = require('../utils/payhere');

const PAYHERE_SANDBOX_URL = 'https://sandbox.payhere.lk/pay/checkout';
const PAYHERE_LIVE_URL = 'https://www.payhere.lk/pay/checkout';

/**
 * Build the complete PayHere checkout payload to send to the frontend.
 * The frontend will POST this as a form to PayHere's checkout URL.
 *
 * @param {object} order        - Prisma Order record (must include .user)
 * @param {object} shippingAddr - Parsed shipping address object
 * @returns {{ checkoutUrl: string, params: object }}
 */
const buildCheckoutPayload = (order, shippingAddr) => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const isSandbox = process.env.PAYHERE_SANDBOX === 'true';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const checkoutUrl = isSandbox ? PAYHERE_SANDBOX_URL : PAYHERE_LIVE_URL;
  const currency = 'LKR';
  const amount = parseFloat(order.total).toFixed(2);
  const orderId = order.orderNumber; // Use orderNumber as PayHere order_id

  const hash = generateCheckoutHash(merchantId, orderId, amount, currency, merchantSecret);

  // Debug — remove after confirming hash is correct
  console.log('[PayHere buildCheckoutPayload]', {
    merchantId,
    orderId,
    amount,
    currency,
    merchantSecretLength: merchantSecret?.length,
    hash,
  });

  const params = {
    // Merchant credentials
    merchant_id: merchantId,
    return_url: `${frontendUrl}/payment/success?orderNumber=${orderId}`,
    cancel_url: `${frontendUrl}/payment/cancel?orderNumber=${orderId}`,
    notify_url: `${process.env.BACKEND_URL || 'http://localhost:5030'}/api/payments/notify`,

    // Order details
    order_id: orderId,
    items: `Order ${orderId} - EXPENDABLES`,
    currency,
    amount,

    // Customer details (required by PayHere)
    first_name: shippingAddr.firstName,
    last_name: shippingAddr.lastName,
    email: order.user.email,
    phone: shippingAddr.phone,
    address: shippingAddr.address1 + (shippingAddr.address2 ? `, ${shippingAddr.address2}` : ''),
    city: shippingAddr.city,
    country: shippingAddr.country || 'Sri Lanka',

    // Security hash
    hash,
  };

  return { checkoutUrl, params };
};

module.exports = { buildCheckoutPayload };
