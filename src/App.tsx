import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import SearchPage from './pages/Search';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className={`min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <ScrollToTop />
        <Navbar />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping-policy" element={<PolicyPage title="Shipping Policy" />} />
            <Route path="/return-policy" element={<PolicyPage title="Return Policy" />} />
            <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" />} />
            <Route path="/terms" element={<PolicyPage title="Terms & Conditions" />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>

        <Footer />
        <MobileNav />
        <WhatsAppButton />
      </div>
    </>
  );
}

// Simple placeholder pages
function AccountPage() {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display text-3xl text-charcoal mb-4">My Account</h1>
        <p className="text-charcoal/50 mb-6">Sign in to view your orders, addresses, and wishlist.</p>
        <button className="btn-primary">SIGN IN</button>
      </div>
    </main>
  );
}

function TrackOrderPage() {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="font-display text-3xl text-charcoal text-center mb-8">Track Your Order</h1>
        <div className="bg-off-white p-6 sm:p-8 rounded-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Order ID</label>
              <input type="text" placeholder="Enter your order ID" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal block mb-2">Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold" />
            </div>
            <button className="btn-primary w-full">TRACK ORDER</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Get In Touch</h1>
          <p className="text-charcoal/50">We'd love to hear from you</p>
        </div>
        <div className="bg-off-white p-6 sm:p-8 rounded-sm">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Your Name" className="px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
            <input type="tel" placeholder="Phone Number" className="px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white" />
          </div>
          <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white mb-4" />
          <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 border border-charcoal/15 rounded-sm text-sm focus:outline-none focus:border-gold bg-white mb-4 resize-none" />
          <button className="btn-primary w-full">SEND MESSAGE</button>
        </div>
      </div>
    </main>
  );
}

function PolicyPage({ title }: { title: string }) {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-8">{title}</h1>
        <div className="prose prose-sm text-charcoal/70 space-y-4">
          <p>At Fashion 2 Gether, we are committed to providing the best shopping experience for our customers. This page outlines our policies regarding {title.toLowerCase()}.</p>
          <h3 className="font-display text-xl text-charcoal mt-8">Key Points</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>We offer All India shipping on all orders</li>
            <li>Free shipping on orders above ₹999</li>
            <li>Orders are processed within 1-2 business days</li>
            <li>Delivery typically takes 5-7 business days</li>
            <li>Easy returns within 7 days of delivery</li>
          </ul>
          <p className="mt-6">For any questions regarding our policies, please contact us at hello@fashion2gether.com or call us at +91 98765 43210.</p>
        </div>
      </div>
    </main>
  );
}

function FAQPage() {
  const faqs = [
    { q: 'What is your return policy?', a: 'We offer a 7-day return policy on all products. Items must be unused with original tags intact.' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for ₹149.' },
    { q: 'Do you ship all over India?', a: 'Yes! We ship to all pin codes across India through our trusted shipping partners.' },
    { q: 'How can I track my order?', a: 'You can track your order using the Track Order page or through the tracking link sent to your phone via SMS.' },
    { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD).' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available for most pin codes. A small COD fee may apply for orders below ₹1999.' },
  ];

  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Frequently Asked Questions</h1>
          <p className="text-charcoal/50">Find answers to common questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-off-white rounded-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-medium text-sm text-charcoal pr-4">{faq.q}</span>
                <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-charcoal/60 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display text-6xl sm:text-8xl text-charcoal/10 mb-4">404</h1>
        <h2 className="font-display text-2xl text-charcoal mb-3">Page Not Found</h2>
        <p className="text-charcoal/50 text-sm mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary">BACK TO HOME</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
