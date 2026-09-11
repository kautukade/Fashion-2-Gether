import type { Product as DbProduct } from '../types/database';
import type { Product as CardProduct } from '../data/products';

/**
 * Transform a Supabase database product OR the local demo fallback product
 * into the ProductCard shape.
 *
 * Important: Netlify can run without Supabase environment variables while a
 * deployment is being configured. In that case productService returns the
 * local demo product shape (price/images/category/etc). The previous
 * transformer expected only database fields (selling_price/product_media/etc),
 * which produced undefined prices and could crash ProductCard at runtime.
 */
export function transformProductForCard(
  input: DbProduct & {
    product_media?: any[];
    product_variants?: any[];
    variants?: any[];
    // Demo/fallback fields
    price?: number;
    images?: string[];
    category?: string;
    collection?: string;
    colors?: string[];
    sizes?: string[];
    badge?: CardProduct['badge'];
    inStock?: boolean;
    rating?: number;
    reviews?: number;
  }
): CardProduct {
  const product = input as any;

  // Database products use selling_price. Demo products use price.
  const price = Number(product.selling_price ?? product.price ?? 0);
  const mrp = Number(product.mrp ?? price);

  // Determine badge from DB flags first, then preserve demo badge.
  let badge: CardProduct['badge'] = product.badge;
  if (product.is_bestseller) badge = 'BESTSELLER';
  else if (product.is_trending) badge = 'TRENDING';
  else if (product.is_featured) badge = 'NEW';

  // Prefer real Supabase media. Fall back to demo images.
  let images: string[] = [];
  if (Array.isArray(product.product_media) && product.product_media.length > 0) {
    images = product.product_media
      .filter((m: any) => m.type === 'image' && m.url)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((m: any) => m.url);
  }

  if (images.length === 0 && Array.isArray(product.images)) {
    images = product.images.filter(Boolean);
  }

  if (images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop',
    ];
  }

  // Supabase returns the relation as product_variants when selected with
  // product_variants(*). Keep support for the older `variants` alias too.
  const variants = Array.isArray(product.product_variants)
    ? product.product_variants
    : Array.isArray(product.variants)
      ? product.variants
      : [];

  let colors: string[] = [];
  let sizes: string[] = [];
  let inStock = false;

  if (variants.length > 0) {
    const activeVariants = variants.filter((v: any) => v.status !== 'inactive');
    colors = [...new Set(activeVariants.map((v: any) => v.color).filter(Boolean))] as string[];
    sizes = [...new Set(activeVariants.map((v: any) => v.size).filter(Boolean))] as string[];
    inStock = activeVariants.some((v: any) => Number(v.stock_quantity ?? 0) > 0);
  } else {
    // Preserve real demo fallback values when Supabase isn't configured.
    colors = Array.isArray(product.colors) ? product.colors : [];
    sizes = Array.isArray(product.sizes) ? product.sizes : [];
    inStock = typeof product.inStock === 'boolean' ? product.inStock : true;
  }

  return {
    id: String(product.id ?? ''),
    name: String(product.name ?? 'Product'),
    slug: String(product.slug ?? ''),
    price,
    mrp,
    images,
    category: String(product.category_id ?? product.category ?? ''),
    collection: String(product.collection_id ?? product.collection ?? ''),
    colors,
    sizes,
    badge,
    description: String(product.description ?? product.short_description ?? ''),
    fabric: String(product.fabric ?? ''),
    fit: String(product.fit ?? ''),
    inStock,
    rating: Number(product.rating ?? 0),
    reviews: Number(product.reviews ?? 0),
  };
}

/** Transform an array of database/demo products into card products. */
export function transformProductsForCards(dbProducts: DbProduct[]): CardProduct[] {
  return dbProducts.map((product) => transformProductForCard(product as any));
}
