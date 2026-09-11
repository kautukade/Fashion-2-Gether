import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(['black party dress', 'kurti under 1500', 'new arrivals']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.collection.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const suggestions = query.length > 1
    ? products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Search Input */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, categories, styles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-off-white border border-charcoal/10 rounded-sm text-base focus:outline-none focus:border-gold transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal"
            >
              <X size={18} />
            </button>
          )}
        </motion.div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && query.length > 1 && (
          <motion.div
            className="mb-8 bg-white border border-charcoal/10 rounded-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="flex items-center gap-4 p-3 hover:bg-off-white transition-colors border-b border-charcoal/5 last:border-0"
              >
                <img src={product.images[0]} alt="" className="w-12 h-14 object-cover rounded-sm" />
                <div>
                  <p className="text-sm font-medium text-charcoal">{product.name}</p>
                  <p className="text-xs text-charcoal/50">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Recent Searches */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-gold" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal">Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="px-4 py-2 bg-off-white border border-charcoal/10 rounded-full text-sm text-charcoal/70 hover:border-gold hover:text-charcoal transition-all"
                >
                  {search}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-4">Popular Categories</p>
              <div className="flex flex-wrap gap-2">
                {['New Arrivals', 'Ethnic Wear', 'Party Wear', 'Dresses', 'Sale'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${cat.toLowerCase().replace(' ', '-')}`}
                    className="px-4 py-2 border border-charcoal/15 rounded-full text-sm text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {query.length > 1 && (
          <div>
            <p className="text-sm text-charcoal/50 mb-6">{results.length} results for "{query}"</p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-charcoal/50 text-lg">No products found</p>
                <p className="text-charcoal/40 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
