import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { demoStore } from '../../lib/demoStore';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setCustomers([...demoStore.getCustomers()].reverse());
      setLoading(false);
      return;
    }
    supabase.from('customers').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setCustomers(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Customers ({customers.length})</h1>
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-charcoal">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && <div className="text-center py-12 text-gray-400">No customers yet — a demo checkout will create one.</div>}
      </div>
    </div>
  );
}
