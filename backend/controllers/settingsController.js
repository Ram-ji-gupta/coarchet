const db = require("../config/db");

// GET SETTINGS
// If options.publicOnly is true, strip sensitive admin fields before sending
exports.getSettings = async (req, res, options) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
    let settings = rows[0] || {};

    if (options && options.publicOnly) {
      // Public access: only return non-sensitive store info
      const { admin_username, admin_password, ...publicSettings } = settings;
      return res.json(publicSettings);
    }

    return res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ message: "Settings not found" });
    }

    const current = rows[0];
    const updated = {
      store_name: req.body.store_name || current.store_name,
      phone: req.body.phone || current.phone,
      email: req.body.email !== undefined ? req.body.email : current.email,
      address: req.body.address || current.address,
      admin_username: req.body.admin_username || current.admin_username,
      admin_password: req.body.admin_password || current.admin_password
    };

    await db.query(
      "UPDATE settings SET store_name = ?, phone = ?, email = ?, address = ?, admin_username = ?, admin_password = ? WHERE id = 1",
      [
        updated.store_name,
        updated.phone,
        updated.email,
        updated.address,
        updated.admin_username,
        updated.admin_password
      ]
    );

    res.json({ message: "Settings Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
