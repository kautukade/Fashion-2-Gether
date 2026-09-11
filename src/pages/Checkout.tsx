import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Truck, CreditCard, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const [step, setStep] = useState(1);

  const steps = [
    { num: 1, label: 'Contact', icon: Lock },
    { num: 2, label: 'Address', icon: Truck },
    { num: 3, label: 'Payment', icon: CreditCard },
  ];

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">Checkout</h1>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all ${
                step >= s.num ? 'bg-charcoal text-white' : 'bg-charcoal/5 text-charcoal/40'
              }`}>
                <s.icon size={14} />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.num}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-[1px] ${step > s.num ? 'bg-charcoal' : 'bg-charcoal/15'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-charcoal/5 rounded-sm p-6 sm:p-8"
            >
              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Email</label>
                      <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Phone Number</label>
                      <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="offers" className="w-4 h-4 accent-gold" />
                      <label htmlFor="offers" className="text-sm text-charcoal/60">Send me offers and updates via WhatsApp</label>
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
                        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">First Name</label>
                        <input type="text" placeholder="First name" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Last Name</label>
                        <input type="text" placeholder="Last name" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Address</label>
                      <input type="text" placeholder="House/Flat no., Street, Area" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">City</label>
                        <input type="text" placeholder="City" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">State</label>
                        <input type="text" placeholder="State" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Pincode</label>
                        <input type="text" placeholder="Pincode" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Landmark (Optional)</label>
                      <input type="text" placeholder="Near..." className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
                      { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                      { id: 'nb', label: 'Net Banking', icon: '🏦' },
                      { id: 'cod', label: 'Cash on Delivery (+₹49)', icon: '💵' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-4 p-4 border border-charcoal/10 rounded-sm cursor-pointer hover:border-gold transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-gold" />
                        <span className="text-lg">{method.icon}</span>
                        <span className="text-sm text-charcoal">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-charcoal/10">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="btn-outline text-xs py-3 px-5">
                    ← BACK
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="btn-primary text-xs">
                    CONTINUE →
                  </button>
                ) : (
                  <button className="btn-primary bg-green-700 hover:bg-green-800 text-xs">
                    <Check size={14} className="mr-2" /> PLACE ORDER
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-off-white p-6 rounded-sm">
              <h3 className="font-display text-lg text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex gap-3 pb-3 border-b border-charcoal/10">
                  <div className="w-14 h-18 bg-cream-dark rounded-sm overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=130&fit=crop" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-charcoal line-clamp-2">Oversized Silk Blend Shirt</p>
                    <p className="text-[10px] text-charcoal/50 mt-0.5">Black / M × 1</p>
                    <p className="text-xs font-semibold text-charcoal mt-1">₹1,899</p>
                  </div>
                </div>
                <div className="flex gap-3 pb-3 border-b border-charcoal/10">
                  <div className="w-14 h-18 bg-cream-dark rounded-sm overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=100&h=130&fit=crop" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-charcoal line-clamp-2">Structured Blazer Dress</p>
                    <p className="text-[10px] text-charcoal/50 mt-0.5">Black / S × 2</p>
                    <p className="text-xs font-semibold text-charcoal mt-1">₹5,598</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-charcoal/60">
                  <span>Subtotal</span>
                  <span>₹7,497</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Shipping</span>
                  <span className="text-green-700">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-charcoal/10 font-semibold text-charcoal">
                  <span>Total</span>
                  <span>₹7,497</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-charcoal/40">
                <Lock size={10} />
                <span>Secure checkout powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
