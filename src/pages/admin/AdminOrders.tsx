import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) { setLoading(false); return; }
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Orders ({orders.length})</h1>
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-charcoal">{order.order_number}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{order.payment_status}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal">₹{order.total}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders yet</div>}
      </div>
    </div>
  );
}
