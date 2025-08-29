const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
// --- IMPORT THE EMAIL FUNCTIONS from your new file ---
const { sendWelcomeEmail, sendNewUserNotification } = require('../utils/wemailService.js');

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
      profileImageURL: profileImageURL || '',
      email,
      username,
      passwordHash,
    });

    // 4. Save the user to the database
    const newUser = await user.save();

    if (newUser) {
      // --- SEND EMAILS AFTER USER IS SAVED ---
      try {
        // Call the functions you imported
        await sendWelcomeEmail(newUser.email, newUser.username);
        await sendNewUserNotification(newUser);
      } catch (emailError) {
        // Log the error but don't stop the process if emails fail
        console.error('Failed to send registration emails:', emailError);
      }

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
