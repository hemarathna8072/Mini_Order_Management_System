const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");

router.post("/", ctrl.createOrder);
router.get("/", ctrl.getOrders);
router.patch("/:id/status", ctrl.updateStatus);
router.get("/summary", ctrl.getSummary);

module.exports = router;