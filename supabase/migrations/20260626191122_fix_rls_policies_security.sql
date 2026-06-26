/*
# Fix RLS Policies for E-commerce Security

1. Security Issue
- Current policies use `USING (true)` which allows unrestricted access
- This means anyone can DELETE products, orders, customers, and settings
- This is a security vulnerability

2. Solution
- Public (anon) can: SELECT products/settings, INSERT orders/customers (for placing orders)
- Admin operations (INSERT/UPDATE/DELETE products, UPDATE/DELETE orders, UPDATE settings) require service role key
- The admin panel/backend uses service role key which bypasses RLS

3. Changes
- Products: anon can only SELECT (read-only for public storefront)
- Orders: anon can SELECT and INSERT only (place orders), cannot modify/delete
- Customers: anon can INSERT only (register during checkout), cannot read/modify/delete
- Settings: anon can SELECT only (read store info), cannot modify
- Order items: service role only (managed by backend)
*/

-- DROP OLD POLICIES
DROP POLICY IF EXISTS "anon_select_products" ON products;
DROP POLICY IF EXISTS "anon_insert_products" ON products;
DROP POLICY IF EXISTS "anon_update_products" ON products;
DROP POLICY IF EXISTS "anon_delete_products" ON products;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

DROP POLICY IF EXISTS "anon_select_customers" ON customers;
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
DROP POLICY IF EXISTS "anon_update_customers" ON customers;
DROP POLICY IF EXISTS "anon_delete_customers" ON customers;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;

DROP POLICY IF EXISTS "anon_select_settings" ON settings;
DROP POLICY IF EXISTS "anon_insert_settings" ON settings;
DROP POLICY IF EXISTS "anon_update_settings" ON settings;
DROP POLICY IF EXISTS "anon_delete_settings" ON settings;

-- PRODUCTS: anon can only read (storefront display)
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ORDERS: anon can read own orders by phone (future enhancement) and create new orders
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- CUSTOMERS: anon can only create (register during checkout)
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- SETTINGS: anon can only read store info (no sensitive fields exposed in public API)
CREATE POLICY "anon_select_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);

-- ORDER_ITEMS: no direct anon access (managed by backend/service role)
-- This table is only accessed via service role key (bypasses RLS)