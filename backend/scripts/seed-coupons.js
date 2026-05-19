const prisma = require('../config/database');

async function seedCoupons() {
  try {
    console.log('Creating test coupons...\n');

    // Check if coupons already exist
    const existingCoupons = await prisma.coupon.findMany();
    console.log(`Found ${existingCoupons.length} existing coupons`);

    // Create test coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: '10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 1000,
        maxDiscount: 500,
        usageLimit: 100,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
      {
        code: 'SAVE500',
        description: 'Flat Rs. 500 off',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 3000,
        usageLimit: 50,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
      {
        code: 'MEGA20',
        description: '20% off on orders above Rs. 5000',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 5000,
        maxDiscount: 2000,
        usageLimit: 200,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
    ];

    for (const couponData of coupons) {
      const existing = await prisma.coupon.findUnique({
        where: { code: couponData.code },
      });

      if (existing) {
        console.log(`✓ Coupon ${couponData.code} already exists`);
      } else {
        await prisma.coupon.create({ data: couponData });
        console.log(`✓ Created coupon: ${couponData.code}`);
      }
    }

    console.log('\n📋 All available coupons:');
    const allCoupons = await prisma.coupon.findMany({
      where: { isActive: true },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderValue: true,
        maxDiscount: true,
        usageCount: true,
        usageLimit: true,
        validFrom: true,
        validUntil: true,
      },
    });
    console.table(allCoupons);

    await prisma.$disconnect();
    console.log('\n✅ Coupon seeding completed!');
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedCoupons();
