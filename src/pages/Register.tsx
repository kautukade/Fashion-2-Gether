import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: name, phone });
    if (error) setError(error);
    else navigate('/account');
    setLoading(false);
  };

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal mb-2">Create Account</h1>
          <p className="text-charcoal/50 text-sm">Join the Fashion 2 Gether family</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-off-white p-6 sm:p-8 rounded-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'CREATE ACCOUNT'}</button>
          <p className="text-center text-sm text-charcoal/50">
            Already have an account? <Link to="/login" className="text-gold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
