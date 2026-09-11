import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Account() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl text-charcoal">My Account</h1>
            <button onClick={signOut} className="text-sm text-charcoal/60 hover:text-charcoal">Sign Out</button>
          </div>
          
          <div className="bg-off-white p-6 rounded-sm mb-6">
            <h2 className="font-medium text-charcoal mb-2">Account Information</h2>
            <p className="text-sm text-charcoal/60">{user.email}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/account/orders" className="bg-white p-6 border border-charcoal/10 rounded-sm hover:border-gold transition-colors">
              <h3 className="font-medium text-charcoal mb-1">My Orders</h3>
              <p className="text-sm text-charcoal/50">View and track your orders</p>
            </Link>
            <Link to="/wishlist" className="bg-white p-6 border border-charcoal/10 rounded-sm hover:border-gold transition-colors">
              <h3 className="font-medium text-charcoal mb-1">Wishlist</h3>
              <p className="text-sm text-charcoal/50">Your saved items</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
