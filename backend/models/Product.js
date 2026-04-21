const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  pricePerKg: Number,
  availableKg: Number,
  category: {
    type: String,
    enum: ["Broiler", "Layer", "Country"]
  }
});

module.exports = mongoose.model("Product", productSchema);