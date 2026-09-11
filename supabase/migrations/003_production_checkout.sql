-- Fashion 2 Gether - Migration 003: Production Checkout Support
-- This migration enables secure guest checkout and order creation

-- ============================================
-- MODIFY CUSTOMERS TABLE FOR GUEST SUPPORT
-- ============================================

-- Allow NULL user_id for guest customers
ALTER TABLE customers 
ALTER COLUMN user_id DROP NOT NULL;

-- Add guest identifier for tracking
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;

-- Add index for guest lookups
CREATE INDEX IF NOT EXISTS idx_customers_guest_email ON customers(guest_email) WHERE is_guest = TRUE;
CREATE INDEX IF NOT EXISTS idx_customers_guest_phone ON customers(guest_phone) WHERE is_guest = TRUE;

-- ============================================
-- MODIFY ORDERS TABLE FOR GUEST SUPPORT
-- ============================================

-- Allow NULL customer_id for guest orders
ALTER TABLE orders
ALTER COLUMN customer_id DROP NOT NULL;

-- Add guest order tracking fields
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS is_guest_order BOOLEAN DEFAULT FALSE;

-- Add index for guest order tracking
CREATE INDEX IF NOT EXISTS idx_orders_guest_phone ON orders(guest_phone) WHERE is_guest_order = TRUE;

-- ============================================
-- SECURE ORDER CREATION FUNCTION
-- ============================================

-- This function handles order creation securely
-- It validates stock, calculates prices server-side, and creates orders atomically
CREATE OR REPLACE FUNCTION create_secure_order(
  p_guest_email TEXT DEFAULT NULL,
  p_guest_phone TEXT DEFAULT NULL,
  p_customer_id UUID DEFAULT NULL,
  p_items JSONB, -- Array of {variant_id, quantity}
  p_shipping_address JSONB,
  p_payment_method TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal DECIMAL(10,2) := 0;
  v_shipping_cost DECIMAL(10,2) := 0;
  v_total DECIMAL(10,2);
  v_item JSONB;
  v_variant RECORD;
  v_product RECORD;
  v_item_price DECIMAL(10,2);
  v_free_shipping_threshold DECIMAL(10,2);
  v_default_shipping DECIMAL(10,2);
BEGIN
  -- Validate that either customer_id or guest info is provided
  IF p_customer_id IS NULL AND (p_guest_email IS NULL OR p_guest_phone IS NULL) THEN
    RAISE EXCEPTION 'Either customer_id or guest email/phone must be provided';
  END IF;

  -- Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Get shipping settings
  SELECT value::DECIMAL INTO v_free_shipping_threshold
  FROM public.site_settings
  WHERE key = 'free_shipping_threshold';
  
  SELECT value::DECIMAL INTO v_default_shipping
  FROM public.site_settings
  WHERE key = 'default_shipping_cost';

  -- Generate order number
  v_order_number := 'F2G-' || UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 5));

  -- Process each item: validate stock and calculate prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Fetch variant with product info and lock the row
    SELECT pv.*, p.selling_price, p.mrp, p.status as product_status, p.name as product_name
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = (v_item->>'variant_id')::UUID
    FOR UPDATE; -- Lock the variant row to prevent race conditions

    -- Validate variant exists and is active
    IF v_variant.id IS NULL THEN
      RAISE EXCEPTION 'Variant not found: %', v_item->>'variant_id';
    END IF;

    IF v_variant.status != 'active' THEN
      RAISE EXCEPTION 'Variant is not active: %', v_variant.sku;
    END IF;

    IF v_variant.product_status != 'active' THEN
      RAISE EXCEPTION 'Product is not active: %', v_variant.product_name;
    END IF;

    -- Validate stock availability
    IF v_variant.stock_quantity < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Insufficient stock for variant % (available: %, requested: %)', 
        v_variant.sku, v_variant.stock_quantity, v_item->>'quantity';
    END IF;

    -- Calculate item price (use price_override if set, otherwise use product selling_price)
    v_item_price := COALESCE(v_variant.price_override, v_variant.selling_price);
    
    -- Add to subtotal
    v_subtotal := v_subtotal + (v_item_price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- Calculate shipping
  IF v_subtotal >= v_free_shipping_threshold THEN
    v_shipping_cost := 0;
  ELSE
    v_shipping_cost := v_default_shipping;
  END IF;

  -- Calculate total
  v_total := v_subtotal + v_shipping_cost;

  -- Create the order
  INSERT INTO public.orders (
    order_number,
    customer_id,
    status,
    subtotal,
    shipping_cost,
    discount,
    total,
    payment_status,
    payment_method,
    shipping_address,
    guest_email,
    guest_phone,
    is_guest_order
  ) VALUES (
    v_order_number,
    p_customer_id,
    'pending',
    v_subtotal,
    v_shipping_cost,
    0,
    v_total,
    'pending',
    p_payment_method,
    p_shipping_address,
    p_guest_email,
    p_guest_phone,
    p_customer_id IS NULL
  )
  RETURNING id INTO v_order_id;

  -- Create order items and decrement stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Fetch variant again (already locked from earlier)
    SELECT pv.*, p.selling_price
    INTO v_variant
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = (v_item->>'variant_id')::UUID;

    v_item_price := COALESCE(v_variant.price_override, v_variant.selling_price);

    -- Create order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      quantity,
      price
    ) VALUES (
      v_order_id,
      v_variant.product_id,
      v_variant.id,
      (v_item->>'quantity')::INTEGER,
      v_item_price
    );

    -- Decrement stock
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - (v_item->>'quantity')::INTEGER,
        updated_at = NOW()
    WHERE id = v_variant.id;

    -- Log inventory transaction
    INSERT INTO public.inventory_transactions (
      variant_id,
      old_quantity,
      adjustment,
      new_quantity,
      reason
    ) VALUES (
      v_variant.id,
      v_variant.stock_quantity,
      -(v_item->>'quantity')::INTEGER,
      v_variant.stock_quantity - (v_item->>'quantity')::INTEGER,
      'Order placed: ' || v_order_number
    );
  END LOOP;

  -- Return order details
  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'shipping_cost', v_shipping_cost,
    'total', v_total,
    'status', 'pending'
  );
END;
$$;

-- ============================================
-- SECURE ORDER TRACKING FUNCTION
-- ============================================

-- This function allows secure order tracking by order number + phone
CREATE OR REPLACE FUNCTION track_order_by_phone(
  p_order_number TEXT,
  p_phone TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  -- Fetch order with matching phone (either guest or customer phone)
  SELECT o.*
  INTO v_order
  FROM public.orders o
  LEFT JOIN public.customers c ON c.id = o.customer_id
  WHERE o.order_number = p_order_number
    AND (
      o.guest_phone = p_phone
      OR c.phone = p_phone
      OR o.shipping_address->>'phone' = p_phone
    );

  -- Return null if not found
  IF v_order.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Fetch order items
  SELECT jsonb_agg(
    jsonb_build_object(
      'product_name', p.name,
      'variant_color', pv.color,
      'variant_size', pv.size,
      'quantity', oi.quantity,
      'price', oi.price
    )
  )
  INTO v_items
  FROM public.order_items oi
  JOIN public.products p ON p.id = oi.product_id
  JOIN public.product_variants pv ON pv.id = oi.variant_id
  WHERE oi.order_id = v_order.id;

  -- Return order details
  RETURN jsonb_build_object(
    'order_number', v_order.order_number,
    'status', v_order.status,
    'total', v_order.total,
    'payment_status', v_order.payment_status,
    'payment_method', v_order.payment_method,
    'created_at', v_order.created_at,
    'items', v_items
  );
END;
$$;

-- ============================================
-- REVOKE PUBLIC ACCESS TO SENSITIVE FUNCTIONS
-- ============================================

-- Revoke execute from public/anon for security-critical functions
REVOKE EXECUTE ON FUNCTION create_secure_order FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_secure_order FROM anon;
REVOKE EXECUTE ON FUNCTION create_secure_order FROM authenticated;

REVOKE EXECUTE ON FUNCTION track_order_by_phone FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION track_order_by_phone FROM anon;

-- Only allow service_role (Edge Functions) to call these
GRANT EXECUTE ON FUNCTION create_secure_order TO service_role;
GRANT EXECUTE ON FUNCTION track_order_by_phone TO service_role;
GRANT EXECUTE ON FUNCTION track_order_by_phone TO authenticated;

-- Also revoke decrement_stock from public if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'decrement_stock') THEN
    REVOKE EXECUTE ON FUNCTION decrement_stock FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION decrement_stock FROM anon;
    REVOKE EXECUTE ON FUNCTION decrement_stock FROM authenticated;
    GRANT EXECUTE ON FUNCTION decrement_stock TO service_role;
  END IF;
END $$;

-- ============================================
-- UPDATE RLS POLICIES FOR GUEST ORDERS
-- ============================================

-- Drop existing order policies if they exist
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;

-- Allow authenticated users to read their own orders
CREATE POLICY "Users can read own orders"
ON orders FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Guests cannot directly read orders (must use track_order_by_phone function)
-- Orders are created via create_secure_order function (service_role only)

-- ============================================
-- UPDATE RLS FOR CUSTOMERS
-- ============================================

-- Drop existing customer policies
DROP POLICY IF EXISTS "Users can read own customer" ON customers;
DROP POLICY IF EXISTS "Users can insert own customer" ON customers;
DROP POLICY IF EXISTS "Users can update own customer" ON customers;

-- Allow authenticated users to manage their own customer record
CREATE POLICY "Users can read own customer"
ON customers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customer"
ON customers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

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
-- ADD STATUS HISTORY TRACKING
-- ============================================

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- Function to automatically log status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (
      order_id,
      old_status,
      new_status,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS trigger_order_status_change ON orders;
CREATE TRIGGER trigger_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();
