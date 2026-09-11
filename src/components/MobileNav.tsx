import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <nav className="bottom-nav lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                isActive ? 'text-gold' : 'text-charcoal/50'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] tracking-wider uppercase">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
