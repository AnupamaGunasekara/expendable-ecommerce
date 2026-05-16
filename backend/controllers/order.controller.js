const prisma = require('../config/database');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EXP-${timestamp}-${random}`;
};

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      customerNotes,
    } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return res.status(404).json({ error: `Product variant ${item.variantId} not found` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${variant.product.name} (${variant.size}/${variant.color})`,
        });
      }

      const price = variant.product.salePrice || variant.product.price;
      const itemSubtotal = parseFloat(price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        price: parseFloat(price),
        subtotal: itemSubtotal,
      });
    }

    // Calculate shipping
    const shippingCost = subtotal >= 9999 ? 0 : 300; // Free shipping over Rs. 9,999

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          if (!coupon.minOrderValue || subtotal >= parseFloat(coupon.minOrderValue)) {
            if (coupon.discountType === 'percentage') {
              discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
              if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
                discount = parseFloat(coupon.maxDiscount);
              }
            } else {
              discount = parseFloat(coupon.discountValue);
            }

            // Update coupon usage
            await prisma.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }
    }

    // Calculate total
    const total = subtotal + shippingCost - discount;

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'pending',
        subtotal,
        shippingCost,
        discount,
        total,
        couponCode: couponCode || null,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress || shippingAddress),
        customerNotes: customerNotes || null,
        estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            amount: total,
            paymentMethod,
            paymentStatus: 'pending',
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
        payment: true,
      },
    });

    // Update stock
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const total = await prisma.order.count({ where: { userId } });

    const orders = await prisma.order.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Parse JSON addresses
    order.shippingAddress = JSON.parse(order.shippingAddress);
    order.billingAddress = JSON.parse(order.billingAddress);

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation if order is still pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    // Restore stock
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    });

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
