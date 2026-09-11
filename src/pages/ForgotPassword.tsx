import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) setError(error);
    else setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal mb-2">Reset Password</h1>
          <p className="text-charcoal/50 text-sm">Enter your email to receive a reset link</p>
        </div>
        {success ? (
          <div className="bg-off-white p-6 sm:p-8 rounded-sm text-center">
            <p className="text-green-700 mb-4">Password reset link sent to your email!</p>
            <Link to="/login" className="text-gold hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-off-white p-6 sm:p-8 rounded-sm space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}
            <div>
              <label className="text-xs font-semibold tracking-wider uppercase text-charcoal block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'SEND RESET LINK'}</button>
            <p className="text-center text-sm text-charcoal/50">
              <Link to="/login" className="text-gold hover:underline">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
