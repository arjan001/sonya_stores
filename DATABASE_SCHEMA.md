# Sonya Stores - Database Schema

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        SONYA STORES DATABASE                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      ADMINS          │
├──────────────────────┤
│ id (UUID PK)         │
│ email (UNIQUE)       │◄──────┐
│ name                 │       │
│ password_hash        │       │
│ role (ENUM)          │       │
│ is_active            │       │
│ last_login           │       │
│ created_at           │       │
│ updated_at           │       │
└──────────────────────┘       │
         │                     │
         │ manages            │
         └─────────────────────┼───────────────────┐
                               │                   │
                    ┌──────────────────────┐   ┌──────────────────────┐
                    │     SETTINGS         │   │ ADMIN_SESSIONS       │
                    ├──────────────────────┤   ├──────────────────────┤
                    │ id (UUID PK)         │   │ id (UUID PK)         │
                    │ key (UNIQUE)         │   │ admin_id (FK)        │
                    │ value (JSONB)        │   │ token_hash (UNIQUE)  │
                    │ category             │   │ expires_at           │
                    │ description          │   │ ip_address           │
                    │ updated_by (FK)      │   │ user_agent           │
                    │ created_at           │   │ created_at           │
                    │ updated_at           │   └──────────────────────┘
                    └──────────────────────┘

                    ┌──────────────────────┐
                    │ ADMIN_ACTIVITY_LOG   │
                    ├──────────────────────┤
                    │ id (UUID PK)         │
                    │ admin_id (FK)        │
                    │ action               │
                    │ entity_type          │
                    │ entity_id            │
                    │ old_values (JSONB)   │
                    │ new_values (JSONB)   │
                    │ ip_address           │
                    │ created_at           │
                    └──────────────────────┘


┌──────────────────────┐         ┌──────────────────────┐
│    CATEGORIES        │         │     PRODUCTS         │
├──────────────────────┤         ├──────────────────────┤
│ id (UUID PK)         │         │ id (UUID PK)         │
│ name                 │◄────┬───│ category_id (FK)     │
│ slug (UNIQUE)        │     │   │ name                 │
│ description          │     │   │ slug (UNIQUE)        │
│ image_url            │     │   │ description          │
│ is_active            │     │   │ price                │
│ sort_order           │     │   │ discount_price       │
│ created_at           │     │   │ cost_price           │
│ updated_at           │     │   │ sku (UNIQUE)         │
└──────────────────────┘     │   │ stock_quantity       │
                              │   │ status (ENUM)        │
                              │   │ is_featured          │
                              │   │ is_new               │
                              │   │ is_on_sale           │
                              │   │ image_url            │
                              │   │ images (JSONB)       │
                              │   │ tags (JSONB)         │
                              │   │ created_at           │
                              │   │ updated_at           │
                              │   └──────────────────────┘
                              │            │
                              │ contains   │
                              │            ▼
                              │    ┌──────────────────────┐
                              │    │  ORDER_ITEMS         │
                              │    ├──────────────────────┤
                              │    │ id (UUID PK)         │
                              │    │ order_id (FK)        │
                              │    │ product_id (FK)      │
                              │    │ quantity             │
                              │    │ unit_price           │
                              │    │ subtotal             │
                              │    │ created_at           │
                              │    └──────────────────────┘


┌──────────────────────┐         ┌──────────────────────┐
│    CUSTOMERS         │         │      ORDERS          │
├──────────────────────┤         ├──────────────────────┤
│ id (UUID PK)         │         │ id (UUID PK)         │
│ email (UNIQUE)       │◄────┬───│ customer_id (FK)     │
│ phone                │     │   │ order_number (UNIQUE)│
│ first_name           │     │   │ total_amount         │
│ last_name            │     │   │ discount_amount      │
│ address              │     │   │ tax_amount           │
│ city                 │     │   │ shipping_amount      │
│ zip_code             │     │   │ status (ENUM)        │
│ country              │     │   │ payment_status       │
│ created_at           │     │   │ shipping_address     │
│ updated_at           │     │   │ notes                │
└──────────────────────┘     │   │ created_at           │
                             │   │ updated_at           │
                             │   └──────────────────────┘
                             │            │
                             │ places    │ contains
                             │            ▼
                             │    ┌──────────────────────┐
                             └───►│  ORDER_ITEMS         │
                                  └──────────────────────┘
```

## Data Types and Constraints

### Enums
```sql
-- user_role
CREATE TYPE user_role AS ENUM ('admin', 'super_admin', 'staff');

-- product_status
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'archived');

-- order_status
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
```

## Indexes for Performance

```
admins:
  - idx_admins_email
  - idx_admins_role

settings:
  - idx_settings_key
  - idx_settings_category

categories:
  - idx_categories_slug
  - idx_categories_is_active

products:
  - idx_products_slug
  - idx_products_category
  - idx_products_status
  - idx_products_is_featured
  - idx_products_is_new

customers:
  - idx_customers_email

orders:
  - idx_orders_order_number
  - idx_orders_customer
  - idx_orders_status
  - idx_orders_created_at

order_items:
  - idx_order_items_order
  - idx_order_items_product

admin_activity_log:
  - idx_activity_log_admin
  - idx_activity_log_created_at

admin_sessions:
  - idx_sessions_admin
  - idx_sessions_expires_at
```

## Triggers and Functions

### Automatic updated_at
All main tables have a trigger that automatically updates the `updated_at` column when a record is modified:

```sql
CREATE TRIGGER update_[table]_updated_at BEFORE UPDATE ON [table]
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Applied to:
- admins
- settings
- categories
- products
- customers
- orders

## Default Values

### Settings (Pre-populated)
```json
{
  "store_name": "Sonya Stores",
  "store_email": "info@sonyastores.com",
  "store_phone": "0723274619",
  "store_address": "Nature HSE opposite Agro HSE stall, Nairobi, Kenya",
  "store_description": "Home for your most trusted Shoes Quality and Home Decor at unbeatable prices",
  "currency": "KES",
  "tax_rate": 0.16,
  "shipping_cost": 200
}
```

### Categories (Pre-populated)
1. Women's Shoes
2. Men's Shoes
3. Sneakers
4. Handbags
5. Home Accessories
6. Sandals

## Relationships

### One-to-Many Relationships
- Admin → Admin Sessions
- Admin → Activity Logs
- Admin → Settings (updated_by)
- Category → Products
- Customer → Orders
- Order → Order Items

### Many-to-Many Relationships (Planned)
- Products → Tags (via JSONB array)
- Products → Images (via JSONB array)

## Data Integrity

### Foreign Key Constraints
- `products.category_id` → `categories.id` (CASCADE DELETE)
- `order_items.order_id` → `orders.id` (CASCADE DELETE)
- `orders.customer_id` → `customers.id` (SET NULL on delete)
- `admin_sessions.admin_id` → `admins.id` (CASCADE DELETE)
- `admin_activity_log.admin_id` → `admins.id` (CASCADE DELETE)
- `settings.updated_by` → `admins.id` (optional)

### Unique Constraints
- `admins.email`
- `categories.slug`
- `products.slug`
- `products.sku`
- `orders.order_number`
- `customers.email`
- `admin_sessions.token_hash`
- `settings.key`

---

Generated: February 12, 2026
Sonya Stores Database Schema v1.0
