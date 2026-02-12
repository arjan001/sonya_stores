# 🌱 Seeding AI-Generated Products into Neon Database

This guide explains how to seed your Sonya Stores database with AI-generated products directly into Neon.

## Prerequisites

1. **Neon Database Connected**: Ensure your `DATABASE_URL` environment variable is set in `.env.local`
2. **AI API Key**: Set your `OPENAI_API_KEY` (or relevant AI provider key) in `.env.local`
3. **Dependencies Installed**: Run `pnpm install` to install all required packages

## Environment Variables

Make sure these are set in `.env.local`:

```env
# Neon PostgreSQL database
DATABASE_URL=postgresql://...@ep-*.neon.tech/sonya_stores?sslmode=require

# OpenAI API key for AI generation
OPENAI_API_KEY=sk-...

# Optional: Vercel AI Gateway (alternative to direct OpenAI)
AI_GATEWAY_API_KEY=...
```

## Running the Seed Script

### Option 1: Using npm/pnpm script (Recommended)

```bash
pnpm seed:ai-products
```

### Option 2: Direct Node execution

```bash
node scripts/seed-ai-products.js
```

## What Gets Generated

The script generates **7-10 quality products for each of 5 categories**:

1. **Footwear** (shoes, sneakers, heels, etc.)
2. **Home Decor** (wall art, decorations, accessories)
3. **Bedding & Linens** (sheets, pillows, covers)
4. **Lighting** (lamps, bulbs, fixtures)
5. **Wall Art** (paintings, prints, frames)

Each product includes:
- **Name**: Descriptive product name
- **Description**: 2-3 sentence description
- **Price**: Realistic KES pricing for Kenya market
- **Discount Price**: Optional sale price
- **SKU**: Unique stock keeping unit
- **Tags**: 2-3 relevant tags for filtering
- **Stock Quantity**: Random 10-60 units
- **Metadata**: Is new, is featured, is on sale flags

## Database Schema

Products are seeded into the `products` table with the following structure:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  sku VARCHAR(100),
  category_id UUID REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## AI Generation Details

- **Model**: OpenAI GPT-4o-mini (cost-effective)
- **Temperature**: 0.7 (creative but consistent)
- **Max Tokens**: 2000 per category
- **Format**: JSON with validation

## Troubleshooting

### "DATABASE_URL environment variable not set"
Solution: Add `DATABASE_URL` to `.env.local` or set it in your environment:
```bash
export DATABASE_URL=postgresql://...
```

### "generateText is not a function"
Solution: Ensure `ai` package is installed:
```bash
pnpm add ai @ai-sdk/openai
```

### "Connection failed to Neon"
Solution: 
- Check DATABASE_URL is correct
- Ensure SSL is enabled: `?sslmode=require`
- Verify IP whitelist in Neon dashboard

### "Products not showing on frontend"
Solution:
- Clear browser cache
- Verify products are in database: `SELECT COUNT(*) FROM products;`
- Check categories were created: `SELECT * FROM categories;`
- Rebuild frontend: `pnpm build`

## Manual Verification

After seeding, verify products in database:

```bash
# In Neon console or psql:

# Count products by category
SELECT c.name, COUNT(p.id) as product_count 
FROM products p 
JOIN categories c ON p.category_id = c.id 
GROUP BY c.id, c.name;

# View sample products
SELECT name, price, sku, tags 
FROM products 
LIMIT 10;

# Check for duplicate SKUs
SELECT sku, COUNT(*) 
FROM products 
GROUP BY sku 
HAVING COUNT(*) > 1;
```

## Frontend Display

Products are automatically fetched and displayed through:

1. **Homepage**: `/` - Shows featured products
2. **Category Pages**: `/shop/[slug]` - Shows category products
3. **Product Detail**: `/product/[slug]` - Individual product page
4. **Admin Dashboard**: `/admin` - View all products

All data flows through the PostgreSQL/Neon database via the `/lib/db` module.

## Updating/Re-seeding

To regenerate products:

1. **Clear existing products** (optional):
   ```sql
   DELETE FROM products WHERE created_at > NOW() - INTERVAL '1 day';
   ```

2. **Run seed script again**:
   ```bash
   pnpm seed:ai-products
   ```

The script uses `ON CONFLICT (slug) DO NOTHING` to prevent duplicates.

## Performance Notes

- Seeding 50 products takes ~30-60 seconds
- AI generation is the bottleneck (not database)
- Each category generates sequentially to maintain consistency
- Database inserts are batch-optimized

## Next Steps

After seeding:
1. Test homepage displays products
2. Verify admin dashboard loads product list
3. Check product detail pages work
4. Test search and filtering
5. Verify checkout flow

Happy seeding! 🎉
