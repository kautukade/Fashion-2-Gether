import { products as seedProducts, categories as seedCategories } from '../data/products';

const KEYS = {
  products: 'f2g_demo_products',
  categories: 'f2g_demo_categories',
  collections: 'f2g_demo_collections',
  variants: 'f2g_demo_variants',
  media: 'f2g_demo_media',
  orders: 'f2g_demo_orders',
  customers: 'f2g_demo_customers',
  enquiries: 'f2g_demo_enquiries',
  audit: 'f2g_demo_audit',
  settings: 'f2g_demo_settings',
  homepage: 'f2g_demo_homepage',
  adminSession: 'f2g_demo_admin_session',
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const DEMO_ADMIN_EMAIL = 'admin@fashion2gether.com';
export const DEMO_ADMIN_PASSWORD = 'F2G@2026';

export function seedDemoStore() {
  if (!localStorage.getItem(KEYS.categories)) {
    write(KEYS.categories, seedCategories.map((c, i) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image_url: c.image,
      status: 'active',
      sort_order: i,
      created_at: new Date().toISOString(),
    })));
  }

  if (!localStorage.getItem(KEYS.collections)) {
    const names = Array.from(new Set(seedProducts.map(p => p.collection).filter(Boolean)));
    write(KEYS.collections, names.map((name, i) => ({
      id: `collection-${i + 1}`,
      name,
      slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: '',
      is_active: true,
      is_featured: i < 3,
      created_at: new Date().toISOString(),
    })));
  }

  const cats = read<any[]>(KEYS.categories, []);
  const cols = read<any[]>(KEYS.collections, []);

  if (!localStorage.getItem(KEYS.products)) {
    write(KEYS.products, seedProducts.map((p: any, i) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      short_description: p.description?.slice(0, 110) || '',
      description: p.description || '',
      category_id: cats.find(c => c.name === p.category)?.id || '',
      collection_id: cols.find(c => c.name === p.collection)?.id || '',
      mrp: p.mrp,
      selling_price: p.price,
      fabric: p.fabric || '',
      fit: p.fit || '',
      care_instructions: '',
      status: 'active',
      is_featured: i < 4,
      is_trending: p.badge === 'TRENDING',
      is_bestseller: p.badge === 'BESTSELLER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })));
  }

  if (!localStorage.getItem(KEYS.variants)) {
    const variants: any[] = [];
    seedProducts.forEach((p: any, pi) => {
      p.colors.forEach((color: string, ci: number) => {
        p.sizes.forEach((size: string, si: number) => {
          variants.push({
            id: `variant-${p.id}-${ci}-${si}`,
            product_id: p.id,
            sku: `${p.slug}-${color}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, '-'),
            color,
            size,
            price_override: null,
            stock_quantity: 4 + ((pi + ci + si) % 12),
            low_stock_threshold: 5,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });
      });
    });
    write(KEYS.variants, variants);
  }

  if (!localStorage.getItem(KEYS.media)) {
    const media: any[] = [];
    seedProducts.forEach((p: any) => p.images.forEach((url: string, i: number) => media.push({
      id: `media-${p.id}-${i}`,
      product_id: p.id,
      type: 'image',
      url,
      sort_order: i,
      alt_text: p.name,
      created_at: new Date().toISOString(),
    })));
    write(KEYS.media, media);
  }

  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, []);
  if (!localStorage.getItem(KEYS.customers)) write(KEYS.customers, []);
  if (!localStorage.getItem(KEYS.enquiries)) write(KEYS.enquiries, []);
  if (!localStorage.getItem(KEYS.audit)) write(KEYS.audit, []);

  if (!localStorage.getItem(KEYS.settings)) {
    write(KEYS.settings, {
      brand_name: 'Fashion 2 Gether',
      tagline: 'Wear better. Look better.',
      whatsapp_number: '919595535339',
      currency: 'INR',
      currency_symbol: '₹',
      free_shipping_threshold: '',
      default_shipping_cost: '',
      cod_enabled: 'true',
      cod_fee: '',
      return_period_days: '',
    });
  }

  if (!localStorage.getItem(KEYS.homepage)) {
    write(KEYS.homepage, [
      { id: 'home-1', section_key: 'hero', title: 'Hero', is_visible: true, sort_order: 1 },
      { id: 'home-2', section_key: 'new_drop', title: 'New Drop', is_visible: true, sort_order: 2 },
      { id: 'home-3', section_key: 'categories', title: 'Shop Categories', is_visible: true, sort_order: 3 },
      { id: 'home-4', section_key: '3d_experience', title: '3D Fashion Experience', is_visible: true, sort_order: 4 },
      { id: 'home-5', section_key: 'best_sellers', title: 'Best Sellers', is_visible: true, sort_order: 5 },
    ]);
  }
}

export const demoStore = {
  keys: KEYS,
  seed: seedDemoStore,
  getProducts: () => { seedDemoStore(); return read<any[]>(KEYS.products, []); },
  setProducts: (v: any[]) => write(KEYS.products, v),
  getCategories: () => { seedDemoStore(); return read<any[]>(KEYS.categories, []); },
  setCategories: (v: any[]) => write(KEYS.categories, v),
  getCollections: () => { seedDemoStore(); return read<any[]>(KEYS.collections, []); },
  setCollections: (v: any[]) => write(KEYS.collections, v),
  getVariants: () => { seedDemoStore(); return read<any[]>(KEYS.variants, []); },
  setVariants: (v: any[]) => write(KEYS.variants, v),
  getMedia: () => { seedDemoStore(); return read<any[]>(KEYS.media, []); },
  setMedia: (v: any[]) => write(KEYS.media, v),
  getOrders: () => { seedDemoStore(); return read<any[]>(KEYS.orders, []); },
  setOrders: (v: any[]) => write(KEYS.orders, v),
  getCustomers: () => { seedDemoStore(); return read<any[]>(KEYS.customers, []); },
  setCustomers: (v: any[]) => write(KEYS.customers, v),
  getEnquiries: () => { seedDemoStore(); return read<any[]>(KEYS.enquiries, []); },
  setEnquiries: (v: any[]) => write(KEYS.enquiries, v),
  getAudit: () => { seedDemoStore(); return read<any[]>(KEYS.audit, []); },
  setAudit: (v: any[]) => write(KEYS.audit, v),
  getSettings: () => { seedDemoStore(); return read<Record<string,string>>(KEYS.settings, {}); },
  setSettings: (v: Record<string,string>) => write(KEYS.settings, v),
  getHomepage: () => { seedDemoStore(); return read<any[]>(KEYS.homepage, []); },
  setHomepage: (v: any[]) => write(KEYS.homepage, v),
  newId: id,
};
