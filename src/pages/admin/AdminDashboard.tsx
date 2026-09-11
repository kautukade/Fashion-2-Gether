import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Package, AlertTriangle, XCircle, ShoppingCart, Users, FileText, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0, activeProducts: 0, totalOrders: 0, pendingOrders: 0,
    totalCustomers: 0, lowStock: 0, outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Products', value: stats.activeProducts, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: XCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingCart, color: 'text-orange-600 bg-orange-50' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white rounded-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.color}`}>
                <card.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-charcoal">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-charcoal mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="/admin/products/new" className="btn-primary text-xs py-3">+ Add Product</a>
          <a href="/admin/categories" className="btn-outline text-xs py-3">Manage Categories</a>
          <a href="/admin/inventory" className="btn-outline text-xs py-3">View Inventory</a>
        </div>
      </div>
    </div>
  );
}
