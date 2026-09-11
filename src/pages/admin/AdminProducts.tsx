import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Plus, Search, Archive, CheckCircle } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getAllProductsAdmin().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleArchive = async (id: string) => {
    if (confirm('Archive this product?')) {
      await adminService.deleteProduct(id);
      setProducts(products.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    }
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    await adminService.updateProduct(id, { status: newStatus });
    setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display text-charcoal">Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary text-xs py-2.5 flex items-center gap-2">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/products/${product.id}`} className="font-medium text-charcoal hover:text-gold">
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-400">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">₹{product.selling_price}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-50 text-green-700' :
                      product.status === 'draft' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleToggle(product.id, product.status)} className="text-xs text-blue-600 hover:underline">
                        {product.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleArchive(product.id)} className="text-xs text-red-600 hover:underline">
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No products found</p>
            <Link to="/admin/products/new" className="text-gold text-sm hover:underline mt-2 inline-block">Create your first product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
