import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useWishlistStore } from '../contexts/wishlistStore';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const badgeClass = {
    'NEW': 'badge-new',
    'TRENDING': 'badge-trending',
    'BESTSELLER': 'badge-bestseller',
    'LIMITED': 'badge-limited',
    'SALE': 'badge-sale',
  };

  return (
    <motion.div
      className="product-card group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="product-image w-full h-full object-cover"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`badge absolute top-3 left-3 ${badgeClass[product.badge]}`}>
              {product.badge}
            </span>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}

          {/* Hover Overlay */}
          <div className="product-overlay absolute inset-0 bg-black/10 flex items-center justify-center gap-3">
            <motion.button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-charcoal hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingBag size={16} />
            </motion.button>
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 z-10"
            style={{ display: discount > 0 ? 'none' : 'flex' }}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
          >
            <Heart
              size={14}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-charcoal/60'}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1.5">
          <h3 className="text-sm font-medium text-charcoal/90 group-hover:text-charcoal transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-charcoal/10"
                style={{
                  backgroundColor: color === 'Black' ? '#1a1a1a' :
                    color === 'White' || color === 'Ivory' ? '#f5f0eb' :
                    color === 'Red' || color === 'Maroon' ? '#722f37' :
                    color === 'Gold' ? '#c9a96e' :
                    color === 'Navy' ? '#1e3a5f' :
                    color === 'Sage' ? '#9caf88' :
                    color === 'Pink' || color === 'Dusty Rose' ? '#d4a5a5' :
                    color === 'Blue' ? '#4a6fa5' :
                    color === 'Green' || color === 'Emerald' ? '#2d6a4f' :
                    color === 'Beige' || color === 'Camel' ? '#c4a882' :
                    color === 'Silver' ? '#c0c0c0' :
                    color === 'Yellow' ? '#f4d03f' :
                    color === 'Purple' ? '#6c3483' : '#ddd'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-charcoal/50">+{product.colors.length - 4}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-charcoal/40 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-[10px] font-medium text-green-700">{discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
