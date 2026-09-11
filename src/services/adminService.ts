import { supabase, isSupabaseConfigured } from '../lib/supabase';

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const adminService = {
  async createProduct(product: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.from('products').insert(product).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateProduct(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async deleteProduct(id: string) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getAllProductsAdmin() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async createVariant(variant: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.from('product_variants').insert(variant).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateVariant(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('product_variants').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getVariantsByProduct(productId: string) {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('product_variants').select('*').eq('product_id', productId);
    return data || [];
  },

  async getCategories() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    return data || [];
  },

  async createCategory(category: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateCategory(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getCollections() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async createCollection(collection: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.from('collections').insert(collection).select().single();
    return { data, error: error?.message ?? null };
  },

  async getDashboardStats() {
    if (!isSupabaseConfigured() || !supabase) {
      return { totalProducts: 0, activeProducts: 0, totalOrders: 0, pendingOrders: 0, totalCustomers: 0, lowStock: 0, outOfStock: 0 };
    }
    const [products, orders, customers, variants] = await Promise.all([
      supabase.from('products').select('id, status'),
      supabase.from('orders').select('id, status'),
      supabase.from('customers').select('id'),
      supabase.from('product_variants').select('id, stock_quantity, low_stock_threshold'),
    ]);
    const allVariants = (variants.data || []) as any[];
    return {
      totalProducts: products.data?.length || 0,
      activeProducts: (products.data || []).filter((p: any) => p.status === 'active').length,
      totalOrders: orders.data?.length || 0,
      pendingOrders: (orders.data || []).filter((o: any) => o.status === 'pending').length,
      totalCustomers: customers.data?.length || 0,
      lowStock: allVariants.filter((v: any) => v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold).length,
      outOfStock: allVariants.filter((v: any) => v.stock_quantity === 0).length,
    };
  },

  async logAudit(adminId: string, action: string, entityType: string, entityId: string, oldValue?: unknown, newValue?: unknown) {
    if (!isSupabaseConfigured() || !supabase) return;
    await supabase.from('audit_logs').insert({ admin_id: adminId, action, entity_type: entityType, entity_id: entityId, old_value: oldValue, new_value: newValue });
  },

  async getAuditLogs() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    return data || [];
  },

  async getEnquiries() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async submitEnquiry(enquiry: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { error } = await supabase.from('contact_enquiries').insert(enquiry);
    return { error: error?.message ?? null };
  },

  async uploadFile(bucket: string, path: string, file: File) {
    if (!isSupabaseConfigured() || !supabase) return { url: null, error: 'Supabase not configured' };
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) return { url: null, error: error.message };
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, error: null };
  },

  async adjustInventory(variantId: string, adjustment: number, reason: string, adminId: string) {
    if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
    const { data: variant } = await supabase.from('product_variants').select('stock_quantity').eq('id', variantId).single();
    if (!variant) return { error: 'Variant not found' };
    const oldQuantity = (variant as any).stock_quantity;
    const newQuantity = oldQuantity + adjustment;
    if (newQuantity < 0) return { error: 'Stock cannot go below zero' };
    const { error: updateError } = await supabase.from('product_variants').update({ stock_quantity: newQuantity }).eq('id', variantId);
    if (updateError) return { error: updateError.message };
    await supabase.from('inventory_transactions').insert({ variant_id: variantId, old_quantity: oldQuantity, adjustment, new_quantity: newQuantity, reason, admin_id: adminId });
    return { error: null };
  },

  async getInventoryList() {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data } = await supabase.from('product_variants').select('*, products(name, slug)').order('stock_quantity', { ascending: true });
    return data || [];
  },
};
