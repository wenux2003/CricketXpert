const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Sender email
    pass: process.env.EMAIL_PASS    // App password
  }
});

// Function to send email
exports.sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: "${subject}"`);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
};
