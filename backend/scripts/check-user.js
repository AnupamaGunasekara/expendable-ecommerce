const prisma = require('../config/database');

async function checkUser() {
  try {
    console.log('Checking users in database...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });
    
    console.log(`Total users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\nTo create a test user, you can use the register endpoint:');
      console.log('POST http://localhost:5030/api/auth/register');
      console.log('Body: {');
      console.log('  "email": "test@example.com",');
      console.log('  "password": "Test@123",');
      console.log('  "firstName": "Test",');
      console.log('  "lastName": "User",');
      console.log('  "phone": "1234567890"');
      console.log('}');
    } else {
      console.log('✅ Users found:\n');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Phone: ${user.phone || 'N/A'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    // Check admins too
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    
    console.log(`\nTotal admins: ${admins.length}\n`);
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Admin ID: ${admin.id}, Email: ${admin.email}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
