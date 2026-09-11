import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronRight, Truck, RotateCcw, Shield, Minus, Plus, Share2, Check } from 'lucide-react';
import { productService } from '../services/productService';
import { transformProductForCard } from '../utils/productTransform';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../contexts/cartStore';
import { useWishlistStore } from '../contexts/wishlistStore';
import type { Product as CardProduct } from '../data/products';
import type { ProductVariant } from '../types/database';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<CardProduct | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [stockError, setStockError] = useState('');

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id || ''));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    
    try {
      const dbProduct = await productService.getBySlug(slug);
      if (!dbProduct) {
        setError('Product not found');
        setLoading(false);
        return;
      }

      // Transform to card format
      const cardProduct = transformProductForCard(dbProduct);
      setProduct(cardProduct);

      // Fetch variants
      const productVariants = await productService.getVariants(dbProduct.id);
      setVariants(productVariants);

      // Set default color and size from first available variant
      if (productVariants.length > 0) {
        setSelectedColor(productVariants[0].color);
        setSelectedSize(productVariants[0].size);
      }

      // Fetch related products (same category)
      if (dbProduct.category_id) {
        const related = await productService.getAll({
          category: dbProduct.category_id,
          status: 'active'
        });
        const relatedCards = related
          .filter(p => p.id !== dbProduct.id)
          .slice(0, 4)
          .map(transformProductForCard);
        setRelatedProducts(relatedCards);
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get available sizes for selected color
  const availableSizes = variants
    .filter(v => v.color === selectedColor && v.stock_quantity > 0)
    .map(v => v.size);

  // Get available colors
  const availableColors = [...new Set(variants.filter(v => v.stock_quantity > 0).map(v => v.color))];

  // Get selected variant
  const selectedVariant = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      setShowSizeError(true);
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      setStockError(`Only ${selectedVariant.stock_quantity} items available`);
      return;
    }

    setShowSizeError(false);
    setStockError('');
    
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant.price_override || product.price,
      mrp: product.mrp,
      quantity,
      slug: product.slug,
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      setShowSizeError(true);
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-sm"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal/50 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <span className={`badge absolute top-4 left-4 ${
                  product.badge === 'NEW' ? 'badge-new' :
                  product.badge === 'TRENDING' ? 'badge-trending' :
                  product.badge === 'BESTSELLER' ? 'badge-bestseller' :
                  product.badge === 'LIMITED' ? 'badge-limited' : 'badge-sale'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-charcoal/20'} />
                ))}
              </div>
              <span className="text-xs text-charcoal/50">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Name */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-charcoal mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-semibold text-charcoal">₹{product.price.toLocaleString()}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-charcoal/40 line-through">₹{product.mrp.toLocaleString()}</span>
                  <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Tax Info */}
            <p className="text-xs text-charcoal/50 mb-6">Inclusive of all taxes. Free shipping above ₹999.</p>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">
                Color: <span className="font-normal text-charcoal/60">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      // Reset size when color changes
                      const firstAvailableSize = variants.find(v => v.color === color && v.stock_quantity > 0)?.size;
                      if (firstAvailableSize) {
                        setSelectedSize(firstAvailableSize);
                      } else {
                        setSelectedSize('');
                      }
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-gold scale-110' : 'border-charcoal/10 hover:border-charcoal/30'
                    }`}
                    style={{
                      backgroundColor: color === 'Black' ? '#1a1a1a' :
                        color === 'White' || color === 'Ivory' ? '#f5f0eb' :
                        color === 'Red' || color === 'Maroon' ? '#722f37' :
                        color === 'Gold' ? '#c9a96e' :
                        color === 'Navy' ? '#1e3a5f' :
                        color === 'Sage' ? '#9caf88' :
                        color === 'Pink' || color === 'Dusty Rose' ? '#d4a5a5' :
                        color === 'Blue' || color === 'Light Wash' ? '#4a6fa5' :
                        color === 'Green' || color === 'Emerald' ? '#2d6a4f' :
                        color === 'Beige' || color === 'Camel' ? '#c4a882' :
                        color === 'Silver' || color === 'Dark Wash' ? '#c0c0c0' :
                        color === 'Yellow' ? '#f4d03f' :
                        color === 'Purple' ? '#6c3483' : '#ddd'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal">Size</p>
                <button className="text-xs text-gold hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`min-w-[44px] h-11 px-3 border rounded-sm text-sm transition-all ${
                        !isAvailable
                          ? 'border-charcoal/10 text-charcoal/30 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'border-charcoal/20 text-charcoal hover:border-charcoal'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-charcoal/50 mt-2">
                  {selectedVariant.stock_quantity > 0 
                    ? `${selectedVariant.stock_quantity} in stock`
                    : 'Out of stock'}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal mb-3">Quantity</p>
              <div className="flex items-center border border-charcoal/20 rounded-sm w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => {
                    const maxStock = selectedVariant?.stock_quantity || 99;
                    if (quantity < maxStock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  disabled={selectedVariant ? quantity >= selectedVariant.stock_quantity : false}
                  className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus size={14} />
                </button>
              </div>
              {selectedVariant && quantity >= selectedVariant.stock_quantity && (
                <p className="text-xs text-orange-600 mt-2">Maximum stock reached</p>
              )}
            </div>

            {/* Action Buttons */}
            {/* Size Error */}
            {showSizeError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
                Please select a size before adding to bag.
              </div>
            )}

            {/* Stock Error */}
            {stockError && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-sm text-sm text-orange-700">
                {stockError}
              </div>
            )}

            {/* Added to Cart Success */}
            {addedToCart && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700 flex items-center gap-2">
                <Check size={14} /> Added to bag successfully!
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                {addedToCart ? 'ADDED ✓' : 'ADD TO BAG'}
              </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all ${
                isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-charcoal/20 hover:border-charcoal'
              }`}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
            </button>              <button className="w-12 h-12 border border-charcoal/20 rounded-sm flex items-center justify-center hover:border-charcoal transition-all">
                <Share2 size={16} />
              </button>
            </div>

            {/* Buy Now + WhatsApp */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleBuyNow} className="flex-1 btn-outline">BUY NOW</button>
              <a
                href={`https://wa.me/919595535339?text=${encodeURIComponent(`Hi Fashion 2 Gether,\nI am interested in:\n\n${product.name}\nSize: ${selectedSize || 'Not selected'}\nColor: ${selectedColor}\nPrice: ₹${product.price}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-green-700 text-green-700 hover:bg-green-700 hover:text-white flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="text-xs">WHATSAPP</span>
              </a>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center text-center p-3 bg-off-white rounded-sm">
                <Truck size={18} className="text-gold mb-1.5" />
                <span className="text-[10px] text-charcoal/60">Free Shipping<br />Above ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-off-white rounded-sm">
                <RotateCcw size={18} className="text-gold mb-1.5" />
                <span className="text-[10px] text-charcoal/60">7 Day<br />Returns</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-off-white rounded-sm">
                <Shield size={18} className="text-gold mb-1.5" />
                <span className="text-[10px] text-charcoal/60">100%<br />Genuine</span>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t border-charcoal/10 pt-6">
              <div className="flex gap-6 mb-4">
                {['description', 'details', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs tracking-[0.15em] uppercase pb-2 border-b-2 transition-all ${
                      activeTab === tab ? 'border-gold text-charcoal' : 'border-transparent text-charcoal/40 hover:text-charcoal/70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-sm text-charcoal/70 leading-relaxed">
                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p><span className="text-charcoal font-medium">Fabric:</span> {product.fabric}</p>
                    <p><span className="text-charcoal font-medium">Fit:</span> {product.fit}</p>
                    <p><span className="text-charcoal font-medium">Category:</span> {product.category}</p>
                    <p><span className="text-charcoal font-medium">Collection:</span> {product.collection}</p>
                    <p><span className="text-charcoal font-medium">Care:</span> Gentle machine wash, do not bleach</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>• Free shipping on orders above ₹999</p>
                    <p>• Standard delivery: 5-7 business days</p>
                    <p>• Express delivery: 2-3 business days (₹149)</p>
                    <p>• All India shipping available</p>
                    <p>• Easy 7-day returns & exchange</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-charcoal/10 p-3 flex gap-3 lg:hidden z-50">
        <button onClick={handleAddToCart} className="flex-1 btn-primary text-xs py-3">
          <ShoppingBag size={14} className="mr-2" />
          {addedToCart ? 'ADDED ✓' : `ADD TO BAG — ₹${product.price.toLocaleString()}`}
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`w-11 h-11 border rounded-sm flex items-center justify-center ${
            isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-charcoal/20'
          }`}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>
    </main>
  );
}
