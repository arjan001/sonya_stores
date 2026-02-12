#!/usr/bin/env node

const { Pool } = require('pg');

// Dummy data
const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' },
  { name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop' },
  { name: 'Books', slug: 'books', description: 'Physical and digital books', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop' },
];

const products = [
  {
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'Premium wireless earbuds with noise cancellation and 30-hour battery life',
    categoryIndex: 0,
    price: 15999,
    discountPrice: 12999,
    costPrice: 8000,
    sku: 'WEB-001',
    stockQuantity: 150,
    isFeatured: true,
    isNew: true,
    isOnSale: true,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    tags: ['electronics', 'audio', 'wireless', 'earbuds'],
  },
  {
    name: 'Smart Watch Ultra',
    slug: 'smart-watch-ultra',
    description: 'Advanced smartwatch with fitness tracking and heart rate monitor',
    categoryIndex: 0,
    price: 24999,
    discountPrice: 19999,
    costPrice: 12000,
    sku: 'SWU-001',
    stockQuantity: 200,
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    tags: ['electronics', 'wearable', 'smartwatch'],
  },
  {
    name: 'Designer Sunglasses',
    slug: 'designer-sunglasses',
    description: 'Stylish UV-protected designer sunglasses with polarized lenses',
    categoryIndex: 1,
    price: 8999,
    discountPrice: 6999,
    costPrice: 3500,
    sku: 'DES-001',
    stockQuantity: 300,
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    tags: ['fashion', 'accessories', 'sunglasses'],
  },
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors',
    categoryIndex: 1,
    price: 1499,
    discountPrice: null,
    costPrice: 500,
    sku: 'PCT-001',
    stockQuantity: 500,
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    tags: ['fashion', 'clothing', 'casual'],
  },
  {
    name: 'Modern Coffee Table',
    slug: 'modern-coffee-table',
    description: 'Sleek minimalist coffee table with glass top and wooden legs',
    categoryIndex: 2,
    price: 12999,
    discountPrice: 9999,
    costPrice: 5000,
    sku: 'MCT-001',
    stockQuantity: 50,
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    tags: ['furniture', 'home', 'modern'],
  },
  {
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Non-slip yoga mat with carrying strap, 6mm thickness',
    categoryIndex: 3,
    price: 2499,
    discountPrice: 1999,
    costPrice: 800,
    sku: 'YMP-001',
    stockQuantity: 400,
    isFeatured: false,
    isNew: true,
    isOnSale: true,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop',
    tags: ['sports', 'fitness', 'yoga'],
  },
  {
    name: 'The Midnight Library',
    slug: 'the-midnight-library',
    description: 'Bestselling novel by Matt Haig about infinite possibilities',
    categoryIndex: 4,
    price: 599,
    discountPrice: null,
    costPrice: 250,
    sku: 'TMB-001',
    stockQuantity: 200,
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    tags: ['books', 'fiction', 'bestseller'],
  },
  {
    name: 'Fitness Dumbbell Set',
    slug: 'fitness-dumbbell-set',
    description: 'Complete 10kg adjustable dumbbell set with stand',
    categoryIndex: 3,
    price: 5999,
    discountPrice: 4499,
    costPrice: 2500,
    sku: 'FDS-001',
    stockQuantity: 100,
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop',
    tags: ['sports', 'fitness', 'gym'],
  },
];

const banners = [
  {
    title: 'Summer Sale - Up to 50% Off',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    linkUrl: '/shop?sale=true',
    isActive: true,
  },
  {
    title: 'New Collection Launch',
    imageUrl: 'https://images.unsplash.com/photo-1571781926069-3b26469b9a1a?w=1200&h=400&fit=crop',
    linkUrl: '/shop?new=true',
    isActive: true,
  },
  {
    title: 'Free Shipping on Orders Over 5000',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
    linkUrl: '/shop',
    isActive: true,
  },
];

async function seedDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('[v0] Starting database seeding...');
    console.log('[v0] Connecting to database...');
    
    const client = await pool.connect();

    // Seed categories
    console.log('[v0] Seeding categories...');
    const categoryMap = {};
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const result = await client.query(
        `INSERT INTO categories (name, slug, description, image_url, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.imageUrl, true, i]
      );
      categoryMap[i] = result.rows[0].id;
      console.log(`[v0] ✓ Created category: ${cat.name}`);
    }

    // Seed products
    console.log('[v0] Seeding products...');
    for (const prod of products) {
      const categoryId = categoryMap[prod.categoryIndex];
      await client.query(
        `INSERT INTO products (
          name, slug, description, category_id, price, discount_price, cost_price,
          sku, stock_quantity, status, is_featured, is_new, is_on_sale,
          image_url, images, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          prod.name,
          prod.slug,
          prod.description,
          categoryId,
          prod.price,
          prod.discountPrice,
          prod.costPrice,
          prod.sku,
          prod.stockQuantity,
          'active',
          prod.isFeatured,
          prod.isNew,
          prod.isOnSale,
          prod.imageUrl,
          JSON.stringify([prod.imageUrl]),
          JSON.stringify(prod.tags),
        ]
      );
      console.log(`[v0] ✓ Created product: ${prod.name}`);
    }

    // Seed banners
    console.log('[v0] Seeding banners...');
    for (const banner of banners) {
      await client.query(
        `INSERT INTO banners (title, image_url, link_url, is_active)
         VALUES ($1, $2, $3, $4)`,
        [banner.title, banner.imageUrl, banner.linkUrl, banner.isActive]
      );
      console.log(`[v0] ✓ Created banner: ${banner.title}`);
    }

    client.release();

    console.log('\n[v0] ═══════════════════════════════════════');
    console.log('[v0] Database seeding completed successfully!');
    console.log('[v0] ═══════════════════════════════════════');
    console.log('[v0] Summary:');
    console.log('[v0]   • Categories: 5');
    console.log('[v0]   • Products: 8');
    console.log('[v0]   • Banners: 3');
    console.log('[v0] ═══════════════════════════════════════\n');

  } catch (error) {
    console.error('[v0] Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
