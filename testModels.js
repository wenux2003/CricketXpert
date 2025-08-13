import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

// Import DB connection function
import connectDB from "./config/db.js";

// Import your models
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Payment from "./models/Payments.js";

async function testDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB(); // uses MONGO_URI from .env
    console.log("✅ MongoDB Connected Successfully!");

    // 1️⃣ Create a dummy User
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      passwordHash: "hashedpassword123",
      role: "customer",
      firstName: "Test",
      lastName: "User",
      contactNumber: "1234567890",
      address: "123 Main St"
    });
    console.log("✅ User created:", user._id);

    // 2️⃣ Create a dummy Product
    const product = await Product.create({
      productId: "P1001",
      name: "Sample Product",
      description: "This is a test product",
      category: "Food",
      brand: "BrandX",
      price: 100,
      image_url: "http://example.com/image.jpg",
      stock_quantity: 50
    });
    console.log("✅ Product created:", product._id);

    // 3️⃣ Create a dummy Payment
    const payment = await Payment.create({
      userId: user._id,
      paymentType: "order_paymnet",
      amount: 100,
      status: "success",
      paymentDate: new Date()
    });
    console.log("✅ Payment created:", payment._id);

    // 4️⃣ Create a dummy Order
    const order = await Order.create({
      customerId: user._id,
      items: [{
        productId: product._id,
        quantity: 2,
        priceAtOrder: 100
      }],
      amount: 200,
      address: user._id, // using user ID as address reference
      status: "Processing",
      paymentId: payment._id
    });
    console.log("✅ Order created:", order._id);

    console.log("\n🎉 All models are working correctly!");
  } catch (err) {
    console.error("❌ Error testing database:", err);
  } finally {
    await mongoose.connection.close();
  }
}

testDatabase();


