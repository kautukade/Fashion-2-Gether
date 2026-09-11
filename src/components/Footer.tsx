import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl tracking-[0.08em] mb-4">
              FASHION <span className="text-gradient-gold">2</span> GETHER
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Yavatmal's most trending fashion destination. Premium styles, All India shipping, and a commitment to making you look and feel your best.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
                <Facebook size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:bg-green-600 hover:border-green-600 transition-all">
                <Phone size={15} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'New Arrivals', path: '/shop?filter=new' },
                { name: 'Best Sellers', path: '/shop?filter=bestsellers' },
                { name: 'Sale', path: '/shop?filter=sale' },
                { name: 'Collections', path: '/shop' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'About Us', path: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/50 text-sm hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-gold">Customer Care</h4>
            <ul className="space-y-3">
              {[
                { name: 'Shipping Policy', path: '/shipping-policy' },
                { name: 'Return Policy', path: '/return-policy' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms & Conditions', path: '/terms' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/50 text-sm hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 text-gold">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold/70 mt-0.5 flex-shrink-0" />
                <p className="text-white/50 text-sm">Main Road, Yavatmal,<br />Maharashtra 445001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gold/70 flex-shrink-0" />
                <p className="text-white/50 text-sm">+91 95955 35339</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gold/70 flex-shrink-0" />
                <p className="text-white/50 text-sm">hello@fashion2gether.com</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-white/30 text-xs mb-3">We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {['UPI', 'Cards', 'Net Banking', 'COD'].map((method) => (
                  <span key={method} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/50">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © 2025 Fashion 2 Gether. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with ♥ in Yavatmal
          </p>
        </div>
      </div>
    </footer>
  );
}
