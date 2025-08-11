import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  order_id:         { type: String, required: true, unique: true },
  customer_id:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order_items:      [productSchema],
  subtotal_price:   { type: Number, required: true, min: 0 },
  delivery_charge:  { type: Number, default: 0 },
  total_price:      { type: Number, required: true, min: 0 },
  delivery_address: User, // This is *copied* from user at checkout, not referenced
  payment_method:   { type: String, required: true, enum: ["COD", "Online", "Card", "UPI"] },
  payment_status:   { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  status:           {
    type: String,
    enum: ["Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Processing"
  },
  tracking_number:  { type: String },
}, {
  timestamps: { createdAt: 'order_date', updatedAt: 'updated_at' }
});

export default mongoose.model("Order", orderSchema);
