import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, MapPin, Clock, Phone, Instagram } from 'lucide-react';
import ProductCard from './ProductCard';
import Fashion3DSection from './3d/Fashion3DSection';
import { products, categories, reviews, reels } from '../data/products';
import { productService } from '../services/productService';
import { transformProductsForCards } from '../utils/productTransform';
import type { Product as CardProduct } from '../data/products';

// Section Header Component
function SectionHeader({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'center' | 'left' }) {
  return (
    <motion.div
      className={`mb-10 sm:mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {subtitle && (
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-body">{subtitle}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight">{title}</h2>
      {align === 'center' && <div className="section-divider mt-5" />}
    </motion.div>
  );
}

// NEW DROP SECTION
export function NewDropSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newProducts, setNewProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ trending: true, status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 8);
      setNewProducts(cardProducts);
    }).catch(() => {
      // Fallback to demo data if Supabase fails
      setNewProducts(products.filter(p => p.badge === 'NEW' || p.badge === 'TRENDING'));
    });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <motion.p
            className="text-gold text-xs tracking-[0.3em] uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Just Landed
          </motion.p>
          <motion.h2
            className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            New Drop
          </motion.h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scroll('left')} className="w-10 h-10 border border-charcoal/20 rounded-full flex items-center justify-center hover:bg-charcoal hover:text-white transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 border border-charcoal/20 rounded-full flex items-center justify-center hover:bg-charcoal hover:text-white transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="horizontal-scroll gap-4 sm:gap-6 pb-4">
        {newProducts.map((product, i) => (
          <div key={product.id} className="w-[260px] sm:w-[300px]">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

// SHOP BY CATEGORY
export function ShopByCategorySection() {
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    productService.getCategories().then(cats => {
      setDbCategories(cats);
    }).catch(() => {
      // Fallback to demo categories
      setDbCategories(categories);
    });
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-off-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Shop By Category" subtitle="Curated Collections" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {dbCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              className="group relative overflow-hidden rounded-sm cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/shop?category=${cat.id}`}>
                <div className={`relative ${i === 0 || i === 3 ? 'aspect-[3/4]' : 'aspect-[4/5]'} overflow-hidden`}>
                  <img
                    src={cat.image_url || cat.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="font-display text-white text-lg sm:text-xl md:text-2xl mb-1">{cat.name}</h3>
                    <p className="text-white/70 text-xs sm:text-sm">{cat.description}</p>
                    <span className="inline-block mt-2 text-gold text-[10px] tracking-[0.2em] uppercase group-hover:translate-x-2 transition-transform duration-300">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TRENDING NOW
export function TrendingSection() {
  const [trendingProducts, setTrendingProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ trending: true, status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 8);
      setTrendingProducts(cardProducts);
    }).catch(() => {
      // Fallback to demo data
      setTrendingProducts(products.filter(p => p.badge === 'TRENDING' || p.badge === 'BESTSELLER'));
    });
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <SectionHeader title="Trending Now" subtitle="Most Loved This Week" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {trendingProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link to="/shop" className="btn-outline">
          VIEW ALL PRODUCTS
        </Link>
      </motion.div>
    </section>
  );
}

// 3D INTERACTIVE FASHION SECTION - Uses real Three.js/WebGL
export function InteractiveSection() {
  return (
    <Fashion3DSection />
  );
}

// SHOP THE REEL
export function ShopTheReelSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <SectionHeader title="Shop The Reel" subtitle="Style Inspiration" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {reels.map((reel, i) => (
          <motion.div
            key={reel.id}
            className="reel-card group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <img
              src={reel.thumbnail}
              alt={reel.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Play button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <Play size={18} className="text-charcoal ml-0.5" fill="currentColor" />
              </div>
            </div>
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <h4 className="text-white text-sm font-medium mb-0.5">{reel.title}</h4>
              <p className="text-white/70 text-xs">{reel.caption}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-gold text-[10px] tracking-wider uppercase">Shop Look</span>
                <span className="text-gold text-[10px]">→</span>
              </div>
            </div>
            {/* Product count badge */}
            <div className="absolute top-3 right-3 bg-white/90 text-charcoal text-[10px] font-bold px-2 py-1 rounded-full">
              {reel.products.length} items
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// EDITORIAL SECTION
export function EditorialSection() {
  const { scrollYProgress } = useScroll();
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop"
              alt="Editorial Campaign"
              className="w-full h-full object-cover"
              style={{ y: imgY }}
            />
          </motion.div>

          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Campaign</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight mb-6">
              Redefining<br />
              <span className="font-elegant italic">Modern</span> Elegance
            </h2>
            <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed mb-4">
              Our latest campaign celebrates the modern woman — confident, bold, and unapologetically herself. Each piece is crafted to empower and inspire.
            </p>
            <p className="text-charcoal/60 text-base sm:text-lg leading-relaxed mb-8">
              From boardrooms to celebrations, from casual brunches to grand festivities — Fashion 2 Gether is your companion for every chapter of your story.
            </p>
            <Link to="/shop" className="btn-primary">
              EXPLORE THE CAMPAIGN
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// CUSTOMER REVIEWS
export function ReviewsSection() {
  return (
    <section className="py-16 sm:py-24 bg-off-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="What Our Customers Say" subtitle="Real Reviews" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white p-6 sm:p-8 rounded-sm border border-charcoal/5 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              {/* Review Text */}
              <p className="text-charcoal/70 text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center text-gold font-display text-sm font-semibold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{review.name}</p>
                  <p className="text-xs text-charcoal/50">{review.date} • {review.verified && '✓ Verified'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// STORE SECTION
export function StoreSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Visit Us</p>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-6">Our Store</h2>
          <p className="text-charcoal/60 text-base leading-relaxed mb-8">
            Experience our collection in person at our Yavatmal store. Our style consultants are ready to help you find your perfect look.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Address</p>
                <p className="text-sm text-charcoal/60">Main Road, Yavatmal, Maharashtra 445001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Hours</p>
                <p className="text-sm text-charcoal/60">Mon - Sat: 10:00 AM - 9:00 PM</p>
                <p className="text-sm text-charcoal/60">Sunday: 11:00 AM - 8:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Contact</p>
                <p className="text-sm text-charcoal/60">+91 95955 35339</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Instagram size={18} className="text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Instagram</p>
                <p className="text-sm text-charcoal/60">@fashion2gether</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-3 px-5">
              GET DIRECTIONS
            </a>
            <a href="https://wa.me/919595535339" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-3 px-5 bg-green-700 hover:bg-green-800">
              WHATSAPP US
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative aspect-[4/3] rounded-sm overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
            alt="Fashion 2 Gether Store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

// NEWSLETTER SECTION
export function NewsletterSection() {
  return (
    <section className="py-16 sm:py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-burgundy/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Stay Connected</p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Join The Fashion Club</h2>
          <p className="text-white/60 text-base mb-8">
            Get early access to new drops, exclusive offers, and style inspiration delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold/50 rounded-sm"
            />
            <button className="btn-primary bg-gold text-white hover:bg-gold-light whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>

          <p className="text-white/40 text-xs mt-4">Or join our WhatsApp club for instant updates</p>
          <a href="https://wa.me/919595535339" className="inline-flex items-center gap-2 mt-3 text-green-400 text-sm hover:text-green-300 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Join WhatsApp Club
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// LIMITED TIME SALE
export function SaleSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-cream-dark">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop"
              alt="Sale"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent" />
          </motion.div>

          <motion.div
            className="text-center lg:text-left lg:pl-12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge badge-sale mb-4">LIMITED TIME</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal mt-4 mb-4">
              Season<br />Sale
            </h2>
            <p className="text-2xl sm:text-3xl font-elegant text-gold italic mb-2">Up to 50% Off</p>
            <p className="text-charcoal/60 text-base mb-8 max-w-md">
              Don't miss out on our biggest sale of the season. Premium fashion at unbeatable prices.
            </p>

            {/* Countdown */}
            <div className="flex gap-4 justify-center lg:justify-start mb-8">
              {[
                { value: '03', label: 'Days' },
                { value: '14', label: 'Hours' },
                { value: '27', label: 'Mins' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 bg-charcoal text-white flex items-center justify-center text-2xl font-display rounded-sm">
                    {item.value}
                  </div>
                  <span className="text-[10px] text-charcoal/50 uppercase tracking-wider mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>

            <Link to="/shop?filter=sale" className="btn-primary bg-burgundy hover:bg-burgundy/90">
              SHOP THE SALE
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// BEST SELLERS
export function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ bestseller: true, status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 8);
      setBestSellers(cardProducts);
    }).catch(() => {
      // Fallback to demo data
      setBestSellers(products.filter(p => p.badge === 'BESTSELLER'));
    });
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      <SectionHeader title="Best Sellers" subtitle="Customer Favorites" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {bestSellers.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

// COMPLETE THE LOOK
export function CompleteTheLookSection() {
  return (
    <section className="py-16 sm:py-24 bg-off-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Complete The Look" subtitle="Styling Guide" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, i) => (
            <motion.div
              key={product.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link to={`/product/${product.slug}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{product.name}</p>
                  <p className="text-gold text-sm mt-1">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
