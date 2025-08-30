const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, deleteOrder, calculateOrderTotal, getOrdersByStatus} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

router.post("/calculate-total",calculateOrderTotal);
router.get("/status/:status",getOrdersByStatus);

module.exports = router;
