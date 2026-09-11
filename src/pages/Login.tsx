import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    else navigate('/account');
    setLoading(false);
  };

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <motion.div className="w-full max-w-md px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal mb-2">Welcome Back</h1>
          <p className="text-charcoal/50 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-off-white p-6 sm:p-8 rounded-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-gold hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'SIGN IN'}</button>
          <p className="text-center text-sm text-charcoal/50">
            Don't have an account? <Link to="/register" className="text-gold hover:underline">Sign Up</Link>
          </p>
        </form>
      </motion.div>
    </main>
  );
}
