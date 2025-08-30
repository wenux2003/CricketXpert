const nodemailer = require('nodemailer');

// --- Main Configuration ---
// It now reads the user and password from your .env file
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Nodemailer transport verification error:', error);
  } else {
    console.log('Nodemailer transport is ready to send emails.');
  }
});

// --- Function 1: Welcome Email ---
const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Send from your main email
    to: email,
    subject: 'Welcome to CricketExpert!',
    html: `<h1>Hi ${username},</h1><p>Welcome to the team! We're glad to have you on board.</p>`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${email}: ${info.response}`);
};

// --- Function 2: New User Notification for Manager ---
// This function sends an alert to the service manager
const sendNewUserNotification = async (newUser) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.SERVICE_MANAGER_EMAIL, // Sends to the manager's email
        subject: 'New User Registration',
        html: `
            <h2>A new user has registered on CricketExpert:</h2>
            <ul>
                <li><strong>Username:</strong> ${newUser.username}</li>
                <li><strong>Email:</strong> ${newUser.email}</li>
                <li><strong>First Name:</strong> ${newUser.firstName}</li>
                <li><strong>Last Name:</strong> ${newUser.lastName}</li>
                <li><strong>Registered At:</strong> ${new Date(newUser.createdAt).toLocaleString()}</li>
            </ul>
        `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`New user notification sent to service manager: ${info.response}`);
};


// --- Function 3: Password Reset Code Email ---
const sendPasswordResetCodeEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Password Reset Code',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Use the following code to reset your password:</p>
      <h3><strong>${code}</strong></h3>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Password reset code sent to ${email}`);
};

module.exports = {
  sendWelcomeEmail,
  sendNewUserNotification,
  sendPasswordResetCodeEmail,
};
