require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');
const Payment = require('./models/Payments');

async function testDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB Connected Successfully!');

    // Generate unique identifiers
    const uniqueSuffix = Date.now(); // timestamp
    const username = `testuser_${uniqueSuffix}`;
    const email = `${username}@example.com`;
    const productId = `P${uniqueSuffix}`;

    // 1️⃣ Create a dummy User
    const user = await User.create({
      username,
      email,
      passwordHash: 'hashedpassword123',
      role: 'customer',
      firstName: 'Test',
      lastName: 'User',
      contactNumber: '1234567890',
      address: '123 Main St'
    });
    console.log('✅ User created:', user._id);

    // 2️⃣ Create a dummy Product
    const product = await Product.create({
      productId,
      name: `Sample Product ${uniqueSuffix}`,
      description: 'This is a test product',
      category: 'Food',
      brand: 'BrandX',
      price: 100,
      image_url: 'http://example.com/image.jpg',
      stock_quantity: 50
    });
    console.log('✅ Product created:', product._id);

    // 3️⃣ Create a dummy Payment
    const payment = await Payment.create({
      userId: user._id,
      paymentType: 'order_paymnet',
      amount: 100,
      status: 'success',
      paymentDate: new Date()
    });
    console.log('✅ Payment created:', payment._id);

    // 4️⃣ Create a dummy Order
    const order = await Order.create({
      customerId: user._id,
      items: [{
        productId: product._id,
        quantity: 2,
        priceAtOrder: 100
      }],
      amount: 200,
      address: user._id,
      status: 'Processing',
      paymentId: payment._id
    });
    console.log('✅ Order created:', order._id);

    console.log('\n🎉 All models are working correctly!');
  } catch (err) {
    console.error('❌ Error testing database:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

testDatabase();
