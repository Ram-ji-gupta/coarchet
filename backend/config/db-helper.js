const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db.json");

// Read data from db.json
function readDB() {
  try {
    const rawData = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { products: [], orders: [], customers: [], settings: {} };
  }
}

// Write data to db.json
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing db.json:", error);
    return false;
  }
}

module.exports = { readDB, writeDB };
