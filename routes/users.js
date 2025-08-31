const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUsersByRole,
  getUserStats,
  toggleUserStatus
} = require('../controllers/userController');

// Middleware (Note: You'll need to implement these middleware functions)
// const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', createUser); // Public registration

// Protected routes (uncomment when auth middleware is available)
// router.use(protect); // Require authentication for all routes below

// General user routes
router.get('/:id', getUser); // Get single user profile
router.put('/:id', updateUser); // Update user profile
router.put('/:id/password', changePassword); // Change password

// Admin only routes
router.get('/', /* authorize('admin'), */ getAllUsers); // Get all users
router.post('/', /* authorize('admin'), */ createUser); // Admin create user
router.delete('/:id', /* authorize('admin'), */ deleteUser); // Delete/deactivate user
router.put('/:id/status', /* authorize('admin'), */ toggleUserStatus); // Change user status
router.get('/stats/overview', /* authorize('admin'), */ getUserStats); // Get user statistics

// Role-based user retrieval
router.get('/role/:role', /* authorize('admin', 'coaching_manager', 'order_manager', 'ground_manager', 'service_manager'), */ getUsersByRole);

module.exports = router;

