import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const categories = [
  { name: 'Footwear', slug: 'footwear', description: 'Quality shoes and sneakers' },
  { name: 'Home Decor', slug: 'home-decor', description: 'Beautiful home accessories' },
  { name: 'Bedding & Linens', slug: 'bedding-linens', description: 'Comfortable bedding' },
  { name: 'Lighting', slug: 'lighting', description: 'Modern lighting solutions' },
  { name: 'Wall Art', slug: 'wall-art', description: 'Stunning wall decorations' },
]

const productTemplates = [
  {
    category: 'Footwear',
    products: [
      { name: 'Classic Leather Sneakers', price: 4500, discount: 3900 },
      { name: 'Sport Running Shoes', price: 5200, discount: 4200 },
      { name: 'Casual Canvas Shoes', price: 2800, discount: null },
      { name: 'Elegant Dress Shoes', price: 6500, discount: 5800 },
      { name: 'Comfortable Loafers', price: 4000, discount: 3400 },
      { name: 'Waterproof Boots', price: 7200, discount: 6200 },
      { name: 'Summer Sandals', price: 1800, discount: 1500 },
      { name: 'Professional Work Shoes', price: 5500, discount: 4900 },
      { name: 'Kids Sneakers', price: 2200, discount: 1800 },
      { name: 'Women\'s High Heels', price: 5800, discount: 4800 },
    ],
  },
  {
    category: 'Home Decor',
    products: [
      { name: 'Decorative Wall Clock', price: 1200, discount: 999 },
      { name: 'Ceramic Vase Set', price: 2400, discount: 1999 },
      { name: 'Wall Hanging Mirror', price: 3200, discount: 2699 },
      { name: 'Table Lamps', price: 1600, discount: 1299 },
      { name: 'Decorative Pillows', price: 800, discount: 599 },
      { name: 'Wall Stickers Set', price: 600, discount: 449 },
      { name: 'Picture Frames', price: 1400, discount: 1099 },
      { name: 'Decorative Plants', price: 1800, discount: 1499 },
      { name: 'Candle Holders', price: 1000, discount: 799 },
      { name: 'Wall Shelves', price: 2200, discount: 1799 },
    ],
  },
  {
    category: 'Bedding & Linens',
    products: [
      { name: 'Cotton Bed Sheets Set', price: 3500, discount: 2999 },
      { name: 'Soft Pillows', price: 1200, discount: 999 },
      { name: 'Quilted Comforter', price: 4200, discount: 3599 },
      { name: 'Bamboo Pillowcase', price: 800, discount: 599 },
      { name: 'Egyptian Cotton Duvet', price: 6500, discount: 5599 },
      { name: 'Waterproof Mattress Protector', price: 2200, discount: 1899 },
      { name: 'Throw Blanket', price: 1800, discount: 1499 },
      { name: 'Body Pillow', price: 1500, discount: 1199 },
      { name: 'Linen Bedspread', price: 2800, discount: 2399 },
      { name: 'Premium Bed Runner', price: 1400, discount: 1099 },
    ],
  },
  {
    category: 'Lighting',
    products: [
      { name: 'LED Pendant Light', price: 2200, discount: 1899 },
      { name: 'Smart Bulbs Set', price: 3200, discount: 2799 },
      { name: 'Table Desk Lamp', price: 1600, discount: 1299 },
      { name: 'Floor Standing Light', price: 2800, discount: 2399 },
      { name: 'Wall Sconce Lights', price: 1800, discount: 1499 },
      { name: 'Ceiling Lamp', price: 2400, discount: 1999 },
      { name: 'Reading Lamp', price: 1200, discount: 999 },
      { name: 'Neon Sign Lights', price: 2600, discount: 2199 },
      { name: 'Track Lighting', price: 3400, discount: 2999 },
      { name: 'String Lights', price: 1000, discount: 799 },
    ],
  },
  {
    category: 'Wall Art',
    products: [
      { name: 'Abstract Canvas Painting', price: 3200, discount: 2799 },
      { name: 'Landscape Wall Print', price: 1600, discount: 1299 },
      { name: 'Modern Geometric Art', price: 2400, discount: 1999 },
      { name: 'Family Photo Canvas', price: 2800, discount: 2399 },
      { name: 'Motivational Quote Poster', price: 800, discount: 599 },
      { name: 'Nature Photography Print', price: 1800, discount: 1499 },
      { name: 'Wood Wall Art', price: 2200, discount: 1899 },
      { name: 'Metal Wall Sculpture', price: 3600, discount: 3099 },
      { name: 'Vintage Wall Map', price: 1400, discount: 1099 },
      { name: 'Botanical Prints Set', price: 2000, discount: 1699 },
    ],
  },
]

async function seedDatabase() {
  try {
    console.log('[v0] Starting database seed...')

    // Clear existing data
    console.log('[v0] Clearing existing data...')
    await pool.query('DELETE FROM products')
    await pool.query('DELETE FROM categories')

    // Seed categories
    console.log('[v0] Seeding categories...')
    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (name, slug, description, is_active)
         VALUES ($1, $2, $3, true)`,
        [cat.name, cat.slug, cat.description]
      )
    }

    // Seed products
    console.log('[v0] Seeding products...')
    for (const catGroup of productTemplates) {
      const catResult = await pool.query(
        'SELECT id FROM categories WHERE name = $1',
        [catGroup.category]
      )
      const categoryId = catResult.rows[0]?.id

      if (!categoryId) continue

      for (let i = 0; i < catGroup.products.length; i++) {
        const product = catGroup.products[i]
        const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        await pool.query(
          `INSERT INTO products 
           (name, slug, description, price, discount_price, category_id, stock_quantity, status, is_featured, is_new, is_on_sale)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            product.name,
            slug,
            `High quality ${product.name.toLowerCase()}. Perfect for your needs.`,
            product.price,
            product.discount,
            categoryId,
            Math.floor(Math.random() * 50) + 10,
            'active',
            i === 0,
            i < 3,
            product.discount ? true : false,
          ]
        )
      }
    }

    console.log('[v0] Database seeding completed successfully!')
    console.log('[v0] Seeded:')
    console.log('  - 5 categories')
    console.log('  - 50 products')
  } catch (error) {
    console.error('[v0] Seeding error:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedDatabase()
