import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Truck, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../contexts/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal());
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: user?.email || '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    paymentMethod: 'cod',
  });

  const subtotal = getSubtotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={48} className="text-charcoal/20 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-charcoal mb-2">Your bag is empty</h1>
          <Link to="/shop" className="btn-primary mt-4">START SHOPPING</Link>
        </div>
      </main>
    );
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.email || !form.phone) { setError('Please fill in email and phone'); return false; }
    }
    if (step === 2) {
      if (!form.firstName || !form.lastName || !form.address || !form.city || !form.state || !form.pincode) {
        setError('Please fill in all required address fields'); return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep(step + 1);
  };

  const generateOrderNumber = () => {
    const prefix = 'F2G';
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${random}`;
  };

  const placeOrder = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError('');

    const orderNumber = generateOrderNumber();

    // If Supabase is not configured, create a local order
    if (!isSupabaseConfigured() || !supabase) {
      // Store order locally
      const orders = JSON.parse(localStorage.getItem('f2g-orders') || '[]');
      orders.push({
        order_number: orderNumber,
        status: 'pending',
        total,
        subtotal,
        shipping_cost: shipping,
        items: items.map(i => ({ name: i.name, size: i.size, color: i.color, quantity: i.quantity, price: i.price })),
        shipping_address: { ...form },
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('f2g-orders', JSON.stringify(orders));
      clearCart();
      navigate(`/order-success/${orderNumber}`);
      return;
    }

    try {
      // Create customer if not exists
      let customerId = '';
      if (user) {
        const { data: customer } = await supabase.from('customers').select('id').eq('user_id', user.id).single();
        if (customer) customerId = customer.id;
        else {
          const { data: newCustomer } = await supabase.from('customers').insert({
            user_id: user.id,
            email: form.email,
            phone: form.phone,
            first_name: form.firstName,
            last_name: form.lastName,
          }).select().single();
          customerId = newCustomer?.id || '';
        }
      } else {
        // Guest checkout - create a temporary customer
        const userId = (user as any)?.id || '00000000-0000-0000-0000-000000000000';
        const result = await supabase.from('customers').insert({
          user_id: userId,
          email: form.email,
          phone: form.phone,
          first_name: form.firstName,
          last_name: form.lastName,
        }).select().single();
        const newCustomer = result.data as any;
        customerId = newCustomer?.id || '';
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: 'pending',
        subtotal,
        shipping_cost: shipping,
        discount: 0,
        total,
        payment_status: 'pending',
        payment_method: form.paymentMethod,
        shipping_address: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          landmark: form.landmark,
        },
      }).select().single();

      if (orderError) throw new Error(orderError.message);
      const order = orderData as any;

      // Create order items
      for (const item of items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
        });

        // Decrease inventory
        await supabase.rpc('decrement_stock', { variant_id_param: item.variantId, quantity_param: item.quantity });
      }

      clearCart();
      navigate(`/order-success/${orderNumber}`);
    } catch (e: any) {
      setError(e.message || 'Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const steps = [
    { num: 1, label: 'Contact' },
    { num: 2, label: 'Address' },
    { num: 3, label: 'Payment' },
  ];

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">Checkout</h1>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all ${
                step >= s.num ? 'bg-charcoal text-white' : 'bg-charcoal/5 text-charcoal/40'
              }`}>
                <span>{s.num}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-[1px] ${step > s.num ? 'bg-charcoal' : 'bg-charcoal/15'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-charcoal/5 rounded-sm p-6 sm:p-8">
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Phone *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+91" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Delivery Address</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">First Name *</label>
                        <input type="text" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Last Name *</label>
                        <input type="text" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Address *</label>
                      <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} placeholder="House/Flat no., Street, Area" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">City *</label>
                        <input type="text" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">State *</label>
                        <input type="text" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Pincode *</label>
                        <input type="text" value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Landmark (Optional)</label>
                      <input type="text" value={form.landmark} onChange={(e) => setForm({...form, landmark: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${form.paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-charcoal/10 hover:border-gold'}`}>
                      <input type="radio" name="payment" checked={form.paymentMethod === 'cod'} onChange={() => setForm({...form, paymentMethod: 'cod'})} className="w-4 h-4 accent-gold" />
                      <span className="text-lg">💵</span>
                      <div>
                        <span className="text-sm font-medium text-charcoal">Cash on Delivery</span>
                        <p className="text-xs text-charcoal/50">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-charcoal/10 rounded-sm opacity-50 cursor-not-allowed">
                      <input type="radio" name="payment" disabled className="w-4 h-4" />
                      <span className="text-lg">📱</span>
                      <div>
                        <span className="text-sm font-medium text-charcoal">Online Payment (UPI/Card)</span>
                        <p className="text-xs text-charcoal/50">Coming Soon</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-charcoal/10">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="btn-outline text-xs py-3 px-5">← BACK</button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={handleNext} className="btn-primary text-xs">CONTINUE →</button>
                ) : (
                  <button onClick={placeOrder} disabled={loading} className="btn-primary bg-green-700 hover:bg-green-800 text-xs disabled:opacity-50">
                    <Check size={14} className="mr-2" /> {loading ? 'Placing Order...' : 'PLACE ORDER'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-off-white p-6 rounded-sm">
              <h3 className="font-display text-lg text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-charcoal/10">
                    <div className="w-14 h-18 bg-cream-dark rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-charcoal line-clamp-2">{item.name}</p>
                      <p className="text-[10px] text-charcoal/50 mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
                      <p className="text-xs font-semibold text-charcoal mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-charcoal/60"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-charcoal/60"><span>Shipping</span><span className={shipping === 0 ? 'text-green-700' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between pt-2 border-t border-charcoal/10 font-semibold text-charcoal"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-charcoal/40">
                <Lock size={10} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
