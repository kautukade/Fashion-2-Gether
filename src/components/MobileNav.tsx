import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useCartStore } from '../contexts/cartStore';
import { useWishlistStore } from '../contexts/wishlistStore';

export default function MobileNav() {
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());

  const navItems = [
    { name: 'Home', path: '/', icon: Home, count: 0 },
    { name: 'Shop', path: '/shop', icon: ShoppingBag, count: cartCount },
    { name: 'Search', path: '/search', icon: Search, count: 0 },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, count: wishlistCount },
    { name: 'Account', path: '/account', icon: User, count: 0 },
  ];

  return (
    <nav className="bottom-nav lg:hidden">
      <div className="flex items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative min-w-[58px] flex flex-col items-center gap-1 py-1.5 px-2 transition-all ${isActive ? 'text-gold' : 'text-white/45'}`}
            >
              <span className={`relative w-9 h-7 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-gold/12 shadow-[0_0_24px_rgba(255,10,136,.12)]' : ''}`}>
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                {item.count > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[14px] h-[14px] px-1 rounded-full bg-blue-500 text-white text-[7px] font-bold flex items-center justify-center border border-[#08080d]">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </span>
              <span className="text-[8px] tracking-[0.12em] uppercase">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
