const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (optional - comment out if you want to preserve data)
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Admin User
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@expendables.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Created admin user');

  // Create Test Customer
  const hashedCustomerPassword = await bcrypt.hash('Customer@123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password: hashedCustomerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+94771234567',
    },
  });
  console.log('✅ Created test customer');

  // Create Categories
  const menCategory = await prisma.category.create({
    data: {
      name: 'Men',
      slug: 'men',
      description: 'Mens T-shirt collection',
      gender: 'men',
      sortOrder: 1,
      isActive: true,
    },
  });

  const womenCategory = await prisma.category.create({
    data: {
      name: 'Women',
      slug: 'women',
      description: 'Womens T-shirt collection',
      gender: 'women',
      sortOrder: 2,
      isActive: true,
    },
  });

  const unisexCategory = await prisma.category.create({
    data: {
      name: 'Unisex',
      slug: 'unisex',
      description: 'Unisex T-shirt collection',
      gender: 'unisex',
      sortOrder: 3,
      isActive: true,
    },
  });

  // Men Subcategories
  await prisma.category.createMany({
    data: [
      { name: 'Oversized T-Shirts', slug: 'men-oversized', parentId: menCategory.id, gender: 'men', sortOrder: 1 },
      { name: 'Printed T-Shirts', slug: 'men-printed', parentId: menCategory.id, gender: 'men', sortOrder: 2 },
      { name: 'Plain T-Shirts', slug: 'men-plain', parentId: menCategory.id, gender: 'men', sortOrder: 3 },
      { name: 'Embroidery T-Shirts', slug: 'men-embroidery', parentId: menCategory.id, gender: 'men', sortOrder: 4 },
      { name: 'Streetwear T-Shirts', slug: 'men-streetwear', parentId: menCategory.id, gender: 'men', sortOrder: 5 },
    ],
  });

  // Women Subcategories
  await prisma.category.createMany({
    data: [
      { name: 'Oversized T-Shirts', slug: 'women-oversized', parentId: womenCategory.id, gender: 'women', sortOrder: 1 },
      { name: 'Crop T-Shirts', slug: 'women-crop', parentId: womenCategory.id, gender: 'women', sortOrder: 2 },
      { name: 'Printed T-Shirts', slug: 'women-printed', parentId: womenCategory.id, gender: 'women', sortOrder: 3 },
      { name: 'Plain T-Shirts', slug: 'women-plain', parentId: womenCategory.id, gender: 'women', sortOrder: 4 },
      { name: 'Embroidery T-Shirts', slug: 'women-embroidery', parentId: womenCategory.id, gender: 'women', sortOrder: 5 },
    ],
  });

  // Unisex Subcategories
  await prisma.category.createMany({
    data: [
      { name: 'Oversized T-Shirts', slug: 'unisex-oversized', parentId: unisexCategory.id, gender: 'unisex', sortOrder: 1 },
      { name: 'Graphic T-Shirts', slug: 'unisex-graphic', parentId: unisexCategory.id, gender: 'unisex', sortOrder: 2 },
      { name: 'Minimal T-Shirts', slug: 'unisex-minimal', parentId: unisexCategory.id, gender: 'unisex', sortOrder: 3 },
      { name: 'Premium Cotton T-Shirts', slug: 'unisex-premium', parentId: unisexCategory.id, gender: 'unisex', sortOrder: 4 },
    ],
  });

  console.log('✅ Created categories');

  // Sample Products
  const products = [
    // Men Products
    {
      name: 'EXPENDABLES Oversized Tee - Black',
      slug: 'expendables-oversized-tee-black',
      description: 'An elevated everyday T-shirt made from soft breathable fabric, designed for warm weather, travel, and casual styling.\n\nSilhouette: Oversized T-shirt\nDesign: Crew neck, short sleeves, minimal EXPENDABLES logo placement\nFit: Relaxed fit\nFabric: 80% cotton, 20% polyester\nFeel: Soft, breathable, and comfortable\nQuality: Durable stitching with premium finishing',
      shortDescription: 'Premium oversized tee with soft breathable fabric. Perfect for everyday wear.',
      price: 3500,
      categoryId: menCategory.id,
      gender: 'men',
      sku: 'EXP-M-OVR-BLK-001',
      isFeatured: true,
      isNew: true,
      isBestSeller: true,
      material: '80% cotton, 20% polyester',
      fit: 'Oversized',
      tags: '["oversized", "casual", "everyday"]',
    },
    {
      name: 'EXPENDABLES Core Tee - White',
      slug: 'expendables-core-tee-white',
      description: 'A wardrobe essential crafted from premium cotton blend. The perfect white tee that goes with everything.',
      shortDescription: 'Essential white tee in premium cotton blend.',
      price: 2500,
      salePrice: 2000,
      categoryId: menCategory.id,
      gender: 'men',
      sku: 'EXP-M-CORE-WHT-001',
      isFeatured: true,
      onSale: true,
      material: '100% cotton',
      fit: 'Regular',
      tags: '["basic", "essential", "sale"]',
    },
    {
      name: 'EXPENDABLES Graphic Tee - Navy',
      slug: 'expendables-graphic-tee-navy',
      description: 'Bold graphic print tee featuring exclusive EXPENDABLES artwork. Stand out with style.',
      shortDescription: 'Bold graphic print tee with exclusive artwork.',
      price: 4000,
      categoryId: menCategory.id,
      gender: 'men',
      sku: 'EXP-M-GRP-NAV-001',
      isNew: true,
      material: '100% cotton',
      fit: 'Regular',
      tags: '["graphic", "printed", "new"]',
    },
    {
      name: 'EXPENDABLES Streetwear Tee - Grey',
      slug: 'expendables-streetwear-tee-grey',
      description: 'Urban streetwear design with contemporary fit. Made for the modern lifestyle.',
      shortDescription: 'Contemporary streetwear tee for urban style.',
      price: 4500,
      categoryId: menCategory.id,
      gender: 'men',
      sku: 'EXP-M-STR-GRY-001',
      isBestSeller: true,
      material: '90% cotton, 10% polyester',
      fit: 'Regular',
      tags: '["streetwear", "urban", "lifestyle"]',
    },
    {
      name: 'EXPENDABLES Embroidery Tee - Beige',
      slug: 'expendables-embroidery-tee-beige',
      description: 'Minimal embroidered logo on premium fabric. Subtle elegance for everyday wear.',
      shortDescription: 'Premium tee with minimal embroidered logo.',
      price: 5200,
      categoryId: menCategory.id,
      gender: 'men',
      sku: 'EXP-M-EMB-BEG-001',
      isFeatured: true,
      material: '100% cotton',
      fit: 'Regular',
      tags: '["embroidery", "premium", "minimal"]',
    },

    // Women Products
    {
      name: 'EXPENDABLES Oversized Tee - Black',
      slug: 'expendables-oversized-tee-black-women',
      description: 'Relaxed oversized fit designed for comfort and style. Perfect for a laid-back look.',
      shortDescription: 'Relaxed oversized tee for women.',
      price: 3500,
      categoryId: womenCategory.id,
      gender: 'women',
      sku: 'EXP-W-OVR-BLK-001',
      isNew: true,
      isBestSeller: true,
      material: '80% cotton, 20% polyester',
      fit: 'Oversized',
      tags: '["oversized", "relaxed", "new"]',
    },
    {
      name: 'EXPENDABLES Crop Tee - White',
      slug: 'expendables-crop-tee-white',
      description: 'Modern crop tee with a flattering cut. Made from soft breathable fabric.',
      shortDescription: 'Modern crop tee in soft breathable fabric.',
      price: 3000,
      categoryId: womenCategory.id,
      gender: 'women',
      sku: 'EXP-W-CRP-WHT-001',
      isFeatured: true,
      material: '100% cotton',
      fit: 'Crop',
      tags: '["crop", "modern", "summer"]',
    },
    {
      name: 'EXPENDABLES Printed Tee - Pink',
      slug: 'expendables-printed-tee-pink',
      description: 'Vibrant printed design with soft comfortable fabric. Express your style.',
      shortDescription: 'Vibrant printed tee for women.',
      price: 3500,
      salePrice: 2800,
      categoryId: womenCategory.id,
      gender: 'women',
      sku: 'EXP-W-PRT-PNK-001',
      onSale: true,
      material: '100% cotton',
      fit: 'Regular',
      tags: '["printed", "vibrant", "sale"]',
    },
    {
      name: 'EXPENDABLES Embroidery Tee - Blue',
      slug: 'expendables-embroidery-tee-blue-women',
      description: 'Delicate embroidery on premium cotton. Elegant and comfortable.',
      shortDescription: 'Premium tee with delicate embroidery.',
      price: 5200,
      categoryId: womenCategory.id,
      gender: 'women',
      sku: 'EXP-W-EMB-BLU-001',
      material: '100% cotton',
      fit: 'Regular',
      tags: '["embroidery", "elegant", "premium"]',
    },

    // Unisex Products
    {
      name: 'EXPENDABLES Unisex Oversized Tee - Black',
      slug: 'expendables-unisex-oversized-tee-black',
      description: 'Ultimate comfort in unisex oversized fit. Perfect for everyone.',
      shortDescription: 'Unisex oversized tee for ultimate comfort.',
      price: 3500,
      categoryId: unisexCategory.id,
      gender: 'unisex',
      sku: 'EXP-U-OVR-BLK-001',
      isFeatured: true,
      isBestSeller: true,
      material: '80% cotton, 20% polyester',
      fit: 'Oversized',
      tags: '["unisex", "oversized", "bestseller"]',
    },
    {
      name: 'EXPENDABLES Minimal Logo Tee - White',
      slug: 'expendables-minimal-logo-tee-white',
      description: 'Clean minimal design with subtle logo. Timeless and versatile.',
      shortDescription: 'Minimal logo tee in classic white.',
      price: 3000,
      categoryId: unisexCategory.id,
      gender: 'unisex',
      sku: 'EXP-U-MIN-WHT-001',
      isNew: true,
      material: '100% cotton',
      fit: 'Regular',
      tags: '["minimal", "unisex", "timeless"]',
    },
    {
      name: 'EXPENDABLES Premium Cotton Tee - Grey',
      slug: 'expendables-premium-cotton-tee-grey',
      description: 'Luxury premium cotton fabric. The finest quality for ultimate comfort.',
      shortDescription: 'Premium cotton tee in luxury quality.',
      price: 4500,
      categoryId: unisexCategory.id,
      gender: 'unisex',
      sku: 'EXP-U-PRM-GRY-001',
      isFeatured: true,
      material: '100% premium cotton',
      fit: 'Regular',
      tags: '["premium", "luxury", "cotton"]',
    },
  ];

  // Create products with images and variants
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Pink', hex: '#FFC0CB' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });

    // Add product images (using placeholder images)
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: `https://placehold.co/800x1000/333/FFF?text=${encodeURIComponent(product.name)}`,
          altText: product.name,
          sortOrder: 1,
          isPrimary: true,
        },
        {
          productId: product.id,
          url: `https://placehold.co/800x1000/555/FFF?text=${encodeURIComponent(product.name + ' - Back')}`,
          altText: `${product.name} - Back View`,
          sortOrder: 2,
        },
        {
          productId: product.id,
          url: `https://placehold.co/800x1000/777/FFF?text=${encodeURIComponent(product.name + ' - Side')}`,
          altText: `${product.name} - Side View`,
          sortOrder: 3,
        },
      ],
    });

    // Add product variants (size and color combinations)
    const productColors = colors.slice(0, 3); // Use 3 colors per product
    for (const color of productColors) {
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            color: color.name,
            colorHex: color.hex,
            sku: `${product.sku}-${size}-${color.name.substring(0, 3).toUpperCase()}`,
            stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
            isActive: true,
          },
        });
      }
    }
  }

  console.log('✅ Created products with images and variants');

  // Create Coupons
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setMonth(futureDate.getMonth() + 3);

  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 2000,
        validFrom: now,
        validUntil: futureDate,
        isActive: true,
      },
      {
        code: 'SAVE500',
        description: 'Save Rs. 500 on orders above Rs. 5000',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 5000,
        maxDiscount: 500,
        validFrom: now,
        validUntil: futureDate,
        isActive: true,
      },
      {
        code: 'FIRSTBUY',
        description: 'First purchase - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 3000,
        maxDiscount: 1000,
        perUserLimit: 1,
        validFrom: now,
        validUntil: futureDate,
        isActive: true,
      },
    ],
  });

  console.log('✅ Created coupons');

  // Create Site Settings
  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'announcement_bar',
        value: JSON.stringify([
          'ORDERS WILL TAKE 4 TO 6 WORKING DAYS FOR DELIVERY',
          'FREE SHIPPING FOR ORDERS ABOVE Rs. 9,999',
          'ISLANDWIDE DELIVERY AVAILABLE',
        ]),
        type: 'json',
      },
      {
        key: 'free_shipping_threshold',
        value: '9999',
        type: 'number',
      },
      {
        key: 'site_name',
        value: 'EXPENDABLES',
        type: 'text',
      },
      {
        key: 'contact_email',
        value: 'info@expendables.com',
        type: 'text',
      },
      {
        key: 'contact_phone',
        value: '+94 11 234 5678',
        type: 'text',
      },
      {
        key: 'customer_care_phone',
        value: '+94 77 123 4567',
        type: 'text',
      },
    ],
  });

  console.log('✅ Created site settings');

  // Create Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'subscriber1@example.com' },
      { email: 'subscriber2@example.com' },
      { email: 'subscriber3@example.com' },
    ],
  });

  console.log('✅ Created newsletter subscribers');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📝 Default Credentials:');
  console.log('   Admin: admin@expendables.com / Admin@123');
  console.log('   Customer: customer@test.com / Customer@123');
  console.log('');
  console.log('🛍️  Created 12 sample products with variants');
  console.log('🎫 Created 3 active coupons');
  console.log('📂 Created complete category structure');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
