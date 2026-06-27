const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase config. SUPABASE_URL:", !!supabaseUrl, "SUPABASE_SERVICE_ROLE_KEY:", !!supabaseKey);
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(", "));
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map MySQL table names to Supabase table names
const tableMap = {
  products: "products",
  orders: "orders",
  customers: "customers",
  settings: "settings",
  order_items: "order_items"
};

// Query function that mimics MySQL db.query interface
// Returns [rows, fields] like mysql2 for backward compatibility
async function query(sql, params = []) {
  // Parse SQL to determine operation type and table
  const sqlUpper = sql.trim().toUpperCase();

  if (sqlUpper.startsWith("SELECT")) {
    return handleSelect(sql, params);
  } else if (sqlUpper.startsWith("INSERT")) {
    return handleInsert(sql, params);
  } else if (sqlUpper.startsWith("UPDATE")) {
    return handleUpdate(sql, params);
  } else if (sqlUpper.startsWith("DELETE")) {
    return handleDelete(sql, params);
  }

  throw new Error(`Unsupported SQL: ${sql}`);
}

async function handleSelect(sql, params) {
  // Extract table name from SQL
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (!fromMatch) throw new Error(`Cannot parse table from SQL: ${sql}`);
  const table = fromMatch[1];

  // Handle specific queries used in controllers
  if (sql.includes("ORDER BY id DESC")) {
    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: false });
    if (error) throw error;
    return [data, []];
  }

  if (sql.includes("WHERE id =") || sql.includes("WHERE id=")) {
    // Find the id parameter - it should be in params
    const id = params[0];
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return [data ? [data] : [], []];
  }

  if (sql.includes("WHERE phone =")) {
    const phone = params[0];
    const { data, error } = await supabase.from(table).select("id").eq("phone", phone).limit(1);
    if (error) throw error;
    return [data || [], []];
  }

  if (sql.includes("SELECT COUNT(*)")) {
    // Handle COUNT queries
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) throw error;
    return [{ count }, []];
  }

  // Default: select all
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return [data || [], []];
}

async function handleInsert(sql, params) {
  // Extract table name from SQL
  const intoMatch = sql.match(/INTO\s+(\w+)/i);
  if (!intoMatch) throw new Error(`Cannot parse table from SQL: ${sql}`);
  const table = intoMatch[1];

  // Extract column names from SQL
  const columnsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
  if (!columnsMatch) throw new Error(`Cannot parse columns from SQL: ${sql}`);
  const columns = columnsMatch[1].split(",").map(c => c.trim());

  // Build insert object
  const insertData = {};
  columns.forEach((col, i) => {
    insertData[col] = params[i];
  });

  const { data, error } = await supabase.from(table).insert(insertData).select();
  if (error) throw error;

  // Return format similar to MySQL: [result] with insertId
  const result = {
    insertId: data && data[0] ? data[0].id : 0,
    affectedRows: data ? data.length : 0
  };
  return [result, []];
}

async function handleUpdate(sql, params) {
  // Extract table name
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (!tableMatch) throw new Error(`Cannot parse table from SQL: ${sql}`);
  const table = tableMatch[1];

  // Extract WHERE clause for id (allow flexible whitespace/newlines)
  const whereMatch = sql.match(/WHERE\s+id\s*=\s*\?/is);
  if (!whereMatch) throw new Error(`Only id-based UPDATE supported: ${sql}`);

  const id = params[params.length - 1]; // Last param is id

  // Extract SET clause (everything between SET and WHERE)
  const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/is);
  if (!setMatch) throw new Error(`Cannot parse SET from SQL: ${sql}`);

  const setClause = setMatch[1];

  // Parse "col = ?, col2 = ?" into column names (trim optional backticks)
  // This is intentionally tolerant of whitespace/newlines.
  const assignments = setClause
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map((assignment) => {
      // capture left side of "=" and strip backticks/quotes
      const m = assignment.match(/^([`\"']?\w+[`\"']?)\s*=\s*\?$/i);
      if (!m) {
        throw new Error(`Cannot parse UPDATE assignment: ${assignment}`);
      }
      return m[1].replace(/[`\"']/g, "");
    });

  if (assignments.length > params.length - 1) {
    throw new Error(`UPDATE params mismatch. assignments=${assignments.length}, params=${params.length}`);
  }

  // Build update object
  const updateData = {};
  assignments.forEach((col, i) => {
    updateData[col] = params[i];
  });

  const { data, error } = await supabase.from(table).update(updateData).eq("id", id).select();
  if (error) throw error;

  const result = { affectedRows: data ? data.length : 0 };
  return [result, []];
}

async function handleDelete(sql, params) {
  // Extract table name
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (!fromMatch) throw new Error(`Cannot parse table from SQL: ${sql}`);
  const table = fromMatch[1];

  // Extract WHERE clause for id
  const whereMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
  if (!whereMatch) throw new Error(`Only id-based DELETE supported: ${sql}`);

  const id = params[0];

  const { data, error } = await supabase.from(table).delete().eq("id", id).select();
  if (error) throw error;

  const result = { affectedRows: data ? data.length : 0 };
  return [result, []];
}

let initialized = false;

async function initializeDB() {
  if (initialized) return;
  console.log("Supabase database initialized");
  initialized = true;
  return Promise.resolve();
}

function getPool() {
  return supabase;
}

module.exports = {
  initializeDB,
  getPool,
  query,
  supabase
};
