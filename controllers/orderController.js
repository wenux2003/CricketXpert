const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create cart order (pending order when items are added to cart)
exports.createCartOrder = async (req, res) => {
  try {
    const { customerId, items, amount, address } = req.body;
    
    // Check if user already has a pending cart order
    let existingCartOrder = await Order.findOne({ 
      customerId, 
      status: 'cart_pending' 
    });

    if (existingCartOrder) {
      // Update existing cart order
      existingCartOrder.items = items;
      existingCartOrder.amount = amount;
      existingCartOrder.address = address;
      existingCartOrder.date = new Date();
      await existingCartOrder.save();
      res.json(existingCartOrder);
    } else {
      // Create new cart order
      const cartOrder = new Order({
        customerId,
        items,
        amount,
        address,
        status: 'cart_pending',
        date: new Date()
      });
      await cartOrder.save();
      res.status(201).json(cartOrder);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get cart order for a user
exports.getCartOrder = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cartOrder = await Order.findOne({ 
      customerId, 
      status: 'cart_pending' 
    }).populate('items.productId');
    
    if (!cartOrder) {
      return res.status(404).json({ message: 'No pending cart order found' });
    }
    
    res.json(cartOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart order to completed order (when payment is successful)
exports.completeCartOrder = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'cart_pending') {
      return res.status(400).json({ message: 'Order is not in cart pending status' });
    }
    
    // Update order status and add payment ID
    order.status = 'created';
    order.paymentId = paymentId;
    order.date = new Date();
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete cart order (when user clears cart)
exports.deleteCartOrder = async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await Order.deleteOne({ 
      customerId, 
      status: 'cart_pending' 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No pending cart order found' });
    }
    
    res.json({ message: 'Cart order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update order status
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};*/



// Manual order status update by manager
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['created', 'processing', 'completed', 'cancelled', 'cart_pending'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//.......................................................................................................................
// Calculate order total with delivery
exports.calculateOrderTotal = async (req, res) => {
  try {
    const { items } = req.body;
    const deliveryCharge = 450; // Fixed delivery charge as mentioned
    
    let subtotal = 0;
    
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productId}` 
        });
      }
      subtotal += product.price * item.quantity;
    }
    
    const total = subtotal + deliveryCharge;
    
    res.json({
      subtotal,
      deliveryCharge,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ status })
      .populate('items.productId')
      .populate('paymentId')
      .sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
