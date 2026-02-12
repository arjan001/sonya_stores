# Developer Reference Guide - Sonya Stores

## 🔍 Quick Navigation

| Section | File | Purpose |
|---------|------|---------|
| Getting Started | QUICK_START.md | Setup and first steps |
| Implementation | IMPLEMENTATION_SUMMARY.md | What's been built |
| Architecture | ARCHITECTURE.md | System design |
| Database | DATABASE_SCHEMA.md | Tables and relationships |
| Checklist | CHECKLIST.md | Progress tracking |
| Status | STATUS_REPORT.md | Current state |

---

## 🗂️ Project Structure

```
sonya_stores/
├── app/
│   ├── admin/
│   │   ├── register/page.tsx           # Admin registration page
│   │   ├── login/page.tsx              # Admin login page
│   │   └── dashboard/page.tsx          # Admin dashboard (all modules)
│   ├── api/admin/
│   │   ├── register/route.ts           # Registration endpoint
│   │   ├── login/route.ts              # Login endpoint
│   │   └── settings/route.ts           # Settings CRUD endpoints
│   ├── (public pages)
│   │   ├── page.tsx                    # Homepage
│   │   ├── shop/page.tsx               # Shop/products
│   │   └── ... (other pages)
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   └── sitemap.ts                      # Sitemap generation
│
├── lib/
│   ├── db.ts                          # Database connection & queries
│   ├── utils.ts                       # Utility functions
│   └── (other utilities)
│
├── public/
│   ├── categories/                    # Category images
│   │   ├── womens-shoes.jpg
│   │   ├── mens-shoes.jpg
│   │   ├── sneakers.jpg
│   │   ├── handbags.jpg
│   │   ├── home-accessories.jpg
│   │   └── sandals.jpg
│   ├── products/                      # Product images
│   │   ├── womens-heels-red.jpg
│   │   ├── mens-leather-brown.jpg
│   │   ├── ... (8 total)
│   │   └── handbag-black.jpg
│   └── banners/                       # Banner images
│       ├── shoes-banner.jpg
│       ├── handbags-banner.jpg
│       └── home-decor-banner.jpg
│
├── components/
│   ├── store/                         # Frontend components
│   ├── ui/                            # shadcn/ui components
│   └── admin/                         # Admin components
│
├── scripts/
│   └── 01-create-sonya-stores-schema.sql    # Database migration
│
└── Docs/
    ├── QUICK_START.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── DATABASE_SCHEMA.md
    ├── ARCHITECTURE.md
    ├── CHECKLIST.md
    ├── STATUS_REPORT.md
    └── DEVELOPER_REFERENCE.md (this file)
```

---

## 🔧 Common Development Tasks

### Adding a New Admin API Endpoint

1. **Create Route File**
```typescript
// app/api/admin/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    const result = await query('SELECT * FROM table')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Insert logic
    const result = await query(
      'INSERT INTO table (col1, col2) VALUES ($1, $2)',
      [body.val1, body.val2]
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

2. **Test Endpoint**
```bash
curl -X GET http://localhost:3000/api/admin/resource
curl -X POST http://localhost:3000/api/admin/resource \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Querying Database

```typescript
import { query, queryOne } from '@/lib/db'

// Get multiple rows
const result = await query(
  'SELECT * FROM products WHERE category_id = $1',
  [categoryId]
)
const products = result.rows

// Get single row
const product = await queryOne(
  'SELECT * FROM products WHERE id = $1',
  [productId]
)

// Insert
const result = await query(
  'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
  [name, price]
)
const newProduct = result.rows[0]

// Update
const result = await query(
  'UPDATE products SET name = $1 WHERE id = $2 RETURNING *',
  [newName, productId]
)

// Delete
await query('DELETE FROM products WHERE id = $1', [productId])
```

### Adding New Admin Dashboard Tab

1. **Update Dashboard Component**
```typescript
// app/admin/dashboard/page.tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    {/* ... existing tabs ... */}
    <TabsTrigger value="newtab">
      <Icon className="w-4 h-4" />
    </TabsTrigger>
  </TabsList>

  {/* ... existing content ... */}

  <TabsContent value="newtab">
    <NewTabModule />
  </TabsContent>
</Tabs>
```

2. **Create Module Component**
```typescript
// Create new component file
function NewTabModule() {
  const [data, setData] = useState([])
  
  // Component logic
  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  )
}
```

---

## 🐛 Debugging Tips

### Enable Debug Logging
```typescript
// Add to any file for debugging
console.log('[v0] Variable:', variable)
console.log('[v0] Error:', error.message)

// In API routes
console.error('[v0] Database Error:', error)

// Check database connection
const result = await query('SELECT 1')
console.log('[v0] DB Connected:', result.rowCount > 0)
```

### Check Environment Variables
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Check in Next.js
console.log(process.env.DATABASE_URL)
```

### Database Connection Issues
```typescript
// In lib/db.ts - check pool
console.log('[v0] Pool initialized:', pool !== null)

// Test connection
const result = await query('SELECT 1')
console.log('[v0] Connection test:', result.rowCount)
```

### Frontend Issues
- Check browser console for errors
- Check Network tab for API responses
- Verify localStorage token: `localStorage.getItem('admin_token')`
- Check page redirects in Network tab

---

## 🔐 Security Checklist

Before deploying:

- [ ] DATABASE_URL is secure and not exposed
- [ ] All passwords are hashed with bcrypt
- [ ] Sessions have proper expiry (24h)
- [ ] Admin routes require authentication
- [ ] All user inputs are validated
- [ ] SQL queries use parameterized statements
- [ ] CORS is configured properly
- [ ] Sensitive data is logged safely

---

## 📝 Code Style & Conventions

### File Naming
- Pages: `page.tsx`
- APIs: `route.ts`
- Components: `ComponentName.tsx`
- Utils: `kebab-case.ts`
- Constants: `CONSTANT_NAME`

### TypeScript
```typescript
// Always type props
interface Props {
  title: string
  count: number
}

// Return types for functions
function fetchData(): Promise<Data[]> {
  // ...
}

// Use enums for constants
enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  STAFF = 'staff'
}
```

### Comments
```typescript
// Use for explanations
// This calculates the total with tax

/* Use for blocks */
/*
 * Complex logic that needs
 * multiple lines of explanation
 */

// Use [v0] prefix for debug logging
console.log('[v0] Debug message')
```

---

## 🧪 Testing Checklist

### Admin Registration
- [ ] Invalid email format rejected
- [ ] Duplicate email rejected
- [ ] Weak password rejected
- [ ] Password mismatch rejected
- [ ] Valid registration successful
- [ ] First admin becomes super_admin
- [ ] Second admin becomes admin

### Admin Login
- [ ] Invalid email rejected
- [ ] Invalid password rejected
- [ ] Valid credentials login successful
- [ ] Token stored in localStorage
- [ ] Redirect to dashboard works
- [ ] Last login updated
- [ ] Session created in database

### Settings CRUD
- [ ] Settings load correctly
- [ ] Edit single setting works
- [ ] Edit multiple settings works
- [ ] Save button persists changes
- [ ] Database updated correctly
- [ ] Page reflects updated values

---

## 📦 Dependencies Reference

### Core
- **next**: 16.1.6 - React framework
- **react**: 19.2.3 - UI library
- **typescript**: 5.7.3 - Type safety

### Database
- **pg**: 8.11.3 - PostgreSQL client
- **bcrypt**: 5.1.1 - Password hashing

### UI
- **tailwindcss**: 3.4.17 - CSS framework
- **shadcn/ui**: Latest - Component library
- **lucide-react**: Icon library

### Forms
- **react-hook-form**: 7.54.1 - Form management
- **zod**: 3.24.1 - Schema validation

### Data Fetching
- **swr**: 2.4.0 - Client-side fetching

---

## 🚀 Performance Optimization

### Database
```sql
-- Already indexed for performance:
- admins.email
- categories.slug
- products.slug, category_id
- orders.customer_id, created_at
- admin_sessions.admin_id
```

### Frontend
- Lazy load components: `dynamic(() => import('...'))`
- Optimize images: Use Next.js Image component
- Minify CSS: Tailwind automatically purges
- Code splitting: Next.js automatic

### Caching
- Set-Cookie for session tokens
- Use SWR for client-side caching
- Database indexes for quick queries

---

## 🆘 Troubleshooting

### Error: "DATABASE_URL not set"
**Solution**: Add `DATABASE_URL` to `.env.local` with Neon connection string

### Error: "Admin with this email already exists"
**Solution**: Use a different email address or check database

### Error: "Undefined" in admin token
**Solution**: Check localStorage is accessible and token is saved

### Error: "Connection refused"
**Solution**: Verify DATABASE_URL is correct and Neon is running

### Images not loading
**Solution**: Ensure images are in `/public` directory and path is correct

### API returns 500
**Solution**: Check server logs with `console.log('[v0]')`

---

## 📚 Learning Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Neon Docs](https://neon.tech/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Similar Projects
- Check `IMPLEMENTATION_SUMMARY.md` for architecture
- Review `DATABASE_SCHEMA.md` for design patterns
- Study `app/api/admin/**/route.ts` for API patterns

---

## 📞 Getting Help

1. **Check Documentation**: See docs/ folder
2. **Review Code**: Look at similar implementations
3. **Debug**: Use `console.log('[v0]')` 
4. **Check Logs**: Server logs show errors
5. **Test API**: Use curl or Postman

---

## 🎯 Next Steps for Developers

### Phase 3 Tasks (Products CRUD)
1. Create `/api/admin/products` routes
2. Build products list page
3. Add product create/edit form
4. Implement image upload
5. Add delete functionality

### Phase 4 Tasks (Orders CRUD)
1. Create `/api/admin/orders` routes
2. Build orders dashboard
3. Add order status updates
4. Implement order tracking

### Phase 5 Tasks (Frontend Integration)
1. Connect homepage to products DB
2. Build product details page
3. Implement shopping cart
4. Add checkout flow

---

**Last Updated**: February 12, 2026
**Version**: 1.0
**Status**: Ready for Phase 3
**Contact**: info@sonyastores.com
