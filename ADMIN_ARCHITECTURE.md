# Admin Panel Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React Components (Admin Modules)            │  │
│  │  - ProductsModule    - OrdersModule                  │  │
│  │  - CategoriesModule  - BannersModule                 │  │
│  │  - SettingsModule    - AnalyticsModule               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (API Calls)
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              JWT Verification Layer                  │  │
│  │  - Extract admin_token from cookies                  │  │
│  │  - Verify signature using jose.jwtVerify()           │  │
│  │  - Return 401 if invalid                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Endpoint Handlers                     │  │
│  │  - GET    /api/admin/products                        │  │
│  │  - POST   /api/admin/products                        │  │
│  │  - PUT    /api/admin/products                        │  │
│  │  - DELETE /api/admin/products                        │  │
│  │  (+ categories, orders, banners, settings, analytics)│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Database Queries)
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (lib/admin-db.ts)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Database Functions (Type-safe)              │  │
│  │  - getProducts(), createProduct(), updateProduct()  │  │
│  │  - getOrders(), updateOrderStatus()                 │  │
│  │  - getCategories(), createCategory()                │  │
│  │  - getBanners(), createBanner()                      │  │
│  │  - getAllSettings(), updateSetting()                │  │
│  │  - getAnalytics()                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Query Execution (lib/db.ts)                    │  │
│  │  - Parameterized queries to prevent SQL injection   │  │
│  │  - Connection pooling to Neon                       │  │
│  │  - Error logging and handling                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (SQL)
┌─────────────────────────────────────────────────────────────┐
│           Neon PostgreSQL Database                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - admins       (admin user accounts)                │  │
│  │  - products     (product data)                       │  │
│  │  - categories   (product categories)                 │  │
│  │  - orders       (customer orders)                    │  │
│  │  - banners      (promotional banners)                │  │
│  │  - settings     (store configuration)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. Admin Login
   ├─ POST /api/admin/login
   ├─ Verify email & password against admins table
   └─ Return JWT token in secure HTTP-only cookie

2. Protected Requests
   ├─ Request includes admin_token cookie
   ├─ API verifies token with verifyAdmin()
   ├─ If valid → proceed with operation
   └─ If invalid → return 401 Unauthorized

3. Admin Logout
   ├─ POST /api/admin/logout
   └─ Clear admin_token cookie
```

## Data Flow Example: Updating a Product

```
1. User fills form in ProductsModule component
   └─ Click "Save"

2. Component sends PUT request
   ├─ URL: /api/admin/products
   ├─ Body: { id: "123", name: "New Name", price: 5000, ... }
   └─ Cookie: admin_token=eyJhbGc...

3. API receives request
   ├─ Extract admin_token from cookies
   ├─ Call verifyAdmin(request)
   │  └─ Verify JWT signature
   ├─ If verified → Extract admin ID from token
   └─ Parse JSON body

4. Call database function
   ├─ updateProduct("123", { name, price, ... })
   │  └─ Executes: UPDATE products SET name=$1, price=$2 WHERE id=$3
   ├─ Parameters passed separately to prevent SQL injection
   └─ Return success response

5. Component receives response
   ├─ Show success toast
   ├─ Call fetchProducts() to refresh list
   └─ Re-render component with updated data
```

## Error Handling

All endpoints follow this error handling pattern:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Verify auth
    const adminId = await verifyAdmin(request)
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Parse input
    const data = await request.json()

    // 3. Database operation
    const result = await createProduct(data)

    // 4. Return success
    return NextResponse.json({ id: result.id, message: "Product created" })
  } catch (error) {
    // 5. Log error for debugging
    console.error("[v0] Error creating product:", error)

    // 6. Return error response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

## Security Measures

✅ **JWT Tokens**: Signed tokens in HTTP-only cookies
✅ **Parameterized Queries**: Prevent SQL injection
✅ **Input Validation**: Type checking via TypeScript
✅ **Error Logging**: Debug traces without exposing data
✅ **Admin Verification**: Every endpoint verifies auth
✅ **No Sensitive Data**: Passwords hashed, not returned

## Performance Considerations

📊 **Database Indexing**: Built-in on primary keys
📊 **Pagination**: Products fetch with LIMIT/OFFSET
📊 **Filtering**: Status-based filters for orders
📊 **Caching**: Component state manages UI updates
📊 **Query Optimization**: Minimal SELECT fields when possible

## Scalability

🚀 **Stateless APIs**: Any server can handle requests
🚀 **Connection Pooling**: Efficient database connections
🚀 **Modular Components**: Easy to extend
🚀 **Centralized DB Logic**: Single source of truth
🚀 **Type Safety**: Prevents runtime errors
