# 🚀 START HERE - Sonya Stores Setup Guide

## What Just Happened?

Your Sonya Stores has been **completely migrated from Supabase to Neon PostgreSQL**. All Supabase code has been removed and replaced with direct Neon database connections.

### Key Changes:
✅ **Supabase → Neon** - 100% database migration complete
✅ **Custom Auth** - JWT-based authentication with HTTP-only cookies  
✅ **AI Products** - 50+ products can be generated and seeded instantly
✅ **Cart System** - Fully functional with sessionStorage
✅ **Admin Dashboard** - Works with Neon backend
✅ **Zero Supabase Code** - All imports removed

---

## 🎯 Quick Start (5 minutes)

### Step 1: Set Environment Variables

Create `.env.local` file in project root:

```env
DATABASE_URL=postgresql://username:password@ep-your-project.neon.tech/sonya_stores?sslmode=require
OPENAI_API_KEY=sk-your-openai-key
JWT_SECRET=your-secure-random-key-here
NODE_ENV=production
```

Get these from:
- **DATABASE_URL**: Neon dashboard → Connection String
- **OPENAI_API_KEY**: https://platform.openai.com/api-keys
- **JWT_SECRET**: Any random string (e.g., use `openssl rand -hex 32`)

### Step 2: Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Step 3: Create Admin Account

```bash
# Visit admin registration
http://localhost:3000/admin/register

# Create first admin (becomes super_admin)
Email: admin@sonyastores.com
Password: your-secure-password
```

### Step 4: Seed AI Products

```bash
# Generate & insert 50 products
pnpm seed:ai-products

# Takes 30-60 seconds, then you'll have:
# - 10 Footwear products
# - 10 Home Decor products  
# - 10 Bedding & Linens products
# - 10 Lighting products
# - 10 Wall Art products
```

### Step 5: View Your Store

- **Frontend**: http://localhost:3000 (see products on homepage)
- **Admin**: http://localhost:3000/admin/login (manage everything)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **FINAL_VERIFICATION.md** | Complete technical verification checklist |
| **NEON_INTEGRATION.md** | Technical overview of Neon integration |
| **RUN_SEED_GUIDE.md** | Detailed guide to running product seeding |
| **QUICKSTART.md** | Developer quick reference |
| **MIGRATION_COMPLETE.md** | Full migration summary |
| **AI_SEED_REFERENCE.md** | AI product generation documentation |

---

## 🗂️ Project Structure

```
sonya-stores/
├── app/
│   ├── page.tsx                 # Landing page (uses Neon APIs)
│   ├── layout.tsx               # Root layout with metadata
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login
│   │   ├── register/page.tsx    # Admin register
│   │   └── dashboard/page.tsx   # Admin dashboard
│   ├── api/
│   │   ├── admin/               # Admin API routes (Neon-backed)
│   │   ├── products/            # Product APIs (Neon-backed)
│   │   ├── orders/              # Order APIs (Neon-backed)
│   │   └── ...
│   └── product/[slug]/          # Product detail page
├── lib/
│   ├── db.ts                    # Neon database connection
│   ├── supabase-data.ts         # Data wrapper (uses Neon db.ts)
│   ├── cart-context.tsx         # Cart state management
│   ├── types.ts                 # TypeScript interfaces
│   └── password.ts              # Password hashing/verification
├── components/
│   ├── store/                   # Frontend store components
│   ├── admin/                   # Admin dashboard components
│   └── ui/                      # shadcn/ui components
├── scripts/
│   ├── 001_create_tables.sql    # Database schema
│   └── seed-ai-products.js      # AI product generation
├── middleware.ts                # JWT authentication middleware
└── package.json
```

---

## 🔑 Key Features

### 1. **Products Powered by Neon**
- Homepage displays products from Neon database
- Product detail pages fetch from Neon
- Search/filter query Neon directly
- Images stored with product records

### 2. **Shopping Cart**
- Stored in browser sessionStorage (client-side)
- Add/remove/update items in real-time
- Cart persists during session
- Checkout creates order in Neon

### 3. **Admin Dashboard**
- Login with JWT authentication (Neon-backed)
- View sales analytics (queries Neon)
- Manage products (CRUD to Neon)
- Process orders (from Neon)
- Add categories/offers (to Neon)

### 4. **Orders System**
- Customers submit orders via checkout form
- Orders saved to Neon `orders` table
- Order items tracked in `order_items` table
- Track orders by phone/order number

### 5. **AI Product Generation**
- Generate 50+ realistic products using OpenAI
- Seeds directly into Neon database
- Includes Kenya market pricing
- All categories auto-created

---

## ⚙️ Environment & Configuration

### Required Environment Variables
```env
DATABASE_URL                # Neon PostgreSQL connection
OPENAI_API_KEY             # For AI product generation
JWT_SECRET                 # For admin authentication
NODE_ENV                   # Set to 'production' in deployment
```

### Optional Variables
```env
NEXT_PUBLIC_SITE_URL       # Your site URL (for emails, etc.)
ADMIN_EMAIL                # Default admin email
```

---

## 🐛 Troubleshooting

### Products Not Showing
1. Check `pnpm seed:ai-products` completed successfully
2. Verify `DATABASE_URL` is correct
3. Check Neon dashboard - can you see products in `products` table?

### Admin Login Fails
1. Did you create admin account first? (Visit `/admin/register`)
2. Check password is correct
3. Verify `JWT_SECRET` is set in `.env.local`

### Seed Script Fails
1. Check `OPENAI_API_KEY` is valid
2. Check OpenAI account has available credits
3. Run with more verbosity: `DEBUG=* pnpm seed:ai-products`

### Build Errors
1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && pnpm install`
3. Rebuild: `pnpm build`

---

## 📊 Database Schema Overview

### Core Tables (Neon)
- `products` - Product listings
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Items in each order
- `admins` - Admin users
- `admin_sessions` - Admin session tracking
- `settings` - Store configuration
- `newsletter_subscribers` - Email subscribers
- `page_views` - Analytics tracking
- `policies` - Store policies (shipping, returns, etc.)

All tables are in Neon PostgreSQL. No Supabase dependency whatsoever.

---

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository**
   ```bash
   git add .
   git commit -m "Neon migration complete"
   git push
   ```

2. **Set Environment Variables in Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET`

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

4. **Seed Products (Production)**
   ```bash
   # SSH into Vercel environment or run locally:
   DATABASE_URL=<prod-url> OPENAI_API_KEY=<key> pnpm seed:ai-products
   ```

---

## 📞 Support & Next Steps

### Common Tasks

**Add More Products**
- Edit `/scripts/seed-ai-products.js` to add categories
- Run `pnpm seed:ai-products` again

**Customize Store**
- Edit store settings in admin dashboard
- Update categories and offers
- Configure delivery locations

**Add Payment Gateway**
- Implement M-Pesa, Stripe, or other payment provider
- Save payment records to `orders` table
- Update checkout flow

**Track Analytics**
- Page views tracked in `page_views` table
- Orders tracked in `orders` table
- Use admin dashboard analytics module

**Send Emails**
- Newsletter functionality ready (subscribers table)
- Order confirmation emails (implement in `/app/api/orders`)
- Admin notifications (configure in settings)

---

## ✅ Verification Checklist

Before going live:

- [ ] `.env.local` file created with all variables
- [ ] `pnpm install` completed successfully
- [ ] `pnpm dev` starts without errors
- [ ] Admin account created at `/admin/register`
- [ ] Admin login works at `/admin/login`
- [ ] `pnpm seed:ai-products` completed
- [ ] Homepage shows products
- [ ] Product detail pages work
- [ ] Cart add/remove items works
- [ ] Checkout creates orders in Neon
- [ ] Admin dashboard shows correct data

---

## 🎉 You're Ready!

Your Sonya Stores is now fully powered by **Neon PostgreSQL** with:
- ✅ 100% Supabase removed
- ✅ Custom authentication
- ✅ AI-generated products
- ✅ Fully functional admin panel
- ✅ Complete checkout system

**Next: Run `pnpm dev` and start selling!**
