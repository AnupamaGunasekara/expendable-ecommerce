const prisma = require('../config/database');

// Validate coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'This coupon is no longer active' });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }

    if (coupon.minOrderValue && orderTotal < parseFloat(coupon.minOrderValue)) {
      return res.status(400).json({
        error: `Minimum order value of Rs. ${coupon.minOrderValue} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal * parseFloat(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
      finalTotal: orderTotal - discount,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

module.exports = {
  validateCoupon,
};
