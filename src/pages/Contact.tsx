import { useState } from 'react';
import { adminService } from '../services/adminService';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await adminService.submitEnquiry(form);
    if (err) setError(err);
    else {
      setSuccess(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Get In Touch</h1>
          <p className="text-charcoal/50">We'd love to hear from you</p>
        </div>
        {success ? (
          <div className="bg-off-white p-8 rounded-sm text-center">
            <p className="text-green-700 text-lg mb-2">Message sent successfully!</p>
            <p className="text-charcoal/60 text-sm">We'll get back to you soon.</p>
            <button onClick={() => setSuccess(false)} className="mt-4 text-gold text-sm hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-off-white p-6 sm:p-8 rounded-sm">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
              <input type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required className="px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
            </div>
            <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white mb-4" />
            <textarea placeholder="Your Message *" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required rows={5} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white mb-4 resize-none" />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'SEND MESSAGE'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
