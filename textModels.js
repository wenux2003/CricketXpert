import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

import Product from "./models/Product.js";
import Order from "./models/Order.js";
import User from "./models/User.js"; // Assuming you have a User model

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const testModels = async () => {
  await connectDB();

  try {
    // 1. Create a sample user (replace with real user if exists)
    const user = await User.create({
      username: "cricketFan123",
      email: "fan123@example.com",
      passwordHash: "hashedpassword123",
    });

    // 2. Create sample products
    const product1 = await Product.create({
      name: "Cricket Bat",
      description: "Professional grade cricket bat",
      price: 150,
      category: "Bat",
      stock: 10,
    });

    const product2 = await Product.create({
      name: "Cricket Ball",
      description: "Leather cricket ball",
      price: 20,
      category: "Ball",
      stock: 50,
    });

    console.log("Sample products created:", product1.name, product2.name);

    // 3. Create an order
    const order = await Order.create({
      customerId: user._id,
      orderItems: [
        { productId: product1._id, quantity: 1, priceAtOrder: product1.price },
        { productId: product2._id, quantity: 5, priceAtOrder: product2.price },
      ],
      totalAmount: product1.price * 1 + product2.price * 5,
      deliveryAddress: "123 Cricket Street, Colombo",
      paymentMethod: "Card",
      paymentStatus: "Completed",
      orderStatus: "Processing",
    });

    console.log("Order created:", order._id);

    // 4. Fetch order with populated product details
    const fetchedOrder = await Order.findById(order._id)
      .populate("customerId", "username email")
      .populate("orderItems.productId", "name price category");

    console.log("Fetched Order with populated details:", JSON.stringify(fetchedOrder, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
testModels();
