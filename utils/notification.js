const nodemailer = require('nodemailer');

// Create transporter with multiple fallback options
const createTransporter = () => {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  // Try different configurations
  const configs = [
    // Configuration 1: Standard Gmail with SSL
    {
      ...config,
      secure: true,
      port: 465
    },
    // Configuration 2: Gmail with TLS
    {
      ...config,
      secure: false,
      port: 587,
      requireTLS: true
    },
    // Configuration 3: Gmail with OAuth2-like settings
    {
      ...config,
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false
      }
    }
  ];

  // Try each configuration until one works
  for (let i = 0; i < configs.length; i++) {
    try {
      const transporter = nodemailer.createTransport(configs[i]);
      console.log(`✅ Email transporter created with configuration ${i + 1}`);
      return transporter;
    } catch (error) {
      console.log(`❌ Configuration ${i + 1} failed:`, error.message);
      if (i === configs.length - 1) {
        throw error;
      }
    }
  }
};

let transporter = null;

// Send email with optional attachment
exports.sendEmail = async (to, subject, text, attachmentBuffer = null, filename = '') => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured!');
      console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
      console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
      return false;
    }

    // Create transporter if not exists
    if (!transporter) {
      transporter = createTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    if (attachmentBuffer && filename) {
      mailOptions.attachments = [
        {
          filename,
          content: attachmentBuffer
        }
      ];
    }

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');
    } catch (verifyError) {
      console.log('⚠️ Transporter verification failed, trying to recreate...');
      transporter = createTransporter();
      await transporter.verify();
      console.log('✅ Email transporter recreated and verified successfully');
    }

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} with subject: "${subject}"`);
    return true;
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    
    // Provide specific error guidance
    if (err.message.includes('Invalid login') || err.message.includes('Missing credentials')) {
      console.error('💡 Gmail Authentication Issue - Please check:');
      console.error('   1. Your Gmail account has 2-factor authentication enabled');
      console.error('   2. You have generated an app password for this application');
      console.error('   3. The app password in .env file is correct');
      console.error('   4. Your Gmail account allows "less secure app access" or uses app passwords');
      console.error('');
      console.error('📧 To fix this:');
      console.error('   1. Go to your Google Account settings');
      console.error('   2. Enable 2-factor authentication');
      console.error('   3. Generate an app password for "Mail"');
      console.error('   4. Update the EMAIL_PASS in your .env file with the new app password');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('💡 Network/DNS Issue - Check your internet connection');
    }
    
    return false;
  }
};
