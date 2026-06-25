const express = require("express");
const router = express.Router();

const { adminLogin, loginValidationRules } = require("../controllers/authController");

router.post("/login", loginValidationRules, adminLogin);

module.exports = router;

