const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/requireAdmin");

const {
  getCustomers,
  addCustomer,
  deleteCustomer
} = require("../controllers/customerController");

// GET all customers (admin only)
router.get("/", requireAdmin, getCustomers);

// CREATE customer (public for checkout)
router.post("/", addCustomer);

// DELETE customer (admin only)
router.delete("/:id", requireAdmin, deleteCustomer);

module.exports = router;