import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Shop() {
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [gridCols, setGridCols] = useState(3);

  const categories = ['all', 'Western Wear', 'Ethnic Wear', 'Party Wear', 'Casual Wear', 'Festive Wear', 'Bottom Wear'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹1000', value: '0-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: '₹2000 - ₹5000', value: '2000-5000' },
    { label: 'Above ₹5000', value: '5000-99999' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'discount':
        result.sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp));
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedPriceRange, sortBy]);

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
