import type { Product as DbProduct } from '../types/database';
import type { Product as CardProduct } from '../data/products';

/**
 * Transform database product to ProductCard format
 */
export function transformProductForCard(dbProduct: DbProduct): CardProduct {
  // Determine badge based on flags
  let badge: CardProduct['badge'] = undefined;
  if (dbProduct.is_bestseller) badge = 'BESTSELLER';
  else if (dbProduct.is_trending) badge = 'TRENDING';
  else if (dbProduct.is_featured) badge = 'NEW';
  
  // For now, use placeholder images since we don't have media URLs in the product table
  // In production, you'd fetch from product_media table
  const images = [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop'
  ];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: dbProduct.selling_price,
    mrp: dbProduct.mrp,
    images,
    category: dbProduct.category_id || '',
    collection: dbProduct.collection_id || '',
    colors: ['Black', 'White', 'Red', 'Blue'], // Placeholder - should come from variants
    sizes: ['S', 'M', 'L', 'XL'], // Placeholder - should come from variants
    badge,
    description: dbProduct.description || dbProduct.short_description || '',
    fabric: dbProduct.fabric || '',
    fit: dbProduct.fit || '',
    inStock: true, // Should check variants
    rating: 4.5, // Placeholder
    reviews: 0, // Placeholder
  };
}

/**
 * Transform array of database products
 */
export function transformProductsForCards(dbProducts: DbProduct[]): CardProduct[] {
  return dbProducts.map(transformProductForCard);
}
