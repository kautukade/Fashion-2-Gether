import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronRight, Truck, RotateCcw, Shield, Minus, Plus, Share2 } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

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
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
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
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-11 px-3 border rounded-sm text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'border-charcoal/20 text-charcoal hover:border-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-charcoal/5 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                ADD TO BAG
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-charcoal/20 hover:border-charcoal'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <button className="w-12 h-12 border border-charcoal/20 rounded-sm flex items-center justify-center hover:border-charcoal transition-all">
                <Share2 size={16} />
              </button>
            </div>

            {/* Buy Now + WhatsApp */}
            <div className="flex gap-3 mb-8">
              <button className="flex-1 btn-outline">BUY NOW</button>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Fashion 2 Gether,\nI am interested in:\n\n${product.name}\nSize: ${selectedSize || 'Not selected'}\nColor: ${selectedColor}\nPrice: ₹${product.price}`)}`}
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
        <button className="flex-1 btn-primary text-xs py-3">
          <ShoppingBag size={14} className="mr-2" />
          ADD TO BAG — ₹{product.price.toLocaleString()}
        </button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
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
