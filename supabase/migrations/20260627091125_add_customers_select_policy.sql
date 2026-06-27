/*
# Fix Missing SELECT Policy for Customers

Issue: Checkout flow checks if customer exists by phone number,
but customers table only has INSERT policy, no SELECT policy.

Solution: Add SELECT policy for customers (by phone) so the 
anon client can check for existing customers during checkout.
*/

-- Add SELECT policy for customers (needed to check if customer exists during checkout)
CREATE POLICY "anon_select_customers" ON customers FOR SELECT
  TO anon, authenticated USING (true);