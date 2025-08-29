const nodemailer = require('nodemailer');

// --- Main Configuration ---
// It now reads the user and password from your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Fetches from .env
    pass: process.env.EMAIL_PASS, // Fetches from .env
  },
});

// --- Function 1: Welcome Email ---
const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Send from your main email
    to: email,
    subject: 'Welcome to CricketExpert!',
    html: `<h1>Hi ${username},</h1><p>Welcome to the team! We're glad to have you on board.</p>`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${email}`);
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
    await transporter.sendMail(mailOptions);
    console.log(`New user notification sent to service manager.`);
};


module.exports = {
  sendWelcomeEmail,
  sendNewUserNotification,
};
