const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin");

const {
  getOrders,
  createOrder,
  updateOrderStatus
} = require("../controllers/orderController");

// GET all orders (admin only)
router.get("/", requireAdmin, getOrders);

// CREATE a new order (public)
router.post("/", createOrder);

// UPDATE order status (admin only)
router.put("/:id", requireAdmin, updateOrderStatus);

module.exports = router;
