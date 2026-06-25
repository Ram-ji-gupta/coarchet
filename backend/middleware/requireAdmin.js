const jwt = require("jsonwebtoken");

/**
 * Middleware to protect admin routes with JWT.
 * Expects: Authorization: Bearer <token>
 */
module.exports = function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    // payload: { admin: true, sub: <id>, username: ... }
    if (!payload || payload.admin !== true) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

