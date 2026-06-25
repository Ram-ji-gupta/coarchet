const db = require("../config/db");

// ==========================
// GET ALL ORDERS
// ==========================
exports.getOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// CREATE ORDER
// ==========================
exports.createOrder = async (req, res) => {
  try {
    const { customer, phone, email, address, custom_requirement, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    items.forEach(item => total += Number(item.price) * Number(item.qty));

    // Enrich items with product names from DB
    const itemsDetailed = [];
    for (const item of items) {
      const [rows] = await db.query("SELECT name, description FROM products WHERE id = ? LIMIT 1", [item.id]);
      itemsDetailed.push({
        id: item.id,
        name: rows.length > 0 ? rows[0].name : `Product #${item.id}`,
        description: rows.length > 0 ? rows[0].description : "",
        price: item.price,
        qty: item.qty
      });
    }

    // Auto-register customer if not already in customers table
    const [existing] = await db.query("SELECT id FROM customers WHERE phone = ? LIMIT 1", [phone]);
    if (existing.length === 0) {
      await db.query(
        "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
        [customer, phone, email || null, address]
      );
    }

    // Insert order into orders table
    const [result] = await db.query(
      "INSERT INTO orders (customer, phone, email, address, custom_requirement, status, total) VALUES (?, ?, ?, ?, ?, 'Pending', ?)",
      [customer, phone, email || null, address, custom_requirement || null, total.toFixed(2)]
    );

    res.json({
      message: "Order Placed Successfully",
      orderId: result.insertId,
      status: "Pending",
      itemsDetailed
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// UPDATE STATUS
// ==========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
