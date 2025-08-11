import mongoose from "mongoose";

// Sub-schema for order items
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  category: { type: String, enum: ["Bat", "Ball", "Helmet", "Pads", "Gloves", "Other"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrder: { type: Number, required: true, min: 0 }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  amount: { type: Number, required: true, min: 0 },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Sri Lanka" }
  },
  status: { 
    type: String, 
    enum: ["Processing", "Out for Delivery", "Delivered", "Cancelled"], 
    default: "Processing" 
  },
  orderDate: { type: Date, default: Date.now },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" } // ..................Linking payment table...................
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
