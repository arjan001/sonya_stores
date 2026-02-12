#!/usr/bin/env node

import { generateText } from 'ai'
import { sql } from '@vercel/postgres'

const CATEGORIES = [
  { id: 'footwear', name: 'Footwear', slug: 'footwear' },
  { id: 'home-decor', name: 'Home Decor', slug: 'home-decor' },
  { id: 'bedding', name: 'Bedding & Linens', slug: 'bedding' },
  { id: 'lighting', name: 'Lighting', slug: 'lighting' },
  { id: 'wall-art', name: 'Wall Art', slug: 'wall-art' },
]

async function generateProducts() {
  console.log('🤖 Generating AI products for Sonya Stores...\n')

  const allProducts = []

  for (const category of CATEGORIES) {
    console.log(`📦 Generating 10 products for ${category.name}...`)

    const prompt = `Generate 10 unique product listings for a "${category.name}" category in a Kenyan online store called "Sonya Stores" that sells quality shoes and home decor. 
    
For each product, provide JSON format with these fields:
- name: Product name (max 60 chars)
- description: Short description (2-3 sentences, max 150 chars)
- price: KES price (realistic for Kenya)
- discount_price: Discounted price (optional, null if no discount)
- sku: Stock keeping unit (unique)
- tags: Array of 2-3 tags relevant to product

IMPORTANT: Return ONLY a valid JSON array, no markdown, no extra text.

Category: ${category.name}
Store location: Nature House, Stall 7, Nairobi CBD, Kenya
Target audience: Quality-conscious customers in Kenya

Return exactly this format for each product:
[
  {
    "name": "Product Name",
    "description": "Description here",
    "price": 2500,
    "discount_price": null,
    "sku": "SKU-001",
    "tags": ["tag1", "tag2", "tag3"]
  }
]`

    try {
      const result = await generateText({
        model: 'openai/gpt-4o-mini',
        prompt,
        temperature: 0.7,
      })

      const jsonMatch = result.text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        console.warn(`⚠️  Failed to parse JSON for ${category.name}`)
        continue
      }

      const products = JSON.parse(jsonMatch[0])

      for (const product of products) {
        allProducts.push({
          categoryId: category.id,
          categoryName: category.name,
          ...product,
        })
      }

      console.log(`✅ Generated ${products.length} products for ${category.name}`)
    } catch (error) {
      console.error(`❌ Error generating products for ${category.name}:`, error)
    }
  }

  return allProducts
}

async function seedDatabase(products) {
  console.log('\n💾 Seeding database...\n')

  try {
    // First, ensure categories exist
    for (const category of CATEGORIES) {
      await sql`
        INSERT INTO categories (name, slug, description, is_active, sort_order)
        VALUES (${category.name}, ${category.slug}, ${`Quality ${category.name} at Sonya Stores`}, true, 0)
        ON CONFLICT (slug) DO NOTHING
      `
    }
    console.log('✅ Categories ready')

    // Insert products
    let insertedCount = 0
    for (const product of products) {
      const category = CATEGORIES.find((c) => c.id === product.categoryId)
      if (!category) continue

      const slug = product.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 60)

      await sql`
        INSERT INTO products (
          name,
          slug,
          description,
          price,
          discount_price,
          sku,
          category_id,
          stock_quantity,
          status,
          is_new,
          is_featured,
          is_on_sale,
          tags,
          created_at,
          updated_at
        )
        SELECT
          ${product.name},
          ${slug},
          ${product.description},
          ${product.price},
          ${product.discount_price || null},
          ${product.sku},
          id,
          ${Math.floor(Math.random() * 50) + 10},
          'active',
          ${Math.random() > 0.7},
          ${Math.random() > 0.8},
          ${product.discount_price ? true : false},
          ${JSON.stringify(product.tags)},
          NOW(),
          NOW()
        FROM categories
        WHERE slug = ${category.slug}
        ON CONFLICT (slug) DO NOTHING
      `
      insertedCount++

      if (insertedCount % 10 === 0) {
        console.log(`  ✓ Inserted ${insertedCount}/${products.length} products...`)
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} products into database!`)
  } catch (error) {
    console.error('❌ Database seeding error:', error)
    process.exit(1)
  }
}

async function main() {
  const products = await generateProducts()
  console.log(`\n📊 Total generated: ${products.length} products`)

  if (products.length > 0) {
    await seedDatabase(products)
  } else {
    console.log('⚠️  No products generated. Exiting.')
    process.exit(1)
  }

  console.log('\n🎉 Product seeding complete!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
