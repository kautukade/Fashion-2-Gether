import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../contexts/wishlistStore';
import { products } from '../data/products';

export default function Wishlist() {
  const wishlistIds = useWishlistStore((s) => s.items);
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <Heart size={48} className="text-charcoal/20 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-charcoal mb-2">Your wishlist is empty</h1>
          <p className="text-charcoal/50 text-sm mb-6">Save your favorite items here.</p>
          <Link to="/shop" className="btn-primary">EXPLORE PRODUCTS</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8 sm:mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">My Wishlist</h1>
          <p className="text-charcoal/50 text-sm mt-1">{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
