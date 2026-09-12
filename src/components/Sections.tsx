import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Instagram, ArrowRight, Quote } from 'lucide-react';
import ProductCard from './ProductCard';
import Fashion3DSection from './3d/Fashion3DSection';
import { products, categories, reviews } from '../data/products';
import { productService } from '../services/productService';
import { transformProductsForCards } from '../utils/productTransform';
import type { Product as CardProduct } from '../data/products';

// Elegant Section Header
function SectionHeader({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'center' | 'left' }) {
  return (
    <motion.div
      className={`mb-12 sm:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {subtitle && (
        <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-4 font-medium">{subtitle}</p>
      )}
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-tight">
        {title}
      </h2>
    </motion.div>
  );
}

// FEATURED COLLECTION - Hero-style featured products
export function FeaturedCollection() {
  const [featuredProducts, setFeaturedProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ featured: true, status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 3);
      setFeaturedProducts(cardProducts);
    }).catch(() => {
      setFeaturedProducts(products.slice(0, 3));
    });
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <SectionHeader title="Featured Collection" subtitle="Curated For You" />
      
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        {featuredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7 }}
          >
            <Link to={`/product/${product.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="font-display text-lg sm:text-xl text-charcoal mb-2 group-hover:text-gold transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-charcoal/60">₹{product.price.toLocaleString()}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// CATEGORY SHOWCASE - Elegant category grid
export function CategoryShowcase() {
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    productService.getCategories().then(cats => {
      setDbCategories(cats.slice(0, 6));
    }).catch(() => {
      setDbCategories(categories.slice(0, 6));
    });
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-off-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Shop By Category" subtitle="Explore Collections" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {dbCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link to={`/shop?category=${cat.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream-dark">
                  <img
                    src={cat.image_url || cat.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="font-display text-white text-xl sm:text-2xl mb-2">{cat.name}</h3>
                    <div className="flex items-center gap-2 text-gold text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
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

// NEW ARRIVALS - Clean product grid
export function NewArrivals() {
  const [newProducts, setNewProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 8);
      setNewProducts(cardProducts);
    }).catch(() => {
      setNewProducts(products.slice(0, 8));
    });
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <SectionHeader title="New Arrivals" subtitle="Just Landed" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {newProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
          View All Products
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}

// BRAND EXPERIENCE - 3D Interactive Section
export function BrandExperience() {
  return <Fashion3DSection />;
}

// BEST SELLERS - Premium product display
export function BestSellers() {
  const [bestSellers, setBestSellers] = useState<CardProduct[]>([]);

  useEffect(() => {
    productService.getAll({ bestseller: true, status: 'active' }).then((dbProducts) => {
      const cardProducts = transformProductsForCards(dbProducts).slice(0, 4);
      setBestSellers(cardProducts);
    }).catch(() => {
      setBestSellers(products.filter(p => p.badge === 'BESTSELLER').slice(0, 4));
    });
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-charcoal">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-4">Customer Favorites</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
            Best Sellers
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// EDITORIAL CAMPAIGN - Full-width editorial section
export function EditorialCampaign() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-sm"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop"
            alt="Editorial Campaign"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-4">The Campaign</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal mb-6 leading-tight">
            Redefining Modern Elegance
          </h2>
          <p className="text-charcoal/70 text-base sm:text-lg leading-relaxed mb-8">
            Our latest collection celebrates the modern woman — confident, bold, and unapologetically herself. Each piece is crafted to empower and inspire.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// CUSTOMER TESTIMONIALS - Elegant reviews section
export function CustomerTestimonials() {
  return (
    <section className="py-20 sm:py-28 bg-off-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="What Our Customers Say" subtitle="Real Reviews" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white p-6 sm:p-8 rounded-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Quote size={32} className="text-gold/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-charcoal/80 text-sm leading-relaxed mb-6 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-display font-semibold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{review.name}</p>
                  <p className="text-xs text-charcoal/50">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// STORE VISIT - Physical store information
export function StoreVisit() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-4">Visit Us</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal mb-6">Our Store</h2>
          <p className="text-charcoal/70 text-base leading-relaxed mb-8">
            Experience our collection in person at our Yavatmal store. Our style consultants are ready to help you find your perfect look.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Address</p>
                <p className="text-sm text-charcoal/60">Main Road, Yavatmal, Maharashtra 445001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Hours</p>
                <p className="text-sm text-charcoal/60">Mon - Sat: 10:00 AM - 9:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gold mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Contact</p>
                <p className="text-sm text-charcoal/60">+91 95955 35339</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-3 px-5">
              Get Directions
            </a>
            <a href="https://wa.me/919595535339" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-3 px-5 bg-green-700 hover:bg-green-800">
              WhatsApp Us
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
        </motion.div>
      </div>
    </section>
  );
}

// NEWSLETTER - Email signup section
export function Newsletter() {
  return (
    <section className="py-20 sm:py-28 bg-charcoal">
      <div className="max-w-2xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-4">Stay Connected</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">Join The Fashion Club</h2>
          <p className="text-white/60 text-base mb-8">
            Get early access to new drops, exclusive offers, and style inspiration.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold/50 rounded-sm"
            />
            <button className="btn-primary bg-gold text-white hover:bg-gold-light whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-white/40 text-xs mt-6">Or join our WhatsApp club for instant updates</p>
          <a href="https://wa.me/919595535339" className="inline-flex items-center gap-2 mt-3 text-green-400 text-sm hover:text-green-300 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Join WhatsApp Club
          </a>
        </motion.div>
      </div>
    </section>
  );
}
