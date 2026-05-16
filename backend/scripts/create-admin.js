const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

// Script to create a new admin user
async function createAdmin() {
  try {
    const email = 'anupamagunasekara7@gmail.com';
    const password = 'admin123';
    const firstName = 'Anupama';
    const lastName = 'Gunasekara';

    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'admin',
        isActive: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', firstName, lastName);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
