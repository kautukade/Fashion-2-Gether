# Fashion 2 Gether - Premium E-Commerce Platform

A production-ready, full-stack e-commerce platform built with React, TypeScript, Supabase, and Three.js. Features real-time inventory management, secure checkout with Edge Functions, and a comprehensive admin dashboard.

**Live Demo**: https://fashiontogether.netlify.app/

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Edge Functions](#edge-functions)
- [Storage Setup](#storage-setup)
- [Admin Setup](#admin-setup)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## 🎯 Overview

Fashion 2 Gether is a premium fashion e-commerce platform designed for the Indian market. It provides:

- **Customer-facing storefront** with cinematic UI, 3D animations, and mobile-first design
- **Admin dashboard** for complete product, inventory, and order management
- **Secure checkout** with server-side price validation and atomic inventory updates
- **Real-time inventory** with variant-level stock tracking
- **Guest checkout** support without requiring account creation
- **Order tracking** with phone number verification

The platform is built to handle real production traffic with proper security, scalability, and performance considerations.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router v6** - Client-side routing
- **Three.js / React Three Fiber** - 3D graphics
- **Zustand** - State management (cart, wishlist)
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Edge Functions (Deno)
  - Row Level Security (RLS)

### Deployment
- **Netlify** - Frontend hosting with SPA routing
- **Supabase** - Backend hosting

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm
- **Git**
- **Supabase account** (free tier works)
- **Netlify account** (for deployment)
- **Code editor** (VS Code recommended)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kautukade/Fashion-2-Gether.git
cd Fashion-2-Gether
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon public key** from Settings → API

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: Service Role Key (for Edge Functions only)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **Important**: 
- Never commit `.env` to git
- The anon key is safe to expose in frontend
- The service role key must NEVER be exposed to the browser

---

## 🗄️ Database Setup

### Run Migrations

The database schema is defined in SQL migration files. Run them **in order**:

```bash
# Connect to your Supabase SQL Editor and run:

# 1. Initial schema (tables, indexes, triggers)
supabase/migrations/001_initial_schema.sql

# 2. Phase 2 completion (functions, storage policies)
supabase/migrations/002_phase2_completion.sql

# 3. Production checkout (secure order creation)
supabase/migrations/003_production_checkout.sql

# 4. Storage policies (bucket permissions)
supabase/migrations/004_storage_policies.sql

# 5. Critical fixes (RLS policies, Edge Function grants)
supabase/migrations/005_critical_production_fixes.sql
```

### Migration Details

#### 001_initial_schema.sql
Creates core tables:
- `profiles` - User profiles
- `admin_users` - Admin accounts
- `categories` - Product categories
- `collections` - Product collections
- `products` - Product catalog
- `product_variants` - Size/color variants with stock
- `product_media` - Images and videos
- `inventory_transactions` - Stock change history
- `carts` / `cart_items` - Shopping cart
- `wishlists` / `wishlist_items` - Customer wishlists
- `customers` / `addresses` - Customer data
- `orders` / `order_items` - Order management
- `homepage_sections` - CMS for homepage
- `banners` - Promotional banners
- `site_settings` - Configurable settings
- `audit_logs` - Admin action tracking
- `contact_enquiries` - Contact form submissions

#### 002_phase2_completion.sql
- Creates `decrement_stock()` function for atomic inventory updates
- Creates `generate_order_number()` function
- Adds performance indexes

#### 003_production_checkout.sql
- Creates `create_secure_order()` function (server-side order creation)
- Creates `track_order_by_phone()` function (secure order tracking)
- Adds guest checkout support
- Creates `order_status_history` table

#### 004_storage_policies.sql
- Defines storage bucket policies for:
  - `product-images` (public read, admin write)
  - `product-videos` (public read, admin write)
  - `brand-assets` (public read, admin write)
  - `banners` (public read, admin write)
  - `reels` (public read, admin write)
  - `review-images` (public read, authenticated write)
  - `return-evidence` (private, admin only)

#### 005_critical_production_fixes.sql
- Fixes RLS policies for correct customer ownership
- Grants Edge Functions access to secure RPCs
- Creates storage buckets automatically
- Adds performance indexes

---

## ⚡ Edge Functions

Edge Functions handle sensitive operations server-side using the service role key.

### Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy Edge Functions
supabase functions deploy create-order
supabase functions deploy track-order
```

### Edge Function Details

#### create-order
**Purpose**: Securely create orders with server-side validation

**Input**:
```typescript
{
  items: Array<{ variant_id: string, quantity: number }>,
  shipping_address: {
    first_name: string,
    last_name: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    landmark?: string
  },
  payment_method: 'cod' | 'online',
  guest_email?: string,
  guest_phone?: string
}
```

**Process**:
1. Validates all input
2. Maps auth user to customer record (or creates guest customer)
3. Calls `create_secure_order()` RPC internally
4. RPC validates stock, calculates prices server-side
5. Creates order atomically with row locking
6. Decrements inventory
7. Logs inventory transaction
8. Returns order number

**Security**:
- Never trusts frontend prices
- Validates stock availability
- Prevents race conditions
- Uses service role key (not exposed to browser)

#### track-order
**Purpose**: Securely track orders with phone verification

**Input**:
```typescript
{
  order_number: string,
  phone: string
}
```

**Process**:
1. Validates input
2. Calls `track_order_by_phone()` RPC
3. Returns only necessary order data (no sensitive info)

**Security**:
- Requires both order number AND phone
- Never exposes customer IDs or admin notes
- Rate-limited by design

---

## 📁 Storage Setup

### Create Storage Buckets

Migration 005 creates buckets automatically, but you can verify in Supabase Dashboard → Storage:

Required buckets:
- `product-images` (public)
- `product-videos` (public)
- `brand-assets` (public)
- `banners` (public)
- `reels` (public)
- `review-images` (public)
- `return-evidence` (private)

### Storage Policies

Policies are defined in migration 004:
- **Public buckets**: Anyone can read, only admins can write
- **Review images**: Anyone can read, authenticated users can upload
- **Return evidence**: Admin only

### File Upload Limits

Configure in Supabase Dashboard → Storage → Bucket settings:
- Images: 5MB max
- Videos: 50MB max
- Allowed types: JPEG, PNG, WebP, MP4, WebM

---

## 👤 Admin Setup

### Create First SUPER_ADMIN

1. **Create a Supabase user** via Dashboard → Authentication → Users
   - Email: `admin@fashion2gether.com`
   - Password: (choose strong password)

2. **Add to admin_users table** via SQL Editor:

```sql
INSERT INTO admin_users (user_id, role, is_active)
SELECT id, 'SUPER_ADMIN', true
FROM auth.users
WHERE email = 'admin@fashion2gether.com';
```

3. **Verify admin access**:
   - Go to https://fashiontogether.netlify.app/admin/login
   - Login with your admin credentials
   - You should see the admin dashboard

### Admin Roles

The system supports multiple roles (only SUPER_ADMIN is fully implemented):
- `SUPER_ADMIN` - Full access
- `ORDER_MANAGER` - Orders only
- `INVENTORY_MANAGER` - Inventory only
- `CONTENT_MANAGER` - CMS only
- `SUPPORT` - Customer support

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## 📂 Project Structure

```
Fashion-2-Gether/
├── public/
│   ├── _redirects              # Netlify SPA routing
│   └── videos/                 # Hero video files (optional)
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Fashion3DSection.tsx  # 3D hero section
│   │   │   └── Scene3D.tsx           # Three.js scene
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx                  # Hero with video support
│   │   ├── LoadingScreen.tsx         # Cinematic loader
│   │   ├── MobileNav.tsx             # Mobile bottom nav
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx           # Product card component
│   │   ├── Sections.tsx              # Homepage sections
│   │   └── WhatsAppButton.tsx        # Floating WhatsApp
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Supabase auth context
│   │   ├── cartStore.ts              # Zustand cart store
│   │   └── wishlistStore.ts          # Zustand wishlist store
│   ├── data/
│   │   └── products.ts               # Demo data (fallback)
│   ├── lib/
│   │   └── supabase.ts               # Supabase client
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAuditLogs.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminCollections.tsx
│   │   │   ├── AdminCustomers.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminEnquiries.tsx
│   │   │   ├── AdminHomepage.tsx
│   │   │   ├── AdminInventory.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminProductForm.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   └── AdminSettings.tsx
│   │   ├── About.tsx
│   │   ├── Account.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Contact.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Register.tsx
│   │   ├── Search.tsx
│   │   ├── Shop.tsx
│   │   ├── TrackOrder.tsx
│   │   └── Wishlist.tsx
│   ├── services/
│   │   ├── adminService.ts           # Admin API calls
│   │   └── productService.ts         # Product API calls
│   ├── types/
│   │   └── database.ts               # TypeScript types
│   ├── utils/
│   │   └── productTransform.ts       # DB → UI transform
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   ├── index.css                     # Global styles
│   └── vite-env.d.ts                 # Vite types
├── supabase/
│   ├── functions/
│   │   ├── create-order/
│   │   │   └── index.ts              # Order creation Edge Function
│   │   └── track-order/
│   │       └── index.ts              # Order tracking Edge Function
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_phase2_completion.sql
│       ├── 003_production_checkout.sql
│       ├── 004_storage_policies.sql
│       └── 005_critical_production_fixes.sql
├── .env.example                      # Environment template
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ✨ Key Features

### Customer Features
- ✅ Cinematic hero with video background
- ✅ 3D interactive fashion section (Three.js)
- ✅ Product browsing with filters (category, price, sort)
- ✅ Product detail with variant selection
- ✅ Real-time stock display
- ✅ Shopping cart with persistent storage
- ✅ Wishlist functionality
- ✅ Guest checkout (no account required)
- ✅ Authenticated checkout
- ✅ Order tracking with phone verification
- ✅ Mobile-first responsive design
- ✅ WhatsApp integration

### Admin Features
- ✅ Dashboard with real-time stats
- ✅ Product management (CRUD)
- ✅ Variant management (size, color, stock)
- ✅ Media upload (images, videos)
- ✅ Category management
- ✅ Collection management
- ✅ Inventory management with adjustments
- ✅ Order management
- ✅ Customer management
- ✅ Homepage CMS
- ✅ Contact enquiries
- ✅ Audit logs
- ✅ Site settings

### Security Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Edge Functions for sensitive operations
- ✅ Server-side price validation
- ✅ Atomic inventory updates
- ✅ Race condition prevention
- ✅ Guest checkout without fake UUIDs
- ✅ Secure order tracking
- ✅ Admin role-based access

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─→ Public queries (products, categories)
       │   └─→ Supabase Client (anon key)
       │       └─→ PostgreSQL (RLS enforced)
       │
       ├─→ Auth operations (login, register)
       │   └─→ Supabase Auth
       │       └─→ auth.users
       │
       └─→ Sensitive operations (checkout, tracking)
           └─→ Edge Function
               └─→ Supabase Client (service role)
                   └─→ PostgreSQL (bypasses RLS)
```

### Order Creation Flow

```
1. Customer adds items to cart (Zustand store)
2. Customer proceeds to checkout
3. Frontend validates form
4. Frontend calls Edge Function (create-order)
5. Edge Function:
   - Validates input
   - Maps auth user → customer record
   - Calls create_secure_order() RPC
6. RPC Function:
   - Validates stock (with row locking)
   - Calculates prices server-side
   - Creates order atomically
   - Decrements inventory
   - Logs transaction
7. Returns order number to frontend
8. Frontend redirects to success page
9. Cart is cleared
```

### Inventory Management

```
Product
  └─→ Variants (size + color combinations)
      └─→ stock_quantity
      └─→ low_stock_threshold
      
Inventory Transaction Log
  - variant_id
  - old_quantity
  - adjustment (+/-)
  - new_quantity
  - reason
  - admin_id
  - created_at
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Admin Flow
1. Login as admin
2. Create category
3. Create collection
4. Create product with variants
5. Upload product images
6. Activate product
7. Verify product appears in storefront

#### Customer Flow
1. Browse products
2. Filter by category
3. View product detail
4. Select variant (color + size)
5. Add to cart
6. Proceed to checkout
7. Fill shipping details
8. Place order (COD)
9. Verify order success
10. Track order with phone

#### Edge Cases
- Out of stock variant (should be disabled)
- Guest checkout (no account)
- Invalid order tracking (wrong phone)
- Concurrent stock updates (race condition test)

### Automated Testing

Currently, testing is manual. Consider adding:
- Unit tests for utility functions
- Integration tests for services
- E2E tests with Playwright/Cypress

---

## 🚀 Deployment

### Deploy to Netlify

1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Netlify will automatically deploy on push to main
   - First deployment takes 2-3 minutes

### Custom Domain (Optional)

1. Go to Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Wait for SSL certificate (automatic)

### Update Edge Functions

After making changes to Edge Functions:

```bash
supabase functions deploy create-order
supabase functions deploy track-order
```

---

## 🔧 Troubleshooting

### Build Errors

**Problem**: TypeScript errors
```bash
npm run typecheck
```
Fix type errors in the reported files.

**Problem**: Missing dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Problem**: "Supabase not configured"
- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

**Problem**: "Edge Function not found"
- Deploy Edge Functions: `supabase functions deploy create-order`
- Check function logs in Supabase Dashboard → Edge Functions

**Problem**: "Permission denied" on database operations
- Run migration 005 to fix RLS policies
- Check user is authenticated
- Verify admin_users table has entry for admin

**Problem**: Storage upload fails
- Verify storage buckets exist
- Check storage policies (migration 004)
- Check file size limits

### Database Issues

**Problem**: Tables don't exist
- Run all migrations in order
- Check migration logs for errors

**Problem**: RLS policy errors
- Run migration 005
- Verify user is authenticated
- Check customer record exists for auth user

### Deployment Issues

**Problem**: 404 on page refresh
- Verify `public/_redirects` exists
- Check Netlify build settings

**Problem**: Environment variables not working
- Redeploy after adding env vars
- Check variable names match exactly

---

## 🗺️ Roadmap

### Phase 3 (Next)

#### Payment Integration
- [ ] Razorpay integration
- [ ] Server-side payment verification
- [ ] Webhook handling
- [ ] Payment status updates

#### Shipping Integration
- [ ] Shiprocket API integration
- [ ] AWB generation
- [ ] Tracking updates
- [ ] Shipping cost calculation

#### Advanced Features
- [ ] Email notifications (order confirmation, shipping)
- [ ] Coupon/discount system
- [ ] Product reviews with images
- [ ] Bulk product import/export (CSV)
- [ ] Advanced analytics dashboard
- [ ] Customer account (order history, addresses)

#### Performance
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting
- [ ] Service worker for offline support
- [ ] CDN for static assets

#### SEO
- [ ] Meta tags for all pages
- [ ] Structured data (Product, Organization)
- [ ] Sitemap generation
- [ ] robots.txt

---

## 📝 Contributing

This is a production project. To contribute:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep components focused and small

### Commit Messages
```
feat: add product review system
fix: correct inventory calculation
docs: update README with deployment steps
refactor: simplify checkout flow
```

---

## 📄 License

This project is proprietary software for Fashion 2 Gether.

---

## 📞 Support

**Business Contact**:
- WhatsApp: +91 95955 35339
- Brand: Fashion 2 Gether
- Tagline: Yavatmal's Most Trending Store

**Technical Issues**:
- Check troubleshooting section
- Review migration files
- Check Edge Function logs
- Verify RLS policies

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📊 Project Status

**Current Phase**: Phase 2 Complete ✅

**Status**: Production Ready

**Last Updated**: 2026-01-10

**Build Status**: ✅ Passing

**Security Audit**: ✅ Complete

---

**Made with ❤️ for Fashion 2 Gether**
