import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStore } from '../lib/demoStore';
import type { Product, Category, ProductVariant, ProductMedia } from '../types/database';

const enrichDemoProduct = (product: any) => ({
  ...product,
  product_media: demoStore.getMedia().filter(m => m.product_id === product.id),
  product_variants: demoStore.getVariants().filter(v => v.product_id === product.id),
});

export const productService = {
  async getAll(filters?: {
    category?: string;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    status?: string;
    featured?: boolean;
    trending?: boolean;
    bestseller?: boolean;
  }): Promise<Product[]> {
    if (!isSupabaseConfigured() || !supabase) {
      let result = demoStore.getProducts();
      const categories = demoStore.getCategories();
      const collections = demoStore.getCollections();

      if (filters?.status) result = result.filter(p => p.status === filters.status);
      else result = result.filter(p => p.status === 'active');

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(p =>
          String(p.name || '').toLowerCase().includes(q) ||
          String(p.description || '').toLowerCase().includes(q)
        );
      }

      if (filters?.category) {
        const category = categories.find(c => c.id === filters.category || c.slug === filters.category || c.name === filters.category);
        const categoryId = category?.id || filters.category;
        result = result.filter(p => p.category_id === categoryId);
      }

      if (filters?.collection) {
        const collection = collections.find(c => c.id === filters.collection || c.slug === filters.collection || c.name === filters.collection);
        const collectionId = collection?.id || filters.collection;
        result = result.filter(p => p.collection_id === collectionId);
      }

      if (filters?.featured) result = result.filter(p => !!p.is_featured);
      if (filters?.trending) result = result.filter(p => !!p.is_trending);
      if (filters?.bestseller) result = result.filter(p => !!p.is_bestseller);
      if (filters?.minPrice != null) result = result.filter(p => Number(p.selling_price || 0) >= filters.minPrice!);
      if (filters?.maxPrice != null) result = result.filter(p => Number(p.selling_price || 0) <= filters.maxPrice!);

      return result.map(enrichDemoProduct) as Product[];
    }

    let query = supabase.from('products').select('*, product_media(*), product_variants(*)');

    if (filters?.status) query = query.eq('status', filters.status);
    else query = query.eq('status', 'active');

    if (filters?.category) query = query.eq('category_id', filters.category);
    if (filters?.featured) query = query.eq('is_featured', true);
    if (filters?.trending) query = query.eq('is_trending', true);
    if (filters?.bestseller) query = query.eq('is_bestseller', true);
    if (filters?.minPrice != null) query = query.gte('selling_price', filters.minPrice);
    if (filters?.maxPrice != null) query = query.lte('selling_price', filters.maxPrice);
    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<Product & { media?: any[] } | null> {
    if (!isSupabaseConfigured() || !supabase) {
      const product = demoStore.getProducts().find(p => p.slug === slug && p.status !== 'archived');
      return product ? enrichDemoProduct(product) as Product : null;
    }
    const { data, error } = await supabase
      .from('products')
      .select('*, product_media(*)')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  },

  async getVariants(productId: string): Promise<ProductVariant[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return demoStore.getVariants().filter(v => v.product_id === productId && v.status === 'active') as ProductVariant[];
    }
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'active');
    if (error) throw error;
    return data || [];
  },

  async getMedia(productId: string): Promise<ProductMedia[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return demoStore.getMedia()
        .filter(m => m.product_id === productId)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) as ProductMedia[];
    }
    const { data, error } = await supabase
      .from('product_media')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  },

  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return demoStore.getCategories().filter(c => c.status === 'active') as Category[];
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('sort_order');
    if (error) throw error;
    return data || [];
  },
};
