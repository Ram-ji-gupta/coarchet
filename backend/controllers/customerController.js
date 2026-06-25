const db = require("../config/db");

// GET CUSTOMERS
exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD CUSTOMER
exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    await db.query(
      "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
      [name, phone, email || null, address]
    );
    res.json({ message: "Customer Added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("DELETE FROM customers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, phone, email, address } = req.body;
    const [result] = await db.query(
      "UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?",
      [name, phone, email || null, address, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
