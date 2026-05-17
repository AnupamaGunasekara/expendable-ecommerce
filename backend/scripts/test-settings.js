const prisma = require('../config/database');

async function testSettings() {
  try {
    console.log('Testing site_settings table...\n');
    
    const settings = await prisma.siteSetting.findMany();
    console.log('Settings found:', settings.length);
    console.log('Settings:', JSON.stringify(settings, null, 2));
    
    console.log('\n✅ Settings test successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSettings();
