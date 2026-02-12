# Sonya Stores - Quick Start Guide

## 🚀 Getting Started

### Step 1: Database Setup (Already Done)
The database schema has been created automatically in your Neon database. All tables are ready to use.

### Step 2: Environment Variables
Make sure you have `DATABASE_URL` set in your `.env.local`:
```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
```

### Step 3: Create First Admin
1. Visit: `http://localhost:3000/admin/register`
2. Fill in the form:
   - Email: your-admin@sonyastores.com
   - Name: Your Name
   - Password: secure-password (min 6 chars)
3. Click "Register Admin"
4. First admin automatically gets **Super Admin** role

### Step 4: Login to Dashboard
1. Visit: `http://localhost:3000/admin/login`
2. Enter your registered email and password
3. You'll be redirected to: `http://localhost:3000/admin/dashboard`

---

## 📊 Admin Dashboard Modules

### Overview Tab
- Dashboard with KPI cards (Orders, Products, Customers, Revenue)
- Currently showing placeholders - data will populate once other modules are implemented

### Settings Tab (Active)
Configure store information:
- **Store Name** - Display name (default: Sonya Stores)
- **Store Email** - Contact email (default: info@sonyastores.com)
- **Store Phone** - Contact phone (default: 0723274619)
- **Store Address** - Physical location
- **Store Description** - Store tagline/description
- **Tax Rate** - Sales tax percentage (default: 16%)
- **Shipping Cost** - Standard shipping cost in KSh (default: 200)

Click "Save Settings" to persist changes to database.

### Products Tab (Coming Soon)
Will include:
- Product listing
- Add/Edit/Delete products
- Image uploads
- Inventory management
- Stock alerts

### Orders Tab (Coming Soon)
Will include:
- Orders list
- Order details
- Order status updates
- Customer communication

### Customers Tab (Coming Soon)
Will include:
- Customer list
- Customer details
- Order history
- Customer preferences

---

## 🔐 Security Features Implemented

✅ Password hashing with bcrypt (10 rounds)
✅ Session-based authentication
✅ 24-hour token expiry
✅ Admin role-based access control
✅ Activity logging (IP, user agent)
✅ Unique email validation
✅ Last login tracking

---

## 📱 Frontend Pages

### Public Pages (All Static - No Backend)
- `/` - Homepage with hero, categories, featured products
- `/shop` - Product listing with filters
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms & conditions
- `/refund-policy` - Refund policy

### Category Pages (Static)
- `/shop?category=womens-shoes`
- `/shop?category=mens-shoes`
- `/shop?category=sneakers`
- `/shop?category=handbags`
- `/shop?category=home-accessories`
- `/shop?category=sandals`

### Admin Pages
- `/admin/register` - Register new admin
- `/admin/login` - Admin login
- `/admin/dashboard` - Main dashboard

---

## 🗄️ Database Tables

### Admins
- `id` - UUID primary key
- `email` - Unique email address
- `name` - Admin name
- `password_hash` - bcrypt hashed password
- `role` - 'admin' or 'super_admin'
- `is_active` - Account status
- `last_login` - Last login timestamp
- `created_at`, `updated_at` - Timestamps

### Settings
- `id` - UUID primary key
- `key` - Setting key (e.g., 'store_name')
- `value` - JSONB value
- `category` - Setting category
- `description` - Setting description
- `updated_by` - Admin who updated it
- `created_at`, `updated_at` - Timestamps

### Categories
- `id` - UUID primary key
- `name` - Category name
- `slug` - URL-friendly slug
- `description` - Category description
- `image_url` - Category image
- `is_active` - Whether category is visible
- `sort_order` - Display order
- `created_at`, `updated_at` - Timestamps

### Products
- `id` - UUID primary key
- `name` - Product name
- `slug` - URL-friendly slug
- `description` - Product description
- `category_id` - Foreign key to categories
- `price` - Selling price
- `discount_price` - Discounted price (optional)
- `cost_price` - Cost price (optional)
- `sku` - Stock keeping unit
- `stock_quantity` - Available stock
- `status` - 'active', 'inactive', 'archived'
- `is_featured` - Featured product flag
- `is_new` - New product flag
- `is_on_sale` - Sale flag
- `image_url` - Primary image
- `images` - Array of additional images
- `tags` - JSONB array of tags
- `created_at`, `updated_at` - Timestamps

### Orders
- `id` - UUID primary key
- `order_number` - Unique order number
- `customer_id` - Foreign key to customers
- `total_amount` - Total order amount
- `discount_amount` - Applied discount
- `tax_amount` - Tax calculated
- `shipping_amount` - Shipping cost
- `status` - Order status
- `payment_status` - Payment status
- `shipping_address` - Delivery address
- `notes` - Order notes
- `created_at`, `updated_at` - Timestamps

### Customers
- `id` - UUID primary key
- `email` - Customer email
- `phone` - Customer phone
- `first_name` - First name
- `last_name` - Last name
- `address` - Street address
- `city` - City
- `zip_code` - Postal code
- `country` - Country (default: Kenya)
- `created_at`, `updated_at` - Timestamps

---

## 🎨 Frontend Features

✅ Responsive design (mobile-first)
✅ 6 product categories with images
✅ Static featured products showcase
✅ New arrivals section
✅ On-offer products section
✅ Hero banners for shoes, handbags, home decor
✅ Category browsing
✅ Newsletter signup (form)
✅ Shopping cart (client-side)
✅ Wishlist (client-side)
✅ Order tracking page (placeholder)
✅ Contact information prominently displayed
✅ Social media links (TikTok, WhatsApp)
✅ Store location and hours

---

## 📞 Contact Information

**Sonya Stores**
- Phone: 0723274619
- Email: info@sonyastores.com
- Location: Nature HSE opposite Agro HSE stall, Nairobi, Kenya
- TikTok: @sonyas.store
- WhatsApp: Click to chat

---

## 🛠️ Troubleshooting

### DATABASE_URL not set
```
Error: DATABASE_URL environment variable is not set
```
Solution: Add your Neon connection string to `.env.local`

### Admin registration shows "Admin with this email already exists"
Solution: This email is already registered. Use a different email address.

### Settings not saving
Solution: Make sure you have proper database permissions and DATABASE_URL is valid.

### Admin login fails
Solution: Check email and password. Ensure admin account is active (`is_active = true`).

---

## 📚 API Endpoints

### Admin Authentication
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Login admin

### Settings Management
- `GET /api/admin/settings` - Fetch all settings
- `PUT /api/admin/settings` - Update settings

### Products (To be implemented)
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product details
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

---

Generated: February 12, 2026
Last Updated: Phase 1 Complete
