import mongoose from "mongoose";

// Sub-schema for items in the order
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product table
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true, min: 0 }
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User table
    required: true
=======
=======
>>>>>>> Stashed changes
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  amount: { type: Number, required: true, min: 0 },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Sri Lanka" }
>>>>>>> Stashed changes
  },
  items: {
    type: [orderItemSchema], // Array of products with quantity & price
    required: true
  },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Processing"
  },
  orderDate: { type: Date, default: Date.now },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment", // Reference to Payment table
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
