import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, Truck, Tag } from 'lucide-react';
import { products } from '../data/products';

interface CartItem {
  product: typeof products[0];
  size: string;
  color: string;
  quantity: number;
}

export default function Cart() {
  const [cartItems] = useState<CartItem[]>([
    { product: products[0], size: 'M', color: 'Black', quantity: 1 },
    { product: products[2], size: 'S', color: 'Black', quantity: 2 },
  ]);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={48} className="text-charcoal/20 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-charcoal mb-2">Your bag is empty</h1>
          <p className="text-charcoal/50 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">START SHOPPING</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 lg:pb-10 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">Shopping Bag</h1>
          <p className="text-charcoal/50 text-sm mt-1">{cartItems.length} items</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-charcoal/5 rounded-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Image */}
                <Link to={`/product/${item.product.slug}`} className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="font-medium text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-charcoal/50">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-charcoal/15 rounded-sm">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/5 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/5 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right">
                      <p className="font-semibold text-charcoal">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-charcoal/40">₹{item.product.price.toLocaleString()} each</p>
                      )}
                      <button className="text-xs text-charcoal/40 hover:text-red-500 transition-colors mt-1 flex items-center gap-1 ml-auto">
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-off-white p-6 sm:p-8 rounded-sm">
              <h2 className="font-display text-xl text-charcoal mb-6">Order Summary</h2>

              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-2">
                    <Truck size={14} className="text-gold" />
                    <span>Add ₹{remainingForFreeShipping.toLocaleString()} more for FREE shipping</span>
                  </div>
                  <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-sm">
                  <Truck size={14} />
                  <span className="font-medium">You've unlocked FREE shipping!</span>
                </div>
              )}

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-charcoal text-white text-xs font-medium tracking-wider uppercase rounded-sm hover:bg-charcoal-light transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-charcoal/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span className="text-charcoal">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-700' : 'text-charcoal'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-charcoal/10">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-semibold text-lg text-charcoal">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="btn-primary w-full mt-6 block text-center">
                PROCEED TO CHECKOUT
              </Link>

              {/* Continue Shopping */}
              <Link to="/shop" className="block text-center text-xs text-charcoal/50 hover:text-charcoal mt-4 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
