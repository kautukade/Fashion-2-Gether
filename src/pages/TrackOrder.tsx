import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    if (!isSupabaseConfigured() || !supabase) {
      setError('Tracking is not available yet. Please contact us on WhatsApp.');
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (err || !data) {
      setError('Order not found. Please check your order number.');
      setLoading(false);
      return;
    }

    // Verify phone matches
    const address = data.shipping_address as any;
    if (address?.phone && address.phone.replace(/\s/g, '') !== phone.replace(/\s/g, '')) {
      setError('Phone number does not match this order.');
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  };

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="font-display text-3xl text-charcoal text-center mb-8">Track Your Order</h1>
        <div className="bg-off-white p-6 sm:p-8 rounded-sm">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Order Number</label>
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. F2G-XXXXX" required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Tracking...' : 'TRACK ORDER'}</button>
          </form>

          {order && (
            <div className="mt-8 pt-6 border-t border-charcoal/10">
              <h3 className="font-medium text-charcoal mb-4">Order #{order.order_number}</h3>
              <div className="space-y-3">
                {statusSteps.map((step, i) => (
                  <div key={step} className={`flex items-center gap-3 ${i <= currentStep ? 'text-charcoal' : 'text-charcoal/30'}`}>
                    <div className={`w-3 h-3 rounded-full ${i <= currentStep ? 'bg-gold' : 'bg-charcoal/20'}`} />
                    <span className="text-sm capitalize">{step.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-charcoal/10">
                <p className="text-sm text-charcoal/60">Status: <span className="font-medium text-charcoal capitalize">{order.status}</span></p>
                <p className="text-sm text-charcoal/60">Total: <span className="font-medium text-charcoal">₹{order.total}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
