const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
  updatePayment,
  deletePayment,
  getPaymentsByUser,
  getPaymentsByOrder,
  processOrderPayment,
  processRefund,
  getPaymentStats
} = require('../controllers/paymentController');

// Basic CRUD routes
router.post('/', createPayment);
router.get('/', getPayments);
router.get('/stats', getPaymentStats);
router.get('/:id', getPayment);
router.put('/:id', updatePayment);
router.put('/:id/status', updatePaymentStatus);
router.delete('/:id', deletePayment);

// Specific functionality routes
router.get('/user/:userId', getPaymentsByUser);
router.get('/order/:orderId', getPaymentsByOrder);
router.post('/process-order', processOrderPayment);
router.post('/:paymentId/refund', processRefund);

module.exports = router;