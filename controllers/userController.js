const User = require('../models/User');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// GET a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// CREATE a new user
const createUser = async (req, res) => {
  const { username, email, passwordHash, role, firstName, lastName, contactNumber, address, profileImageURL } = req.body;
  try {
    const newUser = new User({
      username,
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      contactNumber,
      address,
      profileImageURL
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
