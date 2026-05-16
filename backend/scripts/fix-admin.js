const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  try {
    const email = 'anupamagunasekara7@gmail.com';
    const password = 'admin123';

    console.log('\n🔍 Checking existing admin...');
    
    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('✅ Admin found:', email);
      console.log('Current password hash:', existingAdmin.password);
      console.log('\n🔄 Updating password...');
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('New password hash:', hashedPassword);
      
      // Update admin
      await prisma.adminUser.update({
        where: { email },
        data: { 
          password: hashedPassword,
          isActive: true 
        }
      });
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('❌ Admin not found. Creating new admin...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hash:', hashedPassword);
      
      // Create admin
      const admin = await prisma.adminUser.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Anupama',
          lastName: 'Gunasekara',
          role: 'admin',
          isActive: true,
        }
      });
      
      console.log('✅ Admin created successfully!');
    }

    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n✅ You can now login at: http://localhost:3000/admin/login\n');
    
    // Test password comparison
    const testAdmin = await prisma.adminUser.findUnique({ where: { email } });
    const isValid = await bcrypt.compare(password, testAdmin.password);
    console.log('🔐 Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixAdmin();
