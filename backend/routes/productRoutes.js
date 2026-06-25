// backend/routes/productRoutes.js

const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  productValidationRules
} = require("../controllers/productController");


// ==========================
// GET ALL PRODUCTS (public)
// ==========================

router.get("/", getProducts);


// ==========================
// GET SINGLE PRODUCT (public)
// ==========================

router.get("/:id", getProductById);


// ==========================
// ADD PRODUCT (admin only)
// ==========================

router.post("/", requireAdmin, upload.single("image"), productValidationRules, addProduct);


// ==========================
// UPDATE PRODUCT (admin only)
// ==========================

router.put("/:id", requireAdmin, upload.single("image"), productValidationRules, updateProduct);


// ==========================
// DELETE PRODUCT (admin only)
// ==========================

router.delete("/:id", requireAdmin, deleteProduct);


module.exports = router;