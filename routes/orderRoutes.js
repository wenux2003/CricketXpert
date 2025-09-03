const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus, 
  updateOrder,
  deleteOrder, 
  calculateOrderTotal, 
  getOrdersByStatus,
  createCartOrder,
  getCartOrder,
  completeCartOrder,
  deleteCartOrder
} = require('../controllers/orderController');

// Regular order routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrderStatus);
router.put('/:id/details', updateOrder);
router.delete('/:id', deleteOrder);

// Cart order routes
router.post('/cart', createCartOrder);
router.get('/cart/:customerId', getCartOrder);
router.put('/cart/complete', completeCartOrder);
router.delete('/cart/:customerId', deleteCartOrder);

// Utility routes
router.post("/calculate-total", calculateOrderTotal);
router.get("/status/:status", getOrdersByStatus);

module.exports = router;
