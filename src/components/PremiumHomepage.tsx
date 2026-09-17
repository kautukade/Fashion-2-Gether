import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronRight,
  Instagram,
  MessageCircle,
  Share2,
  Sparkles,
  Truck,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import ProductCard from './ProductCard';
import Fashion3DSection from './3d/Fashion3DSection';
import { productService } from '../services/productService';
import { transformProductsForCards } from '../utils/productTransform';
import { products as demoProducts, categories as demoCategories } from '../data/products';
import type { Product as CardProduct, Category as DemoCategory } from '../data/products';

type HomeCategory = {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  image_url?: string | null;
  description?: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="ph-eyebrow">
      <span />
      <p>{children}</p>
    </div>
  );
}

function ProductEditorialCard({ product, className = '' }: { product: CardProduct; className?: string }) {
  return (
    <Link to={`/product/${product.slug}`} className={`ph-editorial-card group ${className}`}>
      <img src={product.images?.[0]} alt={product.name} loading="lazy" />
      <div className="ph-editorial-card-shade" />
      <div className="ph-editorial-card-copy">
        <span>{product.badge || product.collection || 'THE F2G EDIT'}</span>
        <div>
          <h3>{product.name}</h3>
          <p>₹{Number(product.price || 0).toLocaleString()}</p>
        </div>
      </div>
      <div className="ph-editorial-card-arrow">
        <ArrowUpRight size={18} />
      </div>
    </Link>
  );
}

function PremiumHero({ feature }: { feature: CardProduct }) {
  const secondary = demoProducts.find((p) => p.id !== feature.id) || demoProducts[1] || feature;

  return (
    <section className="ph-hero">
      <div className="ph-hero-backdrop" aria-hidden>
        <img src={secondary.images?.[0] || feature.images?.[0]} alt="" />
      </div>
      <div className="ph-hero-noise" aria-hidden />
      <div className="ph-hero-glow ph-hero-glow-pink" aria-hidden />
      <div className="ph-hero-glow ph-hero-glow-blue" aria-hidden />

      <div className="ph-hero-inner">
        <motion.div
          className="ph-hero-copy"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="ph-hero-brandline">
            <BrandLogo link={false} className="ph-hero-logo" priority />
            <span>Yavatmal • All India Shipping</span>
          </div>

          <p className="ph-hero-kicker">THE NEW F2G EXPERIENCE</p>
          <h1>
            Dress the
            <em> moment.</em>
          </h1>
          <p className="ph-hero-lead">
            Trend-led fashion, fresh drops and statement looks — presented like a digital fashion magazine, built to shop in seconds.
          </p>

          <div className="ph-hero-actions">
            <Link to="/shop" className="ph-primary-cta">
              Shop New Arrivals <ArrowUpRight size={17} />
            </Link>
            <Link to={`/product/${feature.slug}`} className="ph-secondary-cta">
              View Featured Look <ChevronRight size={16} />
            </Link>
          </div>

          <div className="ph-hero-meta">
            <div><strong>01</strong><span>Fresh fashion discovery</span></div>
            <div><strong>02</strong><span>Fast mobile shopping</span></div>
            <div><strong>03</strong><span>Direct WhatsApp support</span></div>
          </div>
        </motion.div>

        <motion.div
          className="ph-hero-visual"
          initial={{ opacity: 0, x: 42, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.15, ease }}
        >
          <Link to={`/product/${feature.slug}`} className="ph-cover-card group">
            <img src={feature.images?.[0]} alt={feature.name} />
            <div className="ph-cover-gradient" />
            <div className="ph-cover-topline">
              <span>F2G / 2026</span>
              <span>FEATURED LOOK</span>
            </div>
            <div className="ph-cover-bottom">
              <div>
                <p>{feature.badge || 'NEW DROP'}</p>
                <h2>{feature.name}</h2>
                <span>₹{Number(feature.price || 0).toLocaleString()}</span>
              </div>
              <div className="ph-cover-arrow"><ArrowUpRight size={20} /></div>
            </div>
          </Link>

          <div className="ph-floating-note ph-note-one">
            <Sparkles size={14} />
            <span>Wear better. Look better.</span>
          </div>
          <div className="ph-floating-note ph-note-two">
            <Truck size={14} />
            <span>All India Shipping</span>
          </div>
        </motion.div>
      </div>

      <div className="ph-hero-scroll">SCROLL TO DISCOVER <span /></div>
    </section>
  );
}

function FashionTicker() {
  const items = ['NEW DROP', 'TRENDING NOW', 'PARTY WEAR', 'ETHNIC EDIT', 'WESTERN WEAR', 'SHOP THE LOOK'];
  return (
    <div className="ph-ticker" aria-label="Fashion highlights">
      <div className="ph-ticker-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}><i>✦</i>{item}</span>
        ))}
      </div>
    </div>
  );
}

function NewDropEditorial({ products }: { products: CardProduct[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;

  return (
    <section className="ph-section ph-new-drop" id="new-drop">
      <div className="ph-section-head ph-section-head-split">
        <div>
          <SectionEyebrow>JUST LANDED</SectionEyebrow>
          <h2>New drop.<br /><em>New energy.</em></h2>
        </div>
        <div className="ph-section-intro">
          <p>A cleaner, editorial way to discover what just arrived — fewer distractions, stronger imagery and direct paths to shop.</p>
          <Link to="/shop?filter=new">View all new arrivals <ArrowUpRight size={15} /></Link>
        </div>
      </div>

      <div className="ph-new-drop-grid">
        <ProductEditorialCard product={lead} className="ph-new-drop-lead" />
        <div className="ph-new-drop-products">
          {rest.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryEditorial({ categories }: { categories: HomeCategory[] }) {
  if (!categories.length) return null;

  return (
    <section className="ph-category-section">
      <div className="ph-category-copy">
        <SectionEyebrow>SHOP YOUR MOOD</SectionEyebrow>
        <h2>One store.<br /><em>Every version of you.</em></h2>
        <p>Move from everyday essentials to statement dressing without leaving the same visual story.</p>
        <Link to="/shop" className="ph-dark-link">Explore all categories <ArrowUpRight size={15} /></Link>
      </div>

      <div className="ph-category-grid">
        {categories.slice(0, 4).map((category, index) => {
          const fallback = demoCategories[index % demoCategories.length] as DemoCategory;
          const image = category.image_url || category.image || fallback?.image;
          const slug = category.slug || category.id;
          return (
            <motion.div
              key={category.id}
              className={`ph-category-card ph-category-${index + 1}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.72, delay: index * 0.07, ease }}
            >
              <Link to={`/shop?category=${encodeURIComponent(slug)}`}>
                <img src={image} alt={category.name} loading="lazy" />
                <div className="ph-category-shade" />
                <div className="ph-category-label">
                  <span>0{index + 1}</span>
                  <div><h3>{category.name}</h3><p>Shop the edit</p></div>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function BestSellerRail({ products }: { products: CardProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="ph-section ph-best-section">
      <div className="ph-section-head ph-section-head-inline">
        <div>
          <SectionEyebrow>MOST WANTED</SectionEyebrow>
          <h2>Best sellers</h2>
        </div>
        <Link to="/shop?filter=bestseller">Shop best sellers <ArrowUpRight size={15} /></Link>
      </div>
      <div className="ph-product-rail">
        {products.slice(0, 6).map((product, index) => (
          <div className="ph-product-rail-item" key={product.id}>
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialCommercePanel({ products }: { products: CardProduct[] }) {
  const cards = products.slice(0, 3);
  return (
    <section className="ph-social-section">
      <div className="ph-social-copy">
        <SectionEyebrow>SOCIAL-FIRST FASHION</SectionEyebrow>
        <h2>See it.<br />Share it.<br /><em>Shop it.</em></h2>
        <p>Every product has its own shareable link, so customers can send a look directly on WhatsApp or any supported app and come back to the same product page.</p>
        <div className="ph-social-actions">
          <a href="https://instagram.com/fashion2gether_" target="_blank" rel="noreferrer">
            <Instagram size={16} /> Instagram
          </a>
          <a href="https://wa.me/919595535339" target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      </div>
      <div className="ph-social-cards">
        {cards.map((product, index) => (
          <Link key={product.id} to={`/product/${product.slug}`} className={`ph-social-card ph-social-card-${index + 1}`}>
            <img src={product.images?.[0]} alt={product.name} loading="lazy" />
            <div className="ph-social-card-overlay" />
            <span><Share2 size={14} /> SHAREABLE LOOK</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ConversionStrip() {
  return (
    <section className="ph-conversion-strip">
      <div><Truck size={18} /><span><strong>All India Shipping</strong><small>Shop from anywhere in India</small></span></div>
      <div><MessageCircle size={18} /><span><strong>WhatsApp Support</strong><small>Direct product and order help</small></span></div>
      <div><Share2 size={18} /><span><strong>Share Any Product</strong><small>Send a direct product link instantly</small></span></div>
    </section>
  );
}

export default function PremiumHomepage() {
  const [newProducts, setNewProducts] = useState<CardProduct[]>(demoProducts.slice(0, 5));
  const [bestProducts, setBestProducts] = useState<CardProduct[]>(demoProducts.filter((p) => p.badge === 'BESTSELLER').slice(0, 6));
  const [categories, setCategories] = useState<HomeCategory[]>(demoCategories.slice(0, 4));

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      productService.getAll({ status: 'active' }),
      productService.getAll({ bestseller: true, status: 'active' }),
      productService.getCategories(),
    ]).then(([allResult, bestResult, categoryResult]) => {
      if (!active) return;
      if (allResult.status === 'fulfilled' && allResult.value.length) {
        setNewProducts(transformProductsForCards(allResult.value).slice(0, 6));
      }
      if (bestResult.status === 'fulfilled' && bestResult.value.length) {
        setBestProducts(transformProductsForCards(bestResult.value).slice(0, 6));
      }
      if (categoryResult.status === 'fulfilled' && categoryResult.value.length) {
        setCategories(categoryResult.value.slice(0, 4) as HomeCategory[]);
      }
    });
    return () => { active = false; };
  }, []);

  const feature = useMemo(() => newProducts[0] || demoProducts[0], [newProducts]);
  const socialProducts = useMemo(() => newProducts.slice(1, 4).length ? newProducts.slice(1, 4) : demoProducts.slice(1, 4), [newProducts]);

  return (
    <main className="ph-home">
      <PremiumHero feature={feature} />
      <FashionTicker />
      <NewDropEditorial products={newProducts} />
      <CategoryEditorial categories={categories} />
      <section className="ph-3d-wrap">
        <Fashion3DSection />
      </section>
      <BestSellerRail products={bestProducts.length ? bestProducts : newProducts} />
      <SocialCommercePanel products={socialProducts} />
      <ConversionStrip />
    </main>
  );
}
