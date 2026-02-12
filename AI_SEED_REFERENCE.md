#!/usr/bin/env node
/**
 * AI Product Seed Script for Sonya Stores
 * 
 * This script demonstrates the AI-powered product generation workflow.
 * It shows how we generate realistic products for each category and seed them into Neon.
 * 
 * Usage: pnpm seed:ai-products
 */

const CATEGORIES = [
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Quality shoes, sneakers, and footwear for every occasion',
    examples: [
      'Premium leather loafers for professional settings',
      'Comfortable running shoes with advanced cushioning',
      'Elegant heels for formal events',
      'Casual canvas sneakers',
      'Waterproof hiking boots'
    ]
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    description: 'Elegant home accessories and decorative pieces',
    examples: [
      'Modern wall art prints and paintings',
      'Decorative throw pillows with unique designs',
      'Elegant vases and planters',
      'Framed motivational quotes',
      'Decorative mirrors for living spaces'
    ]
  },
  {
    id: 'bedding',
    name: 'Bedding & Linens',
    description: 'Premium bedding, sheets, and sleep accessories',
    examples: [
      '100% cotton bed sheets with high thread count',
      'Memory foam pillows with cooling gel',
      'Weighted blankets for better sleep',
      'Duvet covers in various colors',
      'Mattress protectors and toppers'
    ]
  },
  {
    id: 'lighting',
    name: 'Lighting',
    description: 'Smart lighting solutions for every room',
    examples: [
      'LED desk lamps with adjustable brightness',
      'Pendant lights for modern kitchens',
      'Smart bulbs with color changing features',
      'Floor lamps for reading and ambient lighting',
      'Wall sconces for hallways and bedrooms'
    ]
  },
  {
    id: 'wall-art',
    name: 'Wall Art',
    description: 'Beautiful wall art and decorative prints',
    examples: [
      'Canvas paintings of African landscapes',
      'Minimalist line art prints',
      'Nature photography in frames',
      'Personalized family name signs',
      'Abstract art collections'
    ]
  }
]

/**
 * Example AI Prompt Structure
 * 
 * This is what the AI sees when generating products:
 */

const examplePrompt = `
Generate 10 unique product listings for the "Footwear" category in a Kenyan online store called "Sonya Stores" 
that sells quality shoes and home decor.

For each product, provide JSON format with these fields:
- name: Product name (max 60 chars, descriptive)
- description: Short description (2-3 sentences, max 150 chars)
- price: KES price (realistic for Kenya market: 1,500 - 15,000 KES)
- discount_price: Discounted price (use null if no discount)
- sku: Stock keeping unit (format: SS-CATEGORY-001)
- tags: Array of 2-3 tags for filtering

Context:
- Store location: Nature House, Stall 7, Nairobi CBD
- Target audience: Quality-conscious customers in Kenya
- Business model: Premium but affordable products
- Market: East African e-commerce

Return ONLY a valid JSON array. Example:
[
  {
    "name": "Premium Leather Loafers",
    "description": "Handcrafted leather loafers perfect for professional settings. Comfortable sole with modern design.",
    "price": 4500,
    "discount_price": null,
    "sku": "SS-FOOTWEAR-001",
    "tags": ["leather", "professional", "formal"]
  }
]
`

/**
 * Example Generated Product (AI Output)
 */

const exampleGeneratedProducts = [
  {
    name: "Premium Leather Loafers - Brown",
    description: "Handcrafted Italian-style leather loafers with cushioned insole. Perfect for office and casual settings. Breathable and durable.",
    price: 4500,
    discount_price: null,
    sku: "SS-FOOTWEAR-001",
    tags: ["leather", "professional", "comfort"]
  },
  {
    name: "Running Shoes - Advanced Cushion",
    description: "Professional-grade running shoes with gel cushioning technology. Lightweight mesh upper for breathability. Perfect for marathons and daily jogs.",
    price: 5200,
    discount_price: 4160,
    sku: "SS-FOOTWEAR-002",
    tags: ["sports", "cushioned", "lightweight"]
  },
  {
    name: "Elegant Heels - Black",
    description: "Classic black heels with 8cm stiletto heel. Comfortable padding for all-day wear. Perfect for parties, weddings, and formal events.",
    price: 3800,
    discount_price: null,
    sku: "SS-FOOTWEAR-003",
    tags: ["heels", "formal", "elegant"]
  },
  {
    name: "Canvas Sneakers - White",
    description: "Casual white canvas sneakers with rubber sole. Timeless design goes with any outfit. Easy to clean and comfortable for daily wear.",
    price: 2200,
    discount_price: 1760,
    sku: "SS-FOOTWEAR-004",
    tags: ["casual", "canvas", "versatile"]
  },
  {
    name: "Waterproof Hiking Boots",
    description: "Rugged hiking boots with waterproof membrane. Ankle support and grip sole for mountain trails. Ideal for outdoor adventures.",
    price: 6500,
    discount_price: null,
    sku: "SS-FOOTWEAR-005",
    tags: ["hiking", "outdoor", "waterproof"]
  }
]

/**
 * How Data Gets Into Neon
 * 
 * Flow:
 * 1. AI generates JSON product data
 * 2. Script validates JSON format
 * 3. Script connects to Neon via DATABASE_URL
 * 4. For each product:
 *    - Create slug from product name
 *    - Find category_id from categories table
 *    - INSERT into products table
 *    - Handle duplicates with ON CONFLICT
 * 5. Verify insertion count
 * 6. Close Neon connection
 */

const insertionFlow = `
Database Insertion Flow:

1. Get Category ID
   SELECT id FROM categories WHERE slug = 'footwear'
   → Returns: UUID (e.g., 'a1b2c3d4-...')

2. Insert Product
   INSERT INTO products (
     name, slug, description, price, discount_price,
     sku, category_id, stock_quantity, status,
     is_new, is_featured, is_on_sale, tags
   ) VALUES (
     'Premium Leather Loafers - Brown',
     'premium-leather-loafers-brown',
     'Handcrafted...',
     4500, null,
     'SS-FOOTWEAR-001', 'a1b2c3d4-...', 35, 'active',
     true, false, false, '["leather","professional"]'
   )
   ON CONFLICT (slug) DO NOTHING

3. Result
   ✓ Product inserted with auto-generated UUID
   ✓ Timestamps auto-set to NOW()
   ✓ Duplicates safely ignored
`

/**
 * Product Generation Metrics
 */

const metrics = {
  categories: 5,
  productsPerCategory: 10,
  totalProducts: 50,
  estimatedGenerationTime: '30-60 seconds',
  tokenCostPerCategory: '~500 tokens',
  estimatedAICost: '$0.01-0.03',
  priceRange: {
    min: 1500,
    max: 15000,
    currency: 'KES (Kenyan Shillings)'
  },
  samplePrices: {
    footwear: { min: 2000, max: 8000 },
    homeDecor: { min: 1500, max: 5000 },
    bedding: { min: 2500, max: 12000 },
    lighting: { min: 3000, max: 10000 },
    wallArt: { min: 2000, max: 6000 }
  },
  stockQuantity: {
    min: 10,
    max: 60,
    randomized: true
  },
  tags: {
    perProduct: 3,
    generated: 'AI-chosen based on category'
  }
}

/**
 * Environment Variables Required
 */

const requiredEnvVars = {
  DATABASE_URL: {
    description: 'Neon PostgreSQL connection string',
    format: 'postgresql://user:password@ep-xxxx.neon.tech/sonya_stores?sslmode=require',
    status: 'Required'
  },
  OPENAI_API_KEY: {
    description: 'OpenAI API key for GPT-4o-mini',
    format: 'sk-...',
    status: 'Required'
  },
  NODE_ENV: {
    description: 'Environment (development/production)',
    format: 'development or production',
    status: 'Optional (defaults to development)'
  }
}

/**
 * Error Handling in Seed Script
 */

const errorHandling = {
  "CONNECTION_FAILED": {
    cause: "DATABASE_URL not set or Neon unreachable",
    solution: "Check DATABASE_URL env var and Neon dashboard"
  },
  "AI_GENERATION_ERROR": {
    cause: "OpenAI API error or invalid response",
    solution: "Check OPENAI_API_KEY, rate limits, or API status"
  },
  "INVALID_JSON": {
    cause: "AI response doesn't contain valid JSON",
    solution: "Retry - AI output format occasionally varies"
  },
  "DUPLICATE_SKU": {
    cause: "Product SKU already exists",
    solution: "Handled gracefully with ON CONFLICT"
  },
  "CATEGORY_NOT_FOUND": {
    cause: "Category table empty",
    solution: "Ensure categories are created in database first"
  }
}

/**
 * Testing the Seed
 * 
 * Steps to verify:
 */

const testingSteps = `
1. Start dev server
   pnpm dev

2. Run seed in separate terminal
   pnpm seed:ai-products

3. Watch console output
   🤖 Generating AI products...
   📦 Generating 10 products for Footwear...
   ✅ Generated 10 products for Footwear
   ... (4 more categories)
   💾 Seeding database...
   ✅ Successfully inserted 50 products into Neon!

4. Verify in database
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM products;"
   
   Expected output:
    count
   -------
      50
   (1 row)

5. Check frontend
   Open http://localhost:3000
   Should see 50 products displayed

6. Verify in admin
   http://localhost:3000/admin/products
   Should show all 50 products in admin dashboard
`

/**
 * Extending the Seed Script
 * 
 * You can modify to:
 */

const extensionPoints = {
  addMoreCategories: {
    location: 'CATEGORIES array at top of seed-ai-products.js',
    example: `{
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories'
    }`
  },
  changeProductCount: {
    location: 'Modify prompt in generateProducts()',
    example: 'Change "Generate 10 products" to "Generate 20 products"'
  },
  customPricingRules: {
    location: 'Modify seedDatabase() function',
    example: 'Add markup calculation or special pricing logic'
  },
  addImages: {
    location: 'Extend product object with image generation',
    example: 'Use fal.ai or similar to generate product images'
  },
  customMetadata: {
    location: 'Modify mapProduct function',
    example: 'Add supplier info, cost price, or other metadata'
  }
}

/**
 * Performance Optimization Tips
 */

const optimizations = {
  "Batch Inserts": {
    current: "Insert one product at a time",
    improved: "Batch 10 products per query",
    benefit: "3-5x faster insertions"
  },
  "Connection Pooling": {
    current: "Release connection after each query",
    improved: "Reuse same connection for category",
    benefit: "Reduce connection overhead"
  },
  "Parallel Generation": {
    current: "Generate categories sequentially",
    improved: "Generate 2-3 categories in parallel",
    benefit: "2-3x faster overall (if rate limit allows)"
  },
  "Caching": {
    current: "Query category each time",
    improved: "Cache category IDs in memory",
    benefit: "Reduce database queries"
  }
}

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                 AI PRODUCT SEEDING - SONYA STORES                          ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Categories:            ${metrics.categories}                                            ║
║  Products per Category: ${metrics.productsPerCategory}                                          ║
║  Total Products:        ${metrics.totalProducts}                                          ║
║  Generation Time:       ${metrics.estimatedGenerationTime}                                ║
║  AI Model:              OpenAI GPT-4o-mini                                ║
║  Database:              Neon PostgreSQL                                   ║
║                                                                            ║
╠════════════════════════════════════════════════════════════════════════════╣
║  TO RUN: pnpm seed:ai-products                                             ║
╚════════════════════════════════════════════════════════════════════════════╝

This document explains the AI product generation workflow.
See /scripts/seed-ai-products.js for the actual implementation.
`)
