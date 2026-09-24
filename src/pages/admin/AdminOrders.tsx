import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { demoStore } from '../../lib/demoStore';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setOrders([...demoStore.getOrders()].reverse());
      setLoading(false);
      return;
    }
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      const next = demoStore.getOrders().map(o => o.id === id ? { ...o, status } : o);
      demoStore.setOrders(next);
      setOrders([...next].reverse());
      return;
    }
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display text-charcoal">Orders ({orders.length})</h1>
        {!isSupabaseConfigured() && <p className="text-xs text-amber-600 mt-1">Demo orders created through checkout appear here.</p>}
      </div>
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id || order.order_number} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-charcoal">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      className="px-2 py-1 border border-gray-200 rounded text-xs bg-white">
                      {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{order.payment_status || 'COD'}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal">₹{order.total}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders yet — place a demo order from the storefront checkout.</div>}
      </div>
    </div>
  );
}
