import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<any>(null);
  const [adjustment, setAdjustment] = useState({ amount: 0, reason: '' });
  const { user } = useAuth();

  useEffect(() => { load(); }, []);
  const load = () => { adminService.getInventoryList().then(i => { setInventory(i); setLoading(false); }); };

  const getStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'bg-red-50 text-red-700' };
    if (stock <= threshold) return { text: 'Low Stock', class: 'bg-yellow-50 text-yellow-700' };
    return { text: 'In Stock', class: 'bg-green-50 text-green-700' };
  };

  const handleAdjust = async () => {
    if (!adjusting || !adjustment.reason) return;
    await adminService.adjustInventory(adjusting.id, adjustment.amount, adjustment.reason, user?.id || '');
    setAdjusting(null);
    setAdjustment({ amount: 0, reason: '' });
    load();
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 8}).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Inventory Management</h1>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Color</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Size</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((item: any) => {
                const status = getStatus(item.stock_quantity, item.low_stock_threshold);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-charcoal">{item.products?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.color}</td>
                    <td className="px-4 py-3 text-gray-600">{item.size}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{item.stock_quantity}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded text-xs ${status.class}`}>{status.text}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setAdjusting(item)} className="text-xs text-gold hover:underline">Adjust</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {inventory.length === 0 && <div className="text-center py-12 text-gray-400">No inventory items</div>}
      </div>

      {adjusting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-charcoal mb-2">Adjust Inventory</h2>
            <p className="text-sm text-gray-500 mb-4">{adjusting.products?.name} - {adjusting.color} / {adjusting.size}</p>
            <p className="text-sm text-gray-600 mb-4">Current stock: <span className="font-semibold">{adjusting.stock_quantity}</span></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Adjustment (+ to add, - to remove)</label>
                <input type="number" value={adjustment.amount} onChange={e => setAdjustment({...adjustment, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Reason *</label>
                <input type="text" value={adjustment.reason} onChange={e => setAdjustment({...adjustment, reason: e.target.value})} placeholder="e.g. Restock, Damaged, Sold" className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdjusting(null)} className="btn-outline flex-1 text-xs py-2.5">Cancel</button>
              <button onClick={handleAdjust} disabled={!adjustment.reason} className="btn-primary flex-1 text-xs py-2.5 disabled:opacity-50">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
