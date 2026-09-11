import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { transformProductsForCards } from '../utils/productTransform';
import type { Product as CardProduct } from '../data/products';

export default function Shop() {
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [gridCols, setGridCols] = useState(3);
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'Western Wear', 'Ethnic Wear', 'Party Wear', 'Casual Wear', 'Festive Wear', 'Bottom Wear'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹1000', value: '0-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: '₹2000 - ₹5000', value: '2000-5000' },
    { label: 'Above ₹5000', value: '5000-99999' },
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedPriceRange, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { status: 'active' };
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }

      if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        filters.minPrice = min;
        filters.maxPrice = max;
      }

      const data = await productService.getAll(filters);
      
      // Apply sorting
      let result = [...data];
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => a.selling_price - b.selling_price);
          break;
        case 'price-high':
          result.sort((a, b) => b.selling_price - a.selling_price);
          break;
        case 'popular':
          // Sort by featured/trending/bestseller flags
          result.sort((a, b) => {
            const scoreA = (a.is_featured ? 3 : 0) + (a.is_trending ? 2 : 0) + (a.is_bestseller ? 1 : 0);
            const scoreB = (b.is_featured ? 3 : 0) + (b.is_trending ? 2 : 0) + (b.is_bestseller ? 1 : 0);
            return scoreB - scoreA;
          });
          break;
        case 'discount':
          result.sort((a, b) => {
            const discountA = a.mrp ? ((a.mrp - a.selling_price) / a.mrp) : 0;
            const discountB = b.mrp ? ((b.mrp - b.selling_price) / b.mrp) : 0;
            return discountB - discountA;
          });
          break;
        default:
          break;
      }

      // Transform to card format
      setProducts(transformProductsForCards(result));
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products;

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal mb-3">Shop Collection</h1>
          <p className="text-charcoal/50 text-sm sm:text-base">Discover our curated selection of premium fashion</p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-charcoal/20 rounded-sm text-sm hover:bg-charcoal hover:text-white transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <span className="text-sm text-charcoal/50">{filteredProducts.length} products</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Grid Toggle - Desktop */}
            <div className="hidden lg:flex items-center gap-1 border border-charcoal/20 rounded-sm p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-sm ${gridCols === 3 ? 'bg-charcoal text-white' : 'text-charcoal/50'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-sm ${gridCols === 4 ? 'bg-charcoal text-white' : 'text-charcoal/50'}`}
              >
                <Grid3X3 size={14} />
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-charcoal/20 rounded-sm px-4 py-2 pr-8 text-sm text-charcoal cursor-pointer focus:outline-none focus:border-gold"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block text-sm capitalize transition-colors ${
                        selectedCategory === cat ? 'text-charcoal font-medium' : 'text-charcoal/50 hover:text-charcoal'
                      }`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedPriceRange(range.value)}
                      className={`block text-sm transition-colors ${
                        selectedPriceRange === range.value ? 'text-charcoal font-medium' : 'text-charcoal/50 hover:text-charcoal'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 sm:gap-5`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={loadProducts}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 sm:gap-5`}>
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-charcoal/50 text-lg">No products found</p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSelectedPriceRange('all'); }}
                      className="mt-4 text-gold text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[1100] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-cream z-[1200] rounded-t-2xl max-h-[80vh] overflow-y-auto lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            selectedCategory === cat
                              ? 'bg-charcoal text-white border-charcoal'
                              : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal'
                          }`}
                        >
                          {cat === 'all' ? 'All' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">Price</h4>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setSelectedPriceRange(range.value)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                            selectedPriceRange === range.value
                              ? 'bg-charcoal text-white border-charcoal'
                              : 'border-charcoal/20 text-charcoal/70 hover:border-charcoal'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-8 btn-primary"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
