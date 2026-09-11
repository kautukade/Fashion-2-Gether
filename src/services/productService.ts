import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { products as demoProducts, categories as demoCategories } from '../data/products';
import type { Product, Category, ProductVariant, ProductMedia } from '../types/database';

// Product service - uses Supabase if configured, falls back to demo data
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
      // Fallback to demo data
      let result = [...demoProducts] as any[];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
      }
      if (filters?.featured) result = result.filter(p => p.is_featured || p.badge === 'BESTSELLER');
      if (filters?.trending) result = result.filter(p => p.is_trending || p.badge === 'TRENDING');
      if (filters?.bestseller) result = result.filter(p => p.is_bestseller || p.badge === 'BESTSELLER');
      return result as Product[];
    }

    let query = supabase.from('products').select('*, product_media(*), product_variants(*)');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'active');
    }

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters?.featured) query = query.eq('is_featured', true);
    if (filters?.trending) query = query.eq('is_trending', true);
    if (filters?.bestseller) query = query.eq('is_bestseller', true);
    if (filters?.minPrice) query = query.gte('selling_price', filters.minPrice);
    if (filters?.maxPrice) query = query.lte('selling_price', filters.maxPrice);
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<Product & { media?: any[] } | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return (demoProducts.find(p => p.slug === slug) as unknown as Product) || null;
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
      // Return demo variants
      const product = demoProducts.find(p => p.id === productId);
      if (!product) return [];
      const variants: ProductVariant[] = [];
      product.colors.forEach(color => {
        product.sizes.forEach(size => {
          variants.push({
            id: `${productId}-${color}-${size}`,
            product_id: productId,
            sku: `${product.slug}-${color}-${size}`.toUpperCase().replace(/\s/g, '-'),
            color,
            size,
            price_override: null,
            stock_quantity: Math.floor(Math.random() * 15) + 1,
            low_stock_threshold: 5,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });
      });
      return variants;
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
      const product = demoProducts.find(p => p.id === productId);
      if (!product) return [];
      return product.images.map((url, i) => ({
        id: `${productId}-media-${i}`,
        product_id: productId,
        type: 'image' as const,
        url,
        sort_order: i,
        alt_text: product.name,
        created_at: new Date().toISOString(),
      }));
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
      return demoCategories as unknown as Category[];
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
