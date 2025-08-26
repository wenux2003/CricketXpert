const Cart = require('../models/cart');
const Product = require('./models/product');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        priceAtAdd: product.price
      });
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.priceAtAdd);
    }, 0);

    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await Cart.findOne({ sessionId }).populate('items.productId');
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.priceAtAdd);
    }, 0);

    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.quantity * item.priceAtAdd);
    }, 0);

    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await Cart.findOneAndDelete({ sessionId });
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};