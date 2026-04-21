const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    // 🔴 Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/; // Indian format

    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number"
      });
    }

    let totalAmount = 0;
    const updatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.availableKg < item.quantityKg) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      totalAmount += product.pricePerKg * item.quantityKg;

      updatedItems.push({
        productId: item.productId,
        quantityKg: item.quantityKg,
        pricePerKg: product.pricePerKg
      });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      items: updatedItems,
      totalAmount,
      status: "Pending"
    });

    res.json(order);

  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate("items.productId");
  res.json(orders);
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Prevent invalid transitions
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Cancelled order cannot be updated" });
    }

    // 🔻 Pending → Confirmed → Deduct stock
    if (status === "Confirmed" && order.status === "Pending") {
      for (let item of order.items) {
        const product = await Product.findById(item.productId);

        if (product.availableKg < item.quantityKg) {
          return res.status(400).json({ message: "Insufficient stock" });
        }

        product.availableKg -= item.quantityKg;
        await product.save();
      }
    }

    // 🔺 Confirmed → Cancelled → Restore stock
    if (status === "Cancelled" && order.status === "Confirmed") {
      for (let item of order.items) {
        const product = await Product.findById(item.productId);
        product.availableKg += item.quantityKg;
        await product.save();
      }
    }

    // ✅ Delivered → no stock change
    // ✅ Pending → Cancelled → no stock change

    order.status = status;
    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getSummary = async (req, res) => {
  const orders = await Order.find();

  const totalOrders = orders.length;

  // 💰 Only count confirmed + delivered
  const totalRevenue = orders
    .filter(o => o.status === "Confirmed" || o.status === "Delivered")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pending = orders.filter(o => o.status === "Pending").length;

  res.json({ totalOrders, totalRevenue, pending });
};