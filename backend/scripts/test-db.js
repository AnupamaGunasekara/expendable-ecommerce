const prisma = require('../config/database');

async function testDatabase() {
  try {
    console.log('Testing database connection...\n');
    
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const adminCount = await prisma.adminUser.count();
    const userCount = await prisma.user.count();
    
    console.log('=== Database Stats ===');
    console.log('Categories:', categoryCount);
    console.log('Products:', productCount);
    console.log('Admin Users:', adminCount);
    console.log('Users:', userCount);
    console.log('\n');
    
    if (categoryCount > 0) {
      console.log('=== Sample Categories ===');
      const categories = await prisma.category.findMany({ take: 5 });
      categories.forEach(cat => {
        console.log(`- ${cat.name} (${cat.slug}) - Active: ${cat.isActive}`);
      });
      console.log('\n');
    }
    
    if (productCount > 0) {
      console.log('=== Sample Products ===');
      const products = await prisma.product.findMany({ 
        take: 3,
        include: { category: true }
      });
      products.forEach(prod => {
        console.log(`- ${prod.name} (${prod.sku}) - Category: ${prod.category?.name}`);
      });
      console.log('\n');
    }
    
    if (adminCount > 0) {
      console.log('=== Admin Users ===');
      const admins = await prisma.adminUser.findMany();
      admins.forEach(admin => {
        console.log(`- ${admin.email} (${admin.firstName} ${admin.lastName}) - Active: ${admin.isActive}`);
      });
    }
    
    console.log('\n✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testDatabase();
