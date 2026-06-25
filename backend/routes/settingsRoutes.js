const express = require("express");
const router = express.Router();

const { getSettings, updateSettings } = require("../controllers/settingsController");
const requireAdmin = require("../middleware/requireAdmin");

// GET settings - public endpoint returns only store info (no password)
// GET settings with token - returns full settings including admin credentials
router.get("/", (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const hasToken = authHeader.startsWith("Bearer ");

  if (hasToken) {
    // Admin: return full settings (including password for admin panel)
    requireAdmin(req, res, () => getSettings(req, res));
  } else {
    // Public: return only safe store info
    getSettings(req, res, { publicOnly: true });
  }
});

router.put("/", requireAdmin, updateSettings);

module.exports = router;
