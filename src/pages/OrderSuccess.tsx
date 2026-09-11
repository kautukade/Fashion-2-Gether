import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const { orderNumber } = useParams();

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-md mx-auto px-4 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-charcoal mb-4">Order Placed Successfully!</h1>
        <p className="text-charcoal/60 mb-2">Thank you for your order.</p>
        <p className="text-charcoal font-medium mb-8">Order #{orderNumber}</p>
        
        <div className="bg-off-white p-6 rounded-sm mb-6 text-left">
          <h3 className="font-medium text-charcoal mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-charcoal/60">
            <li>• You'll receive a confirmation on WhatsApp</li>
            <li>• We'll process your order within 1-2 business days</li>
            <li>• Track your order using the Track Order page</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/track-order" className="btn-outline flex-1">TRACK ORDER</Link>
          <Link to="/shop" className="btn-primary flex-1">CONTINUE SHOPPING</Link>
        </div>
      </motion.div>
    </main>
  );
}
