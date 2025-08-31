const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile,
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin,
} = require('../controllers/userController.js');

// We need to import the new authorizeRoles middleware
const { protect, authorizeRoles } = require('../utils/protect.js');

// --- Routes for the logged-in user managing their OWN profile ---
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// --- ADMIN-ONLY ROUTES ---

// Get all users & create a new user
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.post('/', protect, authorizeRoles('admin'), createUserByAdmin);

// Update or Delete a specific user by their ID
router.put('/:id', protect, authorizeRoles('admin'), updateUserByAdmin);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUserByAdmin);


module.exports = router;
