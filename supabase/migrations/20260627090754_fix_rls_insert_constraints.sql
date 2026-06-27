/*
# Fix Remaining RLS Security Issues

1. Issues to address:
- `anon_insert_customers`: WITH CHECK (true) allows unrestricted inserts
- `anon_insert_orders`: WITH CHECK (true) allows unrestricted inserts
- `order_items` has RLS enabled but no policies

2. Solution:
- Add meaningful with_check constraints on INSERT policies for customers and orders
- Require essential fields (phone, name, address) to be provided
- Add service-role-only policy for order_items table
- This ensures only valid data can be inserted while still allowing anonymous checkout

3. Notes:
- This is a public e-commerce storefront without user authentication
- Anonymous visitors must be able to place orders and register
- Admin operations use service role key (bypasses RLS)
*/

-- DROP OLD INSERT POLICIES
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;

-- ORDERS: anon can INSERT only when required fields are provided
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated 
  WITH CHECK (
    customer IS NOT NULL 
    AND phone IS NOT NULL 
    AND address IS NOT NULL
    AND customer != ''
    AND phone != ''
    AND address != ''
  );

-- CUSTOMERS: anon can INSERT only when required fields are provided
CREATE POLICY "anon_insert_customers" ON customers FOR INSERT
  TO anon, authenticated 
  WITH CHECK (
    name IS NOT NULL 
    AND phone IS NOT NULL
    AND name != ''
    AND phone != ''
  );

-- ORDER_ITEMS: No direct anon access - managed by backend/service role only
-- Add a restrictive policy (service role bypasses RLS, so this effectively blocks anon)
CREATE POLICY "no_anon_access_order_items" ON order_items FOR ALL
  TO anon, authenticated 
  USING (false) 
  WITH CHECK (false);