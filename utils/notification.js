const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email with optional attachment
exports.sendEmail = async (to, subject, text, attachmentBuffer = null, filename = '') => {
  try {
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

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: "${subject}"`);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
};
