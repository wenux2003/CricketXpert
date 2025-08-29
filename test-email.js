const { sendEmail } = require('./utils/notification');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email functionality...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
  console.log('SERVICE_MANAGER_EMAIL:', process.env.SERVICE_MANAGER_EMAIL ? 'Set' : 'Not set');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured!');
    return;
  }
  
  try {
    const result = await sendEmail(
      process.env.SERVICE_MANAGER_EMAIL || 'test@example.com',
      'Test Email from CricketXpert',
      'This is a test email to verify the email functionality is working properly.'
    );
    
    if (result) {
      console.log('✅ Email test successful!');
    } else {
      console.log('❌ Email test failed!');
    }
  } catch (error) {
    console.error('❌ Email test error:', error.message);
  }
}

testEmail();
