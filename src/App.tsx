import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Account from './pages/Account';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function StorefrontLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/account" element={<Account />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
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

function PolicyPage({ title }: { title: string }) {
  return (
    <main className="page-transition pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-8">{title}</h1>
        <div className="prose prose-sm text-charcoal/70 space-y-4">
          <p>At Fashion 2 Gether, we are committed to providing the best shopping experience. This page outlines our policies regarding {title.toLowerCase()}.</p>
          <p className="mt-6">For any questions, please contact us via WhatsApp at +91 95955 35339.</p>
        </div>
      </div>
    </main>
  );
}

function FAQPage() {
  const faqs = [
    { q: 'How can I track my order?', a: 'You can track your order using the Track Order page with your order number and phone number.' },
    { q: 'Do you ship all over India?', a: 'Yes! We ship to all pin codes across India through our trusted shipping partners.' },
    { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD).' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available for most pin codes.' },
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
              <div className="px-5 pb-5 text-sm text-charcoal/60 leading-relaxed">{faq.a}</div>
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
        <p className="text-charcoal/50 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">BACK TO HOME</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes - separate layout, no storefront chrome */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* All storefront routes */}
          <Route path="/*" element={<StorefrontLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
