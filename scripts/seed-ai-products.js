#!/usr/bin/env node

import { generateText } from 'ai'
import { Pool } from 'pg'

const CATEGORIES = [
  { id: 'footwear', name: 'Footwear', slug: 'footwear' },
  { id: 'home-decor', name: 'Home Decor', slug: 'home-decor' },
  { id: 'bedding', name: 'Bedding & Linens', slug: 'bedding' },
  { id: 'lighting', name: 'Lighting', slug: 'lighting' },
  { id: 'wall-art', name: 'Wall Art', slug: 'wall-art' },
]

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function generateProducts() {
  console.log('🤖 Generating AI products for Sonya Stores...\n')

  const allProducts = []

  for (const category of CATEGORIES) {
    console.log(`📦 Generating 10 products for ${category.name}...`)

    const prompt = `Generate 10 unique product listings for a "${category.name}" category in a Kenyan online store called "Sonya Stores" that sells quality shoes and home decor. 

For each product, provide JSON format with these fields:
- name: Product name (max 60 chars, descriptive)
- description: Short description (2-3 sentences, max 150 chars)
- price: KES price (realistic for Kenya market)
- discount_price: Discounted price (use null if no discount)
- sku: Stock keeping unit (format: SS-CATEGORY-001)
- tags: Array of 2-3 tags

CRITICAL: Return ONLY a valid JSON array wrapped in triple backticks. No other text.

Category: ${category.name}
Store: Nature House, Stall 7, Nairobi CBD
Audience: Quality-conscious Kenyans

\`\`\`json
[
  {
    "name": "Product Name Here",
    "description": "Brief description of the product",
    "price": 2500,
    "discount_price": null,
    "sku": "SS-${category.slug.toUpperCase()}-001",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
\`\`\``

    try {
      const result = await generateText({
        model: 'openai/gpt-4o-mini',
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      })

      const jsonMatch = result.text.match(/```json\s*([\s\S]*?)\s*```/)
      if (!jsonMatch) {
        console.warn(`⚠️  No JSON found in response for ${category.name}`)
        continue
      }

      const products = JSON.parse(jsonMatch[1])

      for (const product of products) {
        allProducts.push({
          categoryId: category.id,
          categoryName: category.name,
          ...product,
        })
      }

      console.log(`✅ Generated ${products.length} products for ${category.name}`)
    } catch (error) {
      console.error(`❌ Error generating products for ${category.name}:`, error.message)
    }
  }

  return allProducts
}

async function seedDatabase(products) {
  console.log('\n💾 Seeding Neon database...\n')

  const client = await pool.connect()

  try {
    // Ensure categories exist
    for (const category of CATEGORIES) {
      await client.query(
        `INSERT INTO categories (name, slug, description, is_active, sort_order)
         VALUES ($1, $2, $3, true, 0)
         ON CONFLICT (slug) DO NOTHING`,
        [category.name, category.slug, `Quality ${category.name} at Sonya Stores`]
      )
    }
    console.log('✅ Categories ready')

    // Get category IDs
    const categoryMap = {}
    for (const category of CATEGORIES) {
      const result = await client.query('SELECT id FROM categories WHERE slug = $1', [category.slug])
      if (result.rows.length > 0) {
        categoryMap[category.id] = result.rows[0].id
      }
    }

    // Insert products
    let insertedCount = 0
    for (const product of products) {
      const categoryId = categoryMap[product.categoryId]
      if (!categoryId) continue

      const slug = product.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 60)

      const stockQuantity = Math.floor(Math.random() * 50) + 10
      const isNew = Math.random() > 0.7
      const isFeatured = Math.random() > 0.8
      const isOnSale = !!product.discount_price

      try {
        await client.query(
          `INSERT INTO products (
            name, slug, description, price, discount_price, sku,
            category_id, stock_quantity, status, is_new, is_featured,
            is_on_sale, tags, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
           ON CONFLICT (slug) DO NOTHING`,
          [
            product.name,
            slug,
            product.description,
            product.price,
            product.discount_price || null,
            product.sku,
            categoryId,
            stockQuantity,
            'active',
            isNew,
            isFeatured,
            isOnSale,
            JSON.stringify(product.tags),
          ]
        )
        insertedCount++

        if (insertedCount % 10 === 0) {
          console.log(`  ✓ Inserted ${insertedCount}/${products.length} products...`)
        }
      } catch (err) {
        console.warn(`  ⚠️  Skipped duplicate: ${product.sku}`)
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} products into Neon!`)
  } catch (error) {
    console.error('❌ Database error:', error.message)
    process.exit(1)
  } finally {
    client.release()
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set')
    process.exit(1)
  }

  const products = await generateProducts()
  console.log(`\n📊 Total generated: ${products.length} products`)

  if (products.length > 0) {
    await seedDatabase(products)
  } else {
    console.log('⚠️  No products generated. Exiting.')
    process.exit(1)
  }

  await pool.end()
  console.log('\n🎉 Product seeding complete!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
