const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "woolcraft"
};

let pool = null;

async function initializeDB() {
  // 1. Connect without database to ensure it exists
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await connection.end();

  // 2. Create the connection pool
  pool = mysql.createPool(dbConfig);

  // 3. Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY,
      store_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      address TEXT NOT NULL,
      admin_username VARCHAR(255) NOT NULL,
      admin_password VARCHAR(255) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      stock INT NOT NULL,
      image VARCHAR(255),
      description TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      email VARCHAR(255)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      address TEXT NOT NULL,
      custom_requirement TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total DECIMAL(10, 2) NOT NULL
    )
  `);

  // 4. Seed data from db.json if database is empty
  const [settingsCount] = await pool.query("SELECT COUNT(*) as count FROM settings");
  const [productsCount] = await pool.query("SELECT COUNT(*) as count FROM products");
  const [customersCount] = await pool.query("SELECT COUNT(*) as count FROM customers");
  const [ordersCount] = await pool.query("SELECT COUNT(*) as count FROM orders");

  if (settingsCount[0].count === 0 || productsCount[0].count === 0) {
    const dbJsonPath = path.join(__dirname, "../db.json");
    if (fs.existsSync(dbJsonPath)) {
      try {
        const raw = fs.readFileSync(dbJsonPath, "utf8");
        const seedData = JSON.parse(raw);

        // Seed settings
        if (settingsCount[0].count === 0 && seedData.settings) {
          const s = seedData.settings;
          await pool.query(
            "INSERT INTO settings (id, store_name, phone, email, address, admin_username, admin_password) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [s.id || 1, s.store_name, s.phone, s.email, s.address, s.admin_username, s.admin_password]
          );
          console.log("Seeded settings from db.json");
        }

        // Seed products
        if (productsCount[0].count === 0 && seedData.products && seedData.products.length > 0) {
          for (const p of seedData.products) {
            await pool.query(
              "INSERT INTO products (id, name, price, category, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [p.id, p.name, p.price, p.category, p.stock, p.image, p.description]
            );
          }
          console.log(`Seeded ${seedData.products.length} products from db.json`);
        }

        // Seed customers
        if (customersCount[0].count === 0 && seedData.customers && seedData.customers.length > 0) {
          for (const c of seedData.customers) {
            await pool.query(
              "INSERT INTO customers (id, name, phone, address, email) VALUES (?, ?, ?, ?, ?)",
              [c.id, c.name, c.phone, c.address, c.email]
            );
          }
          console.log(`Seeded ${seedData.customers.length} customers from db.json`);
        }

        // Seed orders
        if (ordersCount[0].count === 0 && seedData.orders && seedData.orders.length > 0) {
          for (const o of seedData.orders) {
            const createdAt = o.created_at ? new Date(o.created_at) : new Date();
            await pool.query(
              "INSERT INTO orders (id, customer, phone, email, address, custom_requirement, status, created_at, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [o.id, o.customer, o.phone, o.email, o.address, o.custom_requirement, o.status, createdAt, o.total]
            );
          }
          console.log(`Seeded ${seedData.orders.length} orders from db.json`);
        }
      } catch (err) {
        console.error("Error seeding from db.json:", err.message);
      }
    }
  }
}

function getPool() {
  if (!pool) throw new Error("Database pool not initialized. Call initializeDB() first.");
  return pool;
}

module.exports = {
  initializeDB,
  getPool,
  query: (sql, params) => getPool().query(sql, params)
};
