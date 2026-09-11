-- Fashion 2 Gether - Phase 2 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'CONTENT_MANAGER' CHECK (role IN ('SUPER_ADMIN', 'ORDER_MANAGER', 'INVENTORY_MANAGER', 'CONTENT_MANAGER', 'SUPPORT')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLLECTIONS
-- ============================================
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  mrp DECIMAL(10,2) NOT NULL CHECK (mrp >= 0),
  selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
  fabric TEXT,
  fit TEXT,
  care_instructions TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT VARIANTS (stock lives here)
-- ============================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  price_override DECIMAL(10,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5 CHECK (low_stock_threshold >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT MEDIA
-- ============================================
CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', '360_frame')),
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY TRANSACTIONS
-- ============================================
CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  old_quantity INTEGER NOT NULL,
  adjustment INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADDRESSES
-- ============================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WISHLISTS
-- ============================================
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id)
);

-- ============================================
-- CARTS
-- ============================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  shipping_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HOMEPAGE CMS
-- ============================================
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BANNERS
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  link_url TEXT,
  button_text TEXT,
  position TEXT DEFAULT 'hero',
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT ENQUIRIES
-- ============================================
CREATE TABLE contact_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = TRUE;

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity);

CREATE INDEX idx_media_product ON product_media(product_id);
CREATE INDEX idx_media_sort ON product_media(sort_order);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);

CREATE INDEX idx_inventory_variant ON inventory_transactions(variant_id);
CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PUBLIC READ POLICIES
-- ============================================

-- Anyone can read active products
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (status = 'active');

-- Anyone can read active categories
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (status = 'active');

-- Anyone can read active collections
CREATE POLICY "Public can read collections" ON collections
  FOR SELECT USING (is_active = TRUE);

-- Anyone can read product variants of active products
CREATE POLICY "Public can read variants" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND status = 'active')
  );

-- Anyone can read product media
CREATE POLICY "Public can read media" ON product_media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_media.product_id AND status = 'active')
  );

-- Anyone can read visible homepage sections
CREATE POLICY "Public can read homepage sections" ON homepage_sections
  FOR SELECT USING (is_visible = TRUE);

-- Anyone can read active banners
CREATE POLICY "Public can read banners" ON banners
  FOR SELECT USING (is_active = TRUE);

-- Anyone can read site settings
CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT USING (TRUE);

-- Anyone can create contact enquiries
CREATE POLICY "Anyone can create enquiries" ON contact_enquiries
  FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- AUTHENTICATED CUSTOMER POLICIES
-- ============================================

-- Customers can read/update their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Customers can manage their own customer record
CREATE POLICY "Users can read own customer" ON customers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customer" ON customers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customer" ON customers
  FOR UPDATE USING (user_id = auth.uid());

-- Customers can manage their own addresses
CREATE POLICY "Users can read own addresses" ON addresses
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Customers can manage their own wishlist
CREATE POLICY "Users can read own wishlist" ON wishlists
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own wishlist" ON wishlists
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own wishlist items" ON wishlist_items
  FOR ALL USING (wishlist_id IN (SELECT id FROM wishlists WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));

-- Customers can manage their own cart
CREATE POLICY "Users can read own cart" ON carts
  FOR SELECT USING (customer_id = (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own cart" ON carts
  FOR INSERT WITH CHECK (customer_id = (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own cart" ON carts
  FOR UPDATE USING (customer_id = (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (cart_id IN (SELECT id FROM carts WHERE customer_id = (SELECT id FROM customers WHERE user_id = auth.uid())));

-- Customers can read their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));

-- ============================================
-- ADMIN POLICIES
-- ============================================

-- Admins can do everything on most tables
CREATE POLICY "Admins full access to products" ON products
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to variants" ON product_variants
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to media" ON product_media
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to categories" ON categories
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to collections" ON collections
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to inventory" ON inventory_transactions
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to orders" ON orders
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to order items" ON order_items
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to customers" ON customers
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to addresses" ON addresses
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to wishlists" ON wishlists
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to wishlist items" ON wishlist_items
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to carts" ON carts
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to cart items" ON cart_items
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to homepage" ON homepage_sections
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to banners" ON banners
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to settings" ON site_settings
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins full access to admin_users" ON admin_users
  FOR ALL USING (is_admin());

CREATE POLICY "Admins full access to enquiries" ON contact_enquiries
  FOR ALL USING (is_admin());

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO customers (user_id, email, first_name, last_name, phone)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'phone');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- SEED DATA
-- ============================================

-- Seed categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('New Arrivals', 'new-arrivals', 'Fresh drops, latest trends', 1),
  ('Ethnic Wear', 'ethnic-wear', 'Tradition meets elegance', 2),
  ('Western Wear', 'western-wear', 'Modern & bold', 3),
  ('Party Wear', 'party-wear', 'Shine at every event', 4),
  ('Dresses', 'dresses', 'For every occasion', 5),
  ('Kurtis', 'kurtis', 'Everyday ethnic elegance', 6),
  ('Co-ords', 'co-ords', 'Matching sets', 7),
  ('Bottom Wear', 'bottom-wear', 'Complete your look', 8),
  ('Casual Wear', 'casual-wear', 'Effortless style', 9),
  ('Festive Wear', 'festive-wear', 'Celebrate in style', 10);

-- Seed collections
INSERT INTO collections (name, slug, description, is_active, is_featured) VALUES
  ('New Season', 'new-season', 'Fresh styles for the new season', TRUE, TRUE),
  ('Festive Edit', 'festive-edit', 'Curated for celebrations', TRUE, TRUE),
  ('Power Dressing', 'power-dressing', 'Command attention', TRUE, FALSE),
  ('Everyday Elegance', 'everyday-elegance', 'Style for every day', TRUE, TRUE),
  ('Night Out', 'night-out', 'Party perfect pieces', TRUE, FALSE),
  ('Summer Edit', 'summer-edit', 'Beat the heat in style', TRUE, FALSE),
  ('Heritage', 'heritage', 'Timeless traditional pieces', TRUE, FALSE),
  ('Street Style', 'street-style', 'Urban fashion', TRUE, FALSE);

-- Seed homepage sections
INSERT INTO homepage_sections (section_key, title, subtitle, is_visible, sort_order) VALUES
  ('hero', 'Fashion 2 Gether', 'Yavatmal''s Most Trending Store', TRUE, 1),
  ('announcement', NULL, NULL, TRUE, 2),
  ('new_drop', 'New Drop', 'Just Landed', TRUE, 3),
  ('categories', 'Shop By Category', 'Curated Collections', TRUE, 4),
  ('trending', 'Trending Now', 'Most Loved This Week', TRUE, 5),
  ('interactive', 'Fashion That Moves With You', 'The Experience', TRUE, 6),
  ('reels', 'Shop The Reel', 'Style Inspiration', TRUE, 7),
  ('bestsellers', 'Best Sellers', 'Customer Favorites', TRUE, 8),
  ('editorial', 'Redefining Modern Elegance', 'The Campaign', TRUE, 9),
  ('sale', 'Season Sale', 'Limited Time', TRUE, 10),
  ('complete_look', 'Complete The Look', 'Styling Guide', TRUE, 11),
  ('reviews', 'What Our Customers Say', 'Real Reviews', TRUE, 12),
  ('store', 'Our Store', 'Visit Us', TRUE, 13),
  ('newsletter', 'Join The Fashion Club', 'Stay Connected', TRUE, 14);

-- Seed site settings
INSERT INTO site_settings (key, value) VALUES
  ('brand_name', 'Fashion 2 Gether'),
  ('tagline', 'Yavatmal''s Most Trending Store'),
  ('whatsapp_number', '919595535339'),
  ('currency', 'INR'),
  ('currency_symbol', '₹'),
  ('free_shipping_threshold', '999'),
  ('default_shipping_cost', '99'),
  ('cod_enabled', 'true'),
  ('cod_fee', '49'),
  ('return_period_days', '7'),
  ('low_stock_threshold', '5');

-- ============================================
-- STORAGE BUCKETS (run in Supabase Dashboard)
-- ============================================
-- Create these buckets manually in Supabase Dashboard > Storage:
-- 1. product-images (public)
-- 2. product-videos (public)
-- 3. brand-assets (public)
-- 4. banners (public)
-- 5. reels (public)
-- 6. review-images (public)
-- 7. return-evidence (private)

-- Storage policies (run after creating buckets):
/*
-- Public read for product images
CREATE POLICY "Public access to product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Admin upload for product images
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());

-- Similar policies for other buckets...
*/
