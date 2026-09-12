import { motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const marqueeItems = [
  'NEW ARRIVALS',
  'TRENDING NOW',
  'YAVATMAL',
  'ALL INDIA SHIPPING',
  'WEAR BETTER. LOOK BETTER.',
  'FASHION 2 GETHER',
];

const moodCards = [
  {
    title: 'Statement Evenings',
    caption: 'Party-ready silhouettes with main-character energy.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=1500&fit=crop&q=88',
    href: '/shop?filter=trending',
    className: 'lg:col-span-7 lg:row-span-2',
  },
  {
    title: 'Soft Power',
    caption: 'Elevated everyday dressing, made effortless.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=88',
    href: '/shop',
    className: 'lg:col-span-5',
  },
  {
    title: 'After Dark',
    caption: 'Bold details. Clean attitude.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=88',
    href: '/shop?filter=new',
    className: 'lg:col-span-5',
  },
];

export function FashionMarquee() {
  return (
    <section className="f2g-marquee-wrap" aria-label="Fashion 2 Gether highlights">
      <div className="f2g-marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={`${item}-${i}`} className="f2g-marquee-item">
            <span className="f2g-marquee-star">✦</span>{item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function StyleUniverse() {
  return (
    <section className="f2g-editorial-section">
      <div className="f2g-editorial-head">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <p className="f2g-eyebrow">STYLE UNIVERSE</p>
          <h2>Not just outfits.<br /><span>A whole mood.</span></h2>
        </motion.div>
        <motion.div
          className="f2g-editorial-copy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <p>Discover looks built around confidence, color and the energy of what is trending right now.</p>
          <Link to="/shop" className="f2g-text-link">Explore the edit <ArrowUpRight size={15} /></Link>
        </motion.div>
      </div>

      <div className="f2g-mood-grid">
        {moodCards.map((card, i) => (
          <motion.article
            key={card.title}
            className={`f2g-mood-card ${card.className}`}
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: i * 0.08 }}
          >
            <Link to={card.href} className="f2g-mood-link">
              <img src={card.image} alt={card.title} loading="lazy" />
              <div className="f2g-mood-overlay" />
              <div className="f2g-mood-content">
                <p>{card.caption}</p>
                <div>
                  <h3>{card.title}</h3>
                  <span>SHOP THE MOOD <ArrowUpRight size={14} /></span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function CampaignSpotlight() {
  return (
    <section className="f2g-campaign">
      <div className="f2g-campaign-media">
        <motion.img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=1800&fit=crop&q=88"
          alt="Fashion 2 Gether editorial campaign"
          loading="lazy"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="f2g-campaign-shade" />
        <div className="f2g-campaign-stamp">
          <span>F2G</span>
          <small>YAVATMAL • 2026</small>
        </div>
      </div>

      <div className="f2g-campaign-copy">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="f2g-campaign-kicker"><Sparkles size={15} /> THE F2G EDIT</div>
          <h2>Wear the trend.<br /><em>Own the room.</em></h2>
          <p>
            Fashion 2 Gether brings the energy of an in-store fashion discovery into a fast, visual digital experience — from fresh drops to statement looks, all in one place.
          </p>
          <div className="f2g-campaign-actions">
            <Link to="/shop" className="f2g-dark-button">SHOP THE COLLECTION <ArrowUpRight size={15} /></Link>
            <a href="https://instagram.com/fashion2gether_" target="_blank" rel="noreferrer" className="f2g-instagram-link">
              <Instagram size={16} /> @fashion2gether_
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
