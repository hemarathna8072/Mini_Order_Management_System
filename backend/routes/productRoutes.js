const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  res.json(await Product.find());
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

module.exports = router;