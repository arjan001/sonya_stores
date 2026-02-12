# Admin Panel Quick Start Guide

## Accessing the Admin Panel

1. **Login URL**: `https://your-domain.com/admin/login`
2. **Dashboard**: `https://your-domain.com/admin`

## Main Features

### 📊 Dashboard (`/admin`)
- View key metrics: total orders, pending orders, revenue, top categories
- Real-time update of store performance
- Analytics breakdown by category

### 📦 Products (`/admin/products`)
- View all products with pagination
- Search products by name
- Add new product with form
- Edit existing products
- Delete products
- Status: In Stock / Out of Stock
- Features: Pricing, original price, offer percentage, new item tag

**Quick Add**: Click "Add Product" button → Fill form → Click Save

### 🏷️ Categories (`/admin/categories`)
- Manage product categories
- Search categories
- Create new categories
- Edit category details (name, slug)
- Toggle active/inactive status
- Delete categories

**Quick Add**: Click "Add Category" → Enter name → Auto-generate slug → Save

### 📋 Orders (`/admin/orders`)
- View all orders with customer details
- Filter by status: All, Pending, Processing, Completed, Cancelled
- Search by customer name or order number
- View order details including customer contact info
- Update order status
- Quick status indicators: Green (Completed), Yellow (Pending), Blue (Processing)

**Quick Status Change**: Click eye icon → Select new status → Button updates order

### 🎯 Banners (`/admin/banners`)
- Manage promotional banners
- Upload banner images (provide image URL)
- Set banner title and link destination
- Control banner visibility (active/inactive)
- Search banners
- Add/edit/delete banners

**Quick Banner**: Title → Image URL → Link URL → Toggle Active → Save

### ⚙️ Settings (`/admin/settings`)
- **General Settings**
  - Store name, email, phone
  - Store address
  
- **Policies**
  - Tax rate (%)
  - Shipping cost (KSh)
  - Currency (default: KSh)
  - Items sold counter (for marketing display)

- **Social Media**
  - WhatsApp number
  - TikTok URL
  - Instagram URL

- **SEO & Branding**
  - Meta title for search engines
  - Meta description for search results

**Quick Save**: Modify any field → Click "Save Settings" → Confirmation appears

### 📈 Analytics (`/admin/analytics`)
- Detailed view of dashboard metrics
- Top categories performance
- Visual breakdown of store statistics
- Revenue tracking
- Order volume overview

## Common Tasks

### ✅ Add a New Product
1. Navigate to `/admin/products`
2. Click "Add Product" button
3. Fill in:
   - Product Name
   - Slug (auto-generate or custom)
   - Price (in KSh)
   - Original Price (if on sale)
   - Category ID
   - In Stock (toggle)
4. Click "Save"

### ✅ Update Order Status
1. Navigate to `/admin/orders`
2. Find the order (use search if needed)
3. Click the eye icon for the order
4. Select new status:
   - **Pending**: Awaiting processing
   - **Processing**: Being prepared
   - **Completed**: Delivered/Finished
   - **Cancelled**: Order cancelled
5. Click the status button to update

### ✅ Configure Store Settings
1. Navigate to `/admin/settings`
2. Update any field:
   - Store contact info
   - Shipping costs
   - Social media links
   - SEO metadata
3. Click "Save Settings"
4. Confirmation message appears

### ✅ Create a Promotional Banner
1. Navigate to `/admin/banners`
2. Click "Add Banner"
3. Enter:
   - Title (display text)
   - Image URL (link to image)
   - Link URL (where banner links to)
4. Toggle "Active" to show/hide
5. Click "Save"

## Navigation

**Sidebar Navigation** (Desktop)
- Dashboard
- Products
- Categories
- Orders (with badge for pending)
- Banners
- Analytics
- Settings
- Users (coming soon)

**Mobile Navigation**
- Hamburger menu at top
- Same navigation items
- Auto-closes after selection

**Breadcrumb Trail**
- Shows: Admin > Current Page
- Helps with navigation context

## Tips & Tricks

💡 **Search Bar**: Available on Products, Categories, Banners, Orders
💡 **Responsive**: Mobile-friendly design with sidebar collapse
💡 **Real-time Updates**: After any change, lists refresh automatically
💡 **Error Handling**: Clear error messages if something goes wrong
💡 **Auto-save**: Settings save with confirmation message
💡 **Status Badges**: Color-coded for quick status identification
💡 **Order Filtering**: Use dropdown to filter by order status

## Keyboard Shortcuts (Future)
- `Cmd+S` / `Ctrl+S` = Save (when applicable)
- `ESC` = Close dialogs/modals
- `/` = Focus search (when implemented)

## Troubleshooting

**"Unauthorized" Error**
- Session may have expired
- Go to `/admin/login` to login again
- Clear cookies if issue persists

**Changes Not Saving**
- Check browser console for errors
- Verify all required fields are filled
- Check internet connection

**Page Not Loading**
- Verify admin URL is correct
- Check browser console for errors
- Try refreshing the page

**Missing Data**
- May need to scroll/paginate to find item
- Use search feature to locate specific items
- Check filters are not hiding items

## Getting Help

- Check console for error messages (F12 → Console tab)
- Review recent activity in dashboard
- Contact development team if issues persist

---

**Last Updated**: February 2026
**Admin Panel Version**: 2.0 (Neon PostgreSQL)
