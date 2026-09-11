import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../contexts/cartStore';
import { useWishlistStore } from '../contexts/wishlistStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Collections', path: '/shop?filter=collections' },
    { name: 'Sale', path: '/shop?filter=sale' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-charcoal text-white py-2.5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ Free Shipping Above ₹999</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ New Season Drop Live Now</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ All India Shipping Available</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ Use Code: WELCOME10 for 10% Off</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ Free Shipping Above ₹999</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ New Season Drop Live Now</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ All India Shipping Available</span>
            <span className="text-xs tracking-[0.2em] uppercase px-8">✦ Use Code: WELCOME10 for 10% Off</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        className={`fixed top-[38px] left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled ? 'glass shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
            >
              <Menu size={22} />
            </button>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-charcoal/80 hover:text-charcoal transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
              <h1 className="font-display text-xl sm:text-2xl lg:text-2xl font-semibold tracking-[0.08em] text-charcoal">
                FASHION <span className="text-gradient-gold">2</span> GETHER
              </h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              <Link to="/search" className="hidden sm:block p-2 text-charcoal/70 hover:text-charcoal transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </Link>
              <Link to="/account" className="hidden sm:block p-2 text-charcoal/70 hover:text-charcoal transition-colors">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link to="/wishlist" className="p-2 text-charcoal/70 hover:text-charcoal transition-colors relative">
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-burgundy text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-2 text-charcoal/70 hover:text-charcoal transition-colors relative">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[1100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[380px] bg-cream z-[1200] overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="font-display text-lg tracking-wider">MENU</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-charcoal hover:text-gold transition-colors">
                    <X size={22} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className="block py-3 text-lg font-display tracking-wide text-charcoal/80 hover:text-charcoal hover:pl-2 transition-all duration-300"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-10 pt-8 border-t border-charcoal/10">
                  <div className="space-y-4">
                    <Link to="/account" className="flex items-center gap-3 text-sm text-charcoal/70 hover:text-charcoal">
                      <User size={16} /> My Account
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 text-sm text-charcoal/70 hover:text-charcoal">
                      <Heart size={16} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                    </Link>
                    <Link to="/search" className="flex items-center gap-3 text-sm text-charcoal/70 hover:text-charcoal">
                      <Search size={16} /> Search
                    </Link>
                    <Link to="/admin" className="flex items-center gap-3 text-sm text-charcoal/40 hover:text-charcoal/60 mt-4 pt-4 border-t border-charcoal/5">
                      Admin Panel
                    </Link>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-charcoal/10">
                  <p className="text-xs text-charcoal/50 tracking-wider uppercase mb-3">Follow Us</p>
                  <div className="flex gap-4">
                    <a href="https://instagram.com/fashion2gether" className="text-charcoal/60 hover:text-gold transition-colors text-sm">Instagram</a>
                    <a href="https://wa.me/919595535339" className="text-charcoal/60 hover:text-gold transition-colors text-sm">WhatsApp</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
