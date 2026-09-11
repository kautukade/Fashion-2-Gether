import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-white tracking-wider mb-2">
            FASHION <span className="text-gradient-gold">2</span> GETHER
          </h1>
          <p className="text-white/50 text-sm">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-sm p-8">
          <h2 className="text-white text-lg font-medium mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 tracking-wider uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-gold/50"
                placeholder="admin@fashion2gether.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-white/50 tracking-wider uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-gold/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-gold text-charcoal font-semibold text-sm tracking-wider uppercase rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>

          <p className="text-white/30 text-xs text-center mt-6">
            Authorized personnel only. All actions are logged.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
