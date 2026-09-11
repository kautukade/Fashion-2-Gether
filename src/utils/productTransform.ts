import type { Product as DbProduct } from '../types/database';
import type { Product as CardProduct } from '../data/products';

/**
 * Transform database product to ProductCard format
 */
export function transformProductForCard(dbProduct: DbProduct & { product_media?: any[]; variants?: any[] }): CardProduct {
  // Determine badge based on flags
  let badge: CardProduct['badge'] = undefined;
  if (dbProduct.is_bestseller) badge = 'BESTSELLER';
  else if (dbProduct.is_trending) badge = 'TRENDING';
  else if (dbProduct.is_featured) badge = 'NEW';
  
  // Use real media from database if available
  let images: string[] = [];
  if (dbProduct.product_media && dbProduct.product_media.length > 0) {
    images = dbProduct.product_media
      .filter(m => m.type === 'image')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(m => m.url);
  }
  
  // Fallback to placeholder only if no media exists
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'];
  }

  // Get colors and sizes from variants if available
  let colors: string[] = [];
  let sizes: string[] = [];
  let inStock = false;

  if (dbProduct.variants && dbProduct.variants.length > 0) {
    colors = [...new Set(dbProduct.variants.map(v => v.color))];
    sizes = [...new Set(dbProduct.variants.map(v => v.size))];
    inStock = dbProduct.variants.some(v => v.stock_quantity > 0);
  } else {
    // Fallback for demo mode
    colors = ['Black', 'White'];
    sizes = ['S', 'M', 'L'];
    inStock = true;
  }

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: dbProduct.selling_price,
    mrp: dbProduct.mrp,
    images,
    category: dbProduct.category_id || '',
    collection: dbProduct.collection_id || '',
    colors,
    sizes,
    badge,
    description: dbProduct.description || dbProduct.short_description || '',
    fabric: dbProduct.fabric || '',
    fit: dbProduct.fit || '',
    inStock,
    rating: 0, // No ratings implemented yet
    reviews: 0,
  };
}

/**
 * Transform array of database products
 */
export function transformProductsForCards(dbProducts: DbProduct[]): CardProduct[] {
  return dbProducts.map(transformProductForCard);
}
