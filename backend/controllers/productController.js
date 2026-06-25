const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");

exports.productValidationRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("description").optional().trim()
];

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const imageFilename = req.file ? req.file.filename : "";

    await db.query(
      "INSERT INTO products (name, price, category, stock, image, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.name,
        req.body.price,
        req.body.category,
        req.body.stock,
        imageFilename,
        req.body.description || ""
      ]
    );

    res.json({ message: "Product Added Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = Number(req.params.id);
    const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const oldProduct = rows[0];
    let imageFilename = oldProduct.image;

    if (req.file) {
      imageFilename = req.file.filename;
      // Delete the old image if it changes
      if (oldProduct.image) {
        const oldImagePath = path.join(__dirname, "../uploads", oldProduct.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log("Old image not deleted:", err.message);
        });
      }
    }

    await db.query(
      "UPDATE products SET name = ?, price = ?, category = ?, stock = ?, image = ?, description = ? WHERE id = ?",
      [
        req.body.name,
        req.body.price,
        req.body.category,
        req.body.stock,
        imageFilename,
        req.body.description || "",
        id
      ]
    );

    res.json({ message: "Product Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];
    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Image not deleted:", err.message);
      });
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
