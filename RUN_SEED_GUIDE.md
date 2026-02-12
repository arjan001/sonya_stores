# How to Run AI Product Seeding

## Prerequisites

1. **Environment Variables Set**
   - `DATABASE_URL` - Your Neon database connection string
   - `OPENAI_API_KEY` - Your OpenAI API key

2. **Dependencies Installed**
   ```bash
   pnpm install
   ```

3. **Node.js 18+** (for ES modules)

## Step-by-Step Guide

### Option 1: Using npm Script (Recommended)

```bash
# From project root
pnpm seed:ai-products
```

This will:
- Connect to your Neon database
- Generate 50+ AI products (10 per category)
- Insert them into the database with realistic Kenya market pricing
- Take 30-60 seconds depending on OpenAI API response

### Option 2: Running Directly

```bash
# Make script executable (Linux/Mac)
chmod +x scripts/seed-ai-products.js

# Run with Node
node scripts/seed-ai-products.js
```

## Expected Output

```
🤖 Generating AI products for Sonya Stores...

📦 Generating 10 products for Footwear...
✓ Created 10 footwear products
📦 Generating 10 products for Home Decor...
✓ Created 10 home decor products
📦 Generating 10 products for Bedding & Linens...
✓ Created 10 bedding products
📦 Generating 10 products for Lighting...
✓ Created 10 lighting products
📦 Generating 10 products for Wall Art...
✓ Created 10 wall art products

✅ Successfully seeded 50 products to Neon!
```

## What Gets Created

### Database Records

**Categories** (if not existing):
- Footwear
- Home Decor
- Bedding & Linens
- Lighting
- Wall Art

**Products** (50 total):
- 10 Footwear items (shoes, sneakers, boots, heels)
- 10 Home Decor items (wall art, vases, mirrors, frames)
- 10 Bedding items (sheets, pillows, blankets, comforters)
- 10 Lighting items (lamps, bulbs, chandeliers, fixtures)
- 10 Wall Art items (paintings, prints, posters, canvases)

### Product Data for Each Item

```sql
{
  "id": "uuid",
  "name": "Premium Leather Sneakers",
  "slug": "premium-leather-sneakers",
  "category_id": "uuid",
  "price": 3500,
  "original_price": null,
  "description": "Comfortable leather sneakers perfect for daily wear",
  "sku": "SS-FOOTWEAR-001",
  "tags": ["shoes", "comfort", "daily"],
  "images": ["/products/sneakers-1.jpg"],
  "collection": "footwear",
  "in_stock": true,
  "is_active": true,
  "is_new": true,
  "is_on_offer": false,
  "created_at": "2026-02-12T..."
}
```

## Troubleshooting

### Error: "DATABASE_URL is not set"
- Make sure you have `.env.local` file with `DATABASE_URL` set
- Or set it as environment variable: `export DATABASE_URL=...`

### Error: "OPENAI_API_KEY is not set"
- Get your key from https://platform.openai.com/api-keys
- Set in `.env.local` or: `export OPENAI_API_KEY=sk-...`

### Error: "Connection refused"
- Check that your Neon database is running
- Verify `DATABASE_URL` is correct
- Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Error: "Rate limit exceeded"
- OpenAI API rate limit hit
- Wait a few seconds and try again
- Or upgrade your OpenAI plan

### Error: "Invalid JSON from AI"
- Sometimes the AI response formatting is off
- Try running again
- The script retries up to 3 times per category

## Verify Success

### Check Database

```sql
-- Connect to Neon
psql $DATABASE_URL

-- Count products by category
SELECT c.name, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- View sample product
SELECT name, price, description, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check Frontend

1. Start dev server: `pnpm dev`
2. Visit: `http://localhost:3000`
3. Scroll through homepage
4. Products should display with images and prices
5. Visit product details page

## Verify Database Connection

```bash
# Test if Neon connection works
node -e "
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query('SELECT NOW()').then(r => console.log('✅ Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e.message));
"
```

## Next Steps

After seeding:

1. **View in Admin Dashboard**
   - Login to `/admin/login` (use credentials you created)
   - Go to Products section
   - See all 50 AI-generated products

2. **Edit Products**
   - Update prices, descriptions, images
   - Mark as featured or on offer
   - Organize into collections

3. **Add More Categories**
   - Use admin panel to create custom categories
   - Re-run seed with custom prompts (edit seed-ai-products.js)

4. **Configure Store**
   - Update store settings in admin
   - Set delivery locations
   - Configure payment methods
   - Add policies (returns, shipping, etc.)

## Advanced: Custom Product Generation

Edit `/scripts/seed-ai-products.js` to:
- Add more categories to `CATEGORIES` array
- Modify the AI prompt to generate different products
- Adjust pricing ranges for different markets

Example:
```javascript
const CATEGORIES = [
  { id: 'footwear', name: 'Footwear', slug: 'footwear' },
  { id: 'handbags', name: 'Handbags', slug: 'handbags' }, // NEW
  // ...
]
```

Then run: `pnpm seed:ai-products`
