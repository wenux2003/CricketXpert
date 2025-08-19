const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

// A placeholder for a future email sending service
const sendWelcomeEmail = async (email, username) => {
  // In the future, you would integrate a service like Nodemailer or SendGrid here.
  console.log(`--- Sending welcome email to ${email} for user ${username} ---`);
  // For now, we just log to the console.
  return Promise.resolve();
};


// @desc    Register a new user from a multi-step form
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    contactNumber,
    address,
    profileImageURL,
    email,
    username,
    password
  } = req.body;

  // --- Basic Validation ---
  if (!firstName || !lastName || !email || !username || !password) {
    return res.status(400).json({ message: 'Please fill out all required fields.' });
  }

  try {
    // 1. Check if email or username already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create a new user object with all the data
    const user = new User({
      firstName,
      lastName,
      dob,
      contactNumber,
      address,
      profileImageURL: profileImageURL || '', // Handle optional field
      email,
      username,
      passwordHash,
      // role and status will use the default values from your schema ('customer', 'active')
    });

    // 4. Save the user to the database
    const newUser = await user.save();

    if (newUser) {
      // --- Future Implementation Hooks ---
      // After user is successfully created, send a welcome email.
      // We use .catch() so that if the email fails, it doesn't break the registration flow.
      sendWelcomeEmail(newUser.email, newUser.username).catch(err => {
        console.error("Failed to send welcome email:", err);
      });
      // You could add a notification service call here as well.

      // 5. Send a success response to the frontend
      res.status(201).json({
        message: 'User registered successfully!',
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
};
