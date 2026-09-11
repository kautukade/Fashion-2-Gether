-- Fashion 2 Gether - Phase 2 Completion Migration
-- Storage bucket policies and additional schema improvements

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================
-- These policies should be run after creating the storage buckets
-- in the Supabase Dashboard.

-- Product Images Bucket (public read, admin write)
/*
CREATE POLICY "Public access to product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND is_admin());
*/

-- Product Videos Bucket (public read, admin write)
/*
CREATE POLICY "Public access to product videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-videos');

CREATE POLICY "Admins can upload product videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "Admins can delete product videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-videos' AND is_admin());
*/

-- Brand Assets Bucket (public read, admin write)
/*
CREATE POLICY "Public access to brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Admins can upload brand assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-assets' AND is_admin());
*/

-- Banners Bucket (public read, admin write)
/*
CREATE POLICY "Public access to banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'banners' AND is_admin());
*/

-- Reels Bucket (public read, admin write)
/*
CREATE POLICY "Public access to reels"
ON storage.objects FOR SELECT
USING (bucket_id = 'reels');

CREATE POLICY "Admins can upload reels"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reels' AND is_admin());
*/

-- Review Images Bucket (public read, authenticated write)
/*
CREATE POLICY "Public access to review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-images' AND auth.uid() IS NOT NULL);
*/

-- Return Evidence Bucket (private - admin only)
/*
CREATE POLICY "Admins can access return evidence"
ON storage.objects FOR ALL
USING (bucket_id = 'return-evidence' AND is_admin());
*/

-- ============================================
-- ADDITIONAL FUNCTIONS
-- ============================================

-- Function to safely decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(variant_id_param UUID, quantity_param INTEGER)
RETURNS VOID AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock_quantity INTO current_stock
  FROM product_variants
  WHERE id = variant_id_param;

  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  IF current_stock < quantity_param THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  UPDATE product_variants
  SET stock_quantity = stock_quantity - quantity_param,
      updated_at = NOW()
  WHERE id = variant_id_param;

  -- Log the transaction
  INSERT INTO inventory_transactions (variant_id, old_quantity, adjustment, new_quantity, reason)
  VALUES (variant_id_param, current_stock, -quantity_param, current_stock - quantity_param, 'Order placed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'F2G-' || UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 5));
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ADDITIONAL INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON contact_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort ON homepage_sections(sort_order);
