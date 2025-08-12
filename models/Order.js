import mongoose from "mongoose";

// Schema for items in the order
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product model
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true, min: 0 }
});

// Main Order schema
const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true
  },
  items: {
    type: [orderItemSchema], // Array of products with quantity and price
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // get address from the User table
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Food Processing"
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment", // Reference to Payment model
    required: true
  }
});

export default mongoose.model("Order", orderSchema);
