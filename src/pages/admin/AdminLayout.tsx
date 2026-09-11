import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Package, FolderOpen, Layers, ShoppingCart, Users,
  Settings, LogOut, Menu, X, Home, BarChart3, FileText, Shield
} from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, signOut, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderOpen },
    { name: 'Collections', path: '/admin/collections', icon: Layers },
    { name: 'Inventory', path: '/admin/inventory', icon: BarChart3 },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Homepage', path: '/admin/homepage', icon: Home },
    { name: 'Enquiries', path: '/admin/enquiries', icon: FileText },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-charcoal text-white fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-display text-lg tracking-wider">
            F2G <span className="text-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-gold border-r-2 border-gold' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold text-xs font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{user.email}</p>
              <p className="text-[10px] text-white/40">Admin</p>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-72 bg-charcoal text-white z-50 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <span className="font-display text-lg">F2G Admin</span>
                <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
              </div>
              <nav className="py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/" className="text-xs text-gray-500 hover:text-charcoal transition-colors flex items-center gap-1">
              <Home size={14} /> View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
