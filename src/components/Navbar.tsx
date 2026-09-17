import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, User, ArrowUpRight } from 'lucide-react';
import { useCartStore } from '../contexts/cartStore';
import { useWishlistStore } from '../contexts/wishlistStore';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Drop', path: '/shop?filter=new' },
    { name: 'Collections', path: '/shop?filter=collections' },
    { name: 'Sale', path: '/shop?filter=sale' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[1100] h-8 brand-announcement text-white overflow-hidden">
        <div className="marquee-container h-full flex items-center">
          <div className="marquee-content">
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ Yavatmal's Most Trending Store</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ All India Shipping</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ Wear better. Look better.</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ WhatsApp +91 95955 35339</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ Yavatmal's Most Trending Store</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ All India Shipping</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase px-8">✦ Wear better. Look better.</span>
          </div>
        </div>
      </div>

      <motion.header
        className={`fixed top-8 left-0 right-0 z-[1050] border-b transition-all duration-500 ${
          isScrolled
            ? 'brand-nav brand-nav-scrolled border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.28)]'
            : 'brand-nav border-white/5'
        }`}
        initial={{ y: -110, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-[70px] lg:h-[78px]">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/85 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navLinks.map((link) => {
                const active = location.pathname === link.path || (link.path === '/shop' && location.pathname === '/shop');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`brand-nav-link relative text-[10px] xl:text-[11px] font-semibold tracking-[0.18em] uppercase ${active ? 'text-white' : 'text-white/65 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:ml-auto lg:mr-auto max-w-[52vw] sm:max-w-none">
              <BrandLogo className="w-[168px] sm:w-[188px] lg:w-[205px]" imageClassName="h-[46px] sm:h-[52px] lg:h-[60px]" priority />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <Link to="/search" className="hidden lg:flex brand-icon-button" aria-label="Search">
                <Search size={18} strokeWidth={1.7} />
              </Link>
              <Link to="/account" className="hidden lg:flex brand-icon-button" aria-label="Account">
                <User size={18} strokeWidth={1.7} />
              </Link>
              <Link to="/wishlist" className="hidden sm:flex brand-icon-button relative" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.7} />
                {wishlistCount > 0 && <span className="brand-count-badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="brand-icon-button relative" aria-label="Shopping bag">
                <ShoppingBag size={18} strokeWidth={1.7} />
                {cartCount > 0 && <span className="brand-count-badge brand-count-badge-blue">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[1200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-[88%] max-w-[390px] z-[1250] brand-mobile-menu overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            >
              <div className="p-5 sm:p-6 min-h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <BrandLogo className="w-[190px]" imageClassName="h-[56px]" priority />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="brand-icon-button" aria-label="Close menu">
                    <X size={21} />
                  </button>
                </div>

                <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 mb-4">Explore</p>
                <nav className="space-y-0.5">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055 + 0.08 }}
                    >
                      <Link
                        to={link.path}
                        className="group flex items-center justify-between py-3.5 text-[25px] sm:text-[28px] font-display text-white/88 hover:text-white border-b border-white/7"
                      >
                        {link.name}
                        <ArrowUpRight size={16} className="text-brand-pink opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="grid grid-cols-3 gap-2 mt-8">
                  <Link to="/search" className="brand-mobile-quick"><Search size={17} /><span>Search</span></Link>
                  <Link to="/wishlist" className="brand-mobile-quick"><Heart size={17} /><span>Wishlist</span></Link>
                  <Link to="/account" className="brand-mobile-quick"><User size={17} /><span>Account</span></Link>
                </div>

                <div className="mt-auto pt-10">
                  <p className="font-elegant italic text-xl text-white/60 mb-4">Wear better. Look better.</p>
                  <div className="flex gap-5 text-xs tracking-wider">
                    <a href="https://instagram.com/fashion2gether_" target="_blank" rel="noreferrer" className="text-white/55 hover:text-white">Instagram</a>
                    <a href="https://wa.me/919595535339" target="_blank" rel="noreferrer" className="text-white/55 hover:text-white">WhatsApp</a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
