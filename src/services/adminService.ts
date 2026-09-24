import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStore } from '../lib/demoStore';

/* eslint-disable @typescript-eslint/no-explicit-any */

const now = () => new Date().toISOString();

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

export const adminService = {
  async createProduct(product: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      const products = demoStore.getProducts();
      const data = { id: demoStore.newId('product'), ...product, created_at: now(), updated_at: now() };
      demoStore.setProducts([data, ...products]);
      return { data, error: null };
    }
    const { data, error } = await supabase.from('products').insert(product).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateProduct(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setProducts(demoStore.getProducts().map(p => p.id === id ? { ...p, ...updates, updated_at: now() } : p));
      return { error: null };
    }
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async deleteProduct(id: string) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setProducts(demoStore.getProducts().map(p => p.id === id ? { ...p, status: 'archived', updated_at: now() } : p));
      return { error: null };
    }
    const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getAllProductsAdmin() {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getProducts();
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async createVariant(variant: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      const data = { id: demoStore.newId('variant'), ...variant, created_at: now(), updated_at: now() };
      demoStore.setVariants([...demoStore.getVariants(), data]);
      return { data, error: null };
    }
    const { data, error } = await supabase.from('product_variants').insert(variant).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateVariant(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setVariants(demoStore.getVariants().map(v => v.id === id ? { ...v, ...updates, updated_at: now() } : v));
      return { error: null };
    }
    const { error } = await supabase.from('product_variants').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getVariantsByProduct(productId: string) {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getVariants().filter(v => v.product_id === productId);
    const { data } = await supabase.from('product_variants').select('*').eq('product_id', productId);
    return data || [];
  },

  async deleteVariantsByProduct(productId: string) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setVariants(demoStore.getVariants().filter(v => v.product_id !== productId));
      return { error: null };
    }
    const { error } = await supabase.from('product_variants').delete().eq('product_id', productId);
    return { error: error?.message ?? null };
  },

  async createMedia(media: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      const data = { id: demoStore.newId('media'), ...media, created_at: now() };
      demoStore.setMedia([...demoStore.getMedia(), data]);
      return { data, error: null };
    }
    const { data, error } = await supabase.from('product_media').insert(media).select().single();
    return { data, error: error?.message ?? null };
  },

  async getMediaByProduct(productId: string) {
    if (!isSupabaseConfigured() || !supabase) {
      return demoStore.getMedia().filter(m => m.product_id === productId).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
    const { data } = await supabase.from('product_media').select('*').eq('product_id', productId).order('sort_order');
    return data || [];
  },

  async deleteMedia(id: string) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setMedia(demoStore.getMedia().filter(m => m.id !== id));
      return { error: null };
    }
    const { error } = await supabase.from('product_media').delete().eq('id', id);
    return { error: error?.message ?? null };
  },

  async getCategories() {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getCategories();
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    return data || [];
  },

  async createCategory(category: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      const data = { id: demoStore.newId('category'), sort_order: demoStore.getCategories().length, ...category, created_at: now() };
      demoStore.setCategories([...demoStore.getCategories(), data]);
      return { data, error: null };
    }
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    return { data, error: error?.message ?? null };
  },

  async updateCategory(id: string, updates: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setCategories(demoStore.getCategories().map(c => c.id === id ? { ...c, ...updates } : c));
      return { error: null };
    }
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    return { error: error?.message ?? null };
  },

  async getCollections() {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getCollections();
    const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async createCollection(collection: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      const data = { id: demoStore.newId('collection'), ...collection, created_at: now() };
      demoStore.setCollections([data, ...demoStore.getCollections()]);
      return { data, error: null };
    }
    const { data, error } = await supabase.from('collections').insert(collection).select().single();
    return { data, error: error?.message ?? null };
  },

  async getDashboardStats() {
    if (!isSupabaseConfigured() || !supabase) {
      const products = demoStore.getProducts();
      const orders = demoStore.getOrders();
      const customers = demoStore.getCustomers();
      const variants = demoStore.getVariants();
      return {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalCustomers: customers.length,
        lowStock: variants.filter(v => v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold).length,
        outOfStock: variants.filter(v => v.stock_quantity === 0).length,
      };
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
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setAudit([{
        id: demoStore.newId('audit'), admin_id: adminId, action, entity_type: entityType,
        entity_id: entityId, old_value: oldValue, new_value: newValue, created_at: now(),
      }, ...demoStore.getAudit()]);
      return;
    }
    await supabase.from('audit_logs').insert({ admin_id: adminId, action, entity_type: entityType, entity_id: entityId, old_value: oldValue, new_value: newValue });
  },

  async getAuditLogs() {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getAudit();
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    return data || [];
  },

  async getEnquiries() {
    if (!isSupabaseConfigured() || !supabase) return demoStore.getEnquiries();
    const { data } = await supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async submitEnquiry(enquiry: Record<string, unknown>) {
    if (!isSupabaseConfigured() || !supabase) {
      demoStore.setEnquiries([{ id: demoStore.newId('enquiry'), status: 'new', ...enquiry, created_at: now() }, ...demoStore.getEnquiries()]);
      return { error: null };
    }
    const { error } = await supabase.from('contact_enquiries').insert(enquiry);
    return { error: error?.message ?? null };
  },

  async uploadFile(_bucket: string, _path: string, file: File) {
    if (!isSupabaseConfigured() || !supabase) {
      try {
        const url = await fileToDataUrl(file);
        return { url, error: null };
      } catch (e: any) {
        return { url: null, error: e?.message || 'Upload failed' };
      }
    }
    const { data, error } = await supabase.storage.from(_bucket).upload(_path, file, { upsert: true });
    if (error) return { url: null, error: error.message };
    const { data: urlData } = supabase.storage.from(_bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, error: null };
  },

  async adjustInventory(variantId: string, adjustment: number, reason: string, adminId: string) {
    if (!isSupabaseConfigured() || !supabase) {
      const variants = demoStore.getVariants();
      const variant = variants.find(v => v.id === variantId);
      if (!variant) return { error: 'Variant not found' };
      const newQuantity = Number(variant.stock_quantity || 0) + adjustment;
      if (newQuantity < 0) return { error: 'Stock cannot go below zero' };
      demoStore.setVariants(variants.map(v => v.id === variantId ? { ...v, stock_quantity: newQuantity, updated_at: now() } : v));
      await this.logAudit(adminId, 'inventory_adjustment', 'product_variant', variantId, variant.stock_quantity, { new_quantity: newQuantity, reason });
      return { error: null };
    }
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
    if (!isSupabaseConfigured() || !supabase) {
      const products = demoStore.getProducts();
      return demoStore.getVariants().map(v => ({
        ...v,
        products: { name: products.find(p => p.id === v.product_id)?.name || 'Unknown' },
      }));
    }
    const { data } = await supabase.from('product_variants').select('*, products(name, slug)').order('stock_quantity', { ascending: true });
    return data || [];
  },
};
