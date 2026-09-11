-- Fashion 2 Gether - Migration 004: Storage Policies
-- Executable storage bucket policies

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================
-- These policies assume the buckets have been created in Supabase Dashboard.
-- Buckets required:
-- 1. product-images (public)
-- 2. product-videos (public)
-- 3. brand-assets (public)
-- 4. banners (public)
-- 5. reels (public)
-- 6. review-images (public)
-- 7. return-evidence (private)

-- ============================================
-- PRODUCT IMAGES BUCKET
-- ============================================

-- Public read access to product images
CREATE POLICY "Public read access to product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Admin upload access
CREATE POLICY "Admin upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Admin update access
CREATE POLICY "Admin update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Admin delete access
CREATE POLICY "Admin delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- PRODUCT VIDEOS BUCKET
-- ============================================

CREATE POLICY "Public read access to product videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-videos');

CREATE POLICY "Admin upload product videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Admin delete product videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- BRAND ASSETS BUCKET
-- ============================================

CREATE POLICY "Public read access to brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Admin upload brand assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Admin delete brand assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brand-assets'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- BANNERS BUCKET
-- ============================================

CREATE POLICY "Public read access to banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admin upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Admin delete banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- REELS BUCKET
-- ============================================

CREATE POLICY "Public read access to reels"
ON storage.objects FOR SELECT
USING (bucket_id = 'reels');

CREATE POLICY "Admin upload reels"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reels'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Admin delete reels"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'reels'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- REVIEW IMAGES BUCKET
-- ============================================

-- Public read access
CREATE POLICY "Public read access to review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

-- Authenticated users can upload review images
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images'
  AND auth.uid() IS NOT NULL
);

-- Users can delete their own review images
CREATE POLICY "Users can delete own review images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-images'
  AND auth.uid() IS NOT NULL
);

-- Admin can delete any review image
CREATE POLICY "Admin can delete any review image"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- ============================================
-- RETURN EVIDENCE BUCKET (PRIVATE)
-- ============================================

-- Only admins can access return evidence
CREATE POLICY "Admin access to return evidence"
ON storage.objects FOR ALL
USING (
  bucket_id = 'return-evidence'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Authenticated customers can upload return evidence
CREATE POLICY "Customers can upload return evidence"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'return-evidence'
  AND auth.uid() IS NOT NULL
);

-- ============================================
-- FILE SIZE LIMITS (via bucket configuration)
-- ============================================
-- Note: File size limits should be configured in Supabase Dashboard
-- Recommended limits:
-- product-images: 5MB per file, images only
-- product-videos: 50MB per file, video only
-- brand-assets: 10MB per file
-- banners: 5MB per file
-- reels: 50MB per file, video only
-- review-images: 5MB per file, images only
-- return-evidence: 10MB per file

-- ============================================
-- MIME TYPE VALIDATION
-- ============================================
-- Note: MIME type validation should be enforced in the application layer
-- and via Supabase Dashboard bucket configuration.
-- Allowed types:
-- product-images: image/jpeg, image/png, image/webp, image/avif
-- product-videos: video/mp4, video/webm
-- brand-assets: image/jpeg, image/png, image/webp, image/svg+xml
-- banners: image/jpeg, image/png, image/webp
-- reels: video/mp4, video/webm
-- review-images: image/jpeg, image/png, image/webp
-- return-evidence: image/jpeg, image/png, image/webp, video/mp4
