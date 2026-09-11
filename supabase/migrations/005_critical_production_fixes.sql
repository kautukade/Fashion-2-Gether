-- Fashion 2 Gether - Migration 005: Critical Production Fixes
-- Fixes RLS policies, Edge Function grants, and customer_id references

-- ============================================
-- FIX ORDER RLS POLICIES
-- ============================================

-- Drop existing incorrect policies
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

-- Correct policy: authenticated users can read their own orders
-- customer_id references customers.id, not auth.users.id
CREATE POLICY "Users can read own orders"
ON orders FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders"
ON orders FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- FIX CUSTOMER RLS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own customer" ON customers;
DROP POLICY IF EXISTS "Users can insert own customer" ON customers;
DROP POLICY IF EXISTS "Users can update own customer" ON customers;
DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;

-- Users can read their own customer record
CREATE POLICY "Users can read own customer"
ON customers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own customer record
CREATE POLICY "Users can insert own customer"
ON customers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own customer record
CREATE POLICY "Users can update own customer"
ON customers FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all customers
CREATE POLICY "Admins can manage all customers"
ON customers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- GRANT EDGE FUNCTION ACCESS
-- ============================================

-- Grant execute on create_secure_order to service_role (for Edge Functions)
-- This should already be set, but ensuring it's explicit
GRANT EXECUTE ON FUNCTION create_secure_order TO service_role;

-- Grant execute on track_order_by_phone to service_role (for Edge Functions)
GRANT EXECUTE ON FUNCTION track_order_by_phone TO service_role;

-- ============================================
-- FIX ORDER ITEMS RLS
-- ============================================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;

-- Users can read their own order items
CREATE POLICY "Users can read own order items"
ON order_items FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM orders
    WHERE customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  )
);

-- Admins can read all order items
CREATE POLICY "Admins can read all order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- FIX ADDRESSES RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;

-- Users can manage their own addresses
CREATE POLICY "Users can read own addresses"
ON addresses FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own addresses"
ON addresses FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own addresses"
ON addresses FOR UPDATE
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own addresses"
ON addresses FOR DELETE
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Admins can manage all addresses
CREATE POLICY "Admins can manage all addresses"
ON addresses FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- FIX WISHLIST RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist items" ON wishlist_items;

-- Users can manage their own wishlist
CREATE POLICY "Users can read own wishlist"
ON wishlists FOR SELECT
TO authenticated
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own wishlist"
ON wishlists FOR INSERT
TO authenticated
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own wishlist"
ON wishlists FOR UPDATE
TO authenticated
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Users can manage their own wishlist items
CREATE POLICY "Users can manage own wishlist items"
ON wishlist_items FOR ALL
TO authenticated
USING (
  wishlist_id IN (
    SELECT id FROM wishlists
    WHERE customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  )
);

-- ============================================
-- FIX CART RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own cart" ON carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;

-- Users can manage their own cart
CREATE POLICY "Users can read own cart"
ON carts FOR SELECT
TO authenticated
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own cart"
ON carts FOR INSERT
TO authenticated
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own cart"
ON carts FOR UPDATE
TO authenticated
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Users can manage their own cart items
CREATE POLICY "Users can manage own cart items"
ON cart_items FOR ALL
TO authenticated
USING (
  cart_id IN (
    SELECT id FROM carts
    WHERE customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  )
);

-- ============================================
-- ADD INDEXES FOR PERFORMANCE
-- ============================================

-- Index for customer lookup by user_id
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- Index for order lookup by customer_id
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- ============================================
-- CREATE STORAGE BUCKETS
-- ============================================

-- Create storage buckets if they don't exist
-- Note: This requires the storage schema to be available

DO $$
BEGIN
  -- Create product-images bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('product-images', 'product-images', true);
  END IF;

  -- Create product-videos bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-videos') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('product-videos', 'product-videos', true);
  END IF;

  -- Create brand-assets bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'brand-assets') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('brand-assets', 'brand-assets', true);
  END IF;

  -- Create banners bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'banners') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('banners', 'banners', true);
  END IF;

  -- Create reels bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'reels') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('reels', 'reels', true);
  END IF;

  -- Create review-images bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'review-images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('review-images', 'review-images', true);
  END IF;

  -- Create return-evidence bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'return-evidence') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('return-evidence', 'return-evidence', false);
  END IF;
END $$;

-- ============================================
-- FIX REVIEW IMAGES STORAGE POLICY
-- ============================================

-- Drop existing incorrect policy
DROP POLICY IF EXISTS "Users can delete own review images" ON storage.objects;

-- Users can only delete their own review images (path-based ownership)
CREATE POLICY "Users can delete own review images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'review-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- ADD QUANTITY VALIDATION TO CREATE_SECURE_ORDER
-- ============================================

-- This is already in the function, but adding a comment for clarity
-- The function validates:
-- - quantity > 0
-- - quantity <= 99 (reasonable maximum)
-- - variant exists and is active
-- - product exists and is active
-- - sufficient stock available

-- ============================================
-- SUMMARY OF CHANGES
-- ============================================

-- 1. Fixed order RLS to use customers.id instead of auth.users.id
-- 2. Fixed customer RLS policies
-- 3. Fixed order_items RLS policies
-- 4. Fixed addresses RLS policies
-- 5. Fixed wishlist RLS policies
-- 6. Fixed cart RLS policies
-- 7. Granted Edge Function access to secure RPCs
-- 8. Added performance indexes
-- 9. Created storage buckets
-- 10. Fixed review images storage policy for path-based ownership
