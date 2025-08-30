const express = require('express');
const router = express.Router();
const {
  createPayment,
  processPaymentCompletion,
  getPaymentById,
  getUserPayments,
  processRefund,
  getPaymentStats,
  generateReceipt
} = require('../controllers/paymentController');

// @route   POST /api/payments
// @desc    Create payment record
// @access  Private (Customer)
router.post('/', createPayment);

// @route   POST /api/payments/webhook/completion
// @desc    Process payment completion (webhook)
// @access  Public (Payment provider webhook)
router.post('/webhook/completion', processPaymentCompletion);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private (User or Admin)
router.get('/:id', getPaymentById);

// @route   GET /api/payments/user/:userId
// @desc    Get user payments
// @access  Private (User themselves or Admin)
router.get('/user/:userId', getUserPayments);

// @route   POST /api/payments/:paymentId/refund
// @desc    Process refund
// @access  Private (Admin only)
router.post('/:paymentId/refund', processRefund);

// @route   GET /api/payments/stats
// @desc    Get payment statistics
// @access  Private (Admin or Coach Manager)
router.get('/stats', getPaymentStats);

// @route   GET /api/payments/:paymentId/receipt
// @desc    Generate payment receipt
// @access  Private (User or Admin)
router.get('/:paymentId/receipt', generateReceipt);

module.exports = router;
