const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

// Security middleware - configurable via NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  app.use(helmet());
} else {
  // Development: disable helmet to allow images to load easily
  console.log("Helmet disabled for development");
}

// Configure CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500"
  ], // Allow local frontend origin
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Parse JSON
app.use(express.json({ limit: "10kb" })); // Limit request body size

// API routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
const settingsRoutes = require("./routes/settingsRoutes");
app.use("/api/settings", settingsRoutes);

// Serve uploaded images statically with cache control
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  maxAge: "1d",
  etag: false
}));

app.get("/", (req, res) => { res.send("Backend Running"); });

// Global error handler (prevents exposing sensitive info)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
  });
});

const { initializeDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

initializeDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  });
