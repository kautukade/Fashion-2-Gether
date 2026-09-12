import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="brand-footer text-white overflow-hidden">
      <div className="border-y border-white/7 py-5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content font-display text-2xl sm:text-4xl md:text-5xl text-white/12 tracking-[-.02em]">
            <span className="px-8">WEAR BETTER • LOOK BETTER • FASHION 2 GETHER • ALL INDIA SHIPPING • </span>
            <span className="px-8">WEAR BETTER • LOOK BETTER • FASHION 2 GETHER • ALL INDIA SHIPPING • </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.25fr_.75fr_.75fr_.9fr] gap-10 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <BrandLogo className="w-[230px] sm:w-[270px] mb-6" imageClassName="h-auto" />
            <p className="font-elegant italic text-2xl text-white/80 mb-3">Wear better. Look better.</p>
            <p className="text-white/42 text-sm leading-relaxed max-w-md">
              Yavatmal's most trending fashion destination with an online experience built for discovery, drops and effortless shopping across India.
            </p>
            <div className="flex gap-3 mt-7">
              <a href="https://instagram.com/fashion2gether_" target="_blank" rel="noreferrer" className="brand-icon-button" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="https://wa.me/919595535339" target="_blank" rel="noreferrer" className="brand-icon-button" aria-label="WhatsApp"><MessageCircle size={16} /></a>
              <a href="tel:+919595535339" className="brand-icon-button" aria-label="Call Fashion 2 Gether"><Phone size={16} /></a>
            </div>
          </motion.div>

          <FooterColumn title="Shop" links={[
            ['New Arrivals', '/shop?filter=new'],
            ['Trending', '/shop?filter=trending'],
            ['Collections', '/shop'],
            ['Sale', '/shop?filter=sale'],
          ]} delay={0.08} />

          <FooterColumn title="Support" links={[
            ['Track Order', '/track-order'],
            ['Contact', '/contact'],
            ['FAQ', '/faq'],
            ['My Account', '/account'],
          ]} delay={0.16} />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.24 }}>
            <p className="brand-section-eyebrow text-[9px] uppercase mb-4">Direct line</p>
            <a href="https://wa.me/919595535339" target="_blank" rel="noreferrer" className="group block border border-white/10 rounded-2xl p-5 bg-white/[.025] hover:bg-white/[.05] transition-colors">
              <p className="text-white/42 text-xs">WhatsApp / Booking</p>
              <div className="flex items-center justify-between mt-2 gap-3">
                <span className="text-lg font-semibold">+91 95955 35339</span>
                <ArrowUpRight size={17} className="text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </a>
            <p className="text-white/32 text-xs leading-relaxed mt-4">Based in Yavatmal, Maharashtra. Shipping available across India.</p>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/28 text-[10px] tracking-wider uppercase">© 2026 Fashion 2 Gether</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/28">
            <Link to="/privacy-policy" className="hover:text-white/60">Privacy</Link>
            <Link to="/terms" className="hover:text-white/60">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-white/60">Shipping</Link>
            <Link to="/return-policy" className="hover:text-white/60">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, delay }: { title: string; links: [string, string][]; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}>
      <p className="brand-section-eyebrow text-[9px] uppercase mb-5">{title}</p>
      <ul className="space-y-3.5">
        {links.map(([name, path]) => (
          <li key={name}>
            <Link to={path} className="text-white/46 text-sm hover:text-white transition-colors">{name}</Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
