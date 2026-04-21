const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantityKg: Number,
      pricePerKg: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);