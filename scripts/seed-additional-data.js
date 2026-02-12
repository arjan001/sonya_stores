#!/usr/bin/env node

const { Pool } = require('pg');

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

const offers = [
  {
    title: 'Electronics Mega Sale',
    description: 'Get up to 40% off on all electronics',
    discountPercentage: 40,
    appliesToType: 'category',
    categoryName: 'Electronics',
  },
  {
    title: 'Summer Fashion Week',
    description: 'All fashion items 30% off',
    discountPercentage: 30,
    appliesToType: 'category',
    categoryName: 'Fashion',
  },
  {
    title: 'Weekend Sports Special',
    description: 'Sports gear at unbeatable prices',
    discountPercentage: 25,
    appliesToType: 'category',
    categoryName: 'Sports',
  },
];

const policies = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    type: 'privacy',
    content: 'We respect your privacy. This privacy policy explains how we collect, use, and protect your personal information when you use our website and services.',
  },
  {
    title: 'Terms and Conditions',
    slug: 'terms-conditions',
    type: 'terms',
    content: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
  },
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    type: 'shipping',
    content: 'We offer free shipping on all orders over KSh 5,000. Orders are typically shipped within 1-2 business days.',
  },
  {
    title: 'Return Policy',
    slug: 'return-policy',
    type: 'return',
    content: 'We offer a 30-day return policy on all items. Items must be in original condition with all packaging.',
  },
];

async function seedAdditionalData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('[v0] Starting additional data seeding...\n');
    
    const client = await pool.connect();

    // Seed banners
    console.log('[v0] Seeding banners...');
    const bannerCheckResult = await client.query('SELECT COUNT(*) FROM banners');
    if (bannerCheckResult.rows[0].count === 0) {
      for (const banner of banners) {
        await client.query(
          `INSERT INTO banners (title, image_url, link_url, is_active)
           VALUES ($1, $2, $3, $4)`,
          [banner.title, banner.imageUrl, banner.linkUrl, banner.isActive]
        );
        console.log(`[v0] ✓ Created banner: ${banner.title}`);
      }
    } else {
      console.log('[v0] ℹ Banners already exist, skipping...');
    }

    // Seed offers
    console.log('\n[v0] Seeding offers...');
    const offerCheckResult = await client.query('SELECT COUNT(*) FROM offers');
    if (offerCheckResult.rows[0].count === 0) {
      for (const offer of offers) {
        const categoryResult = await client.query(
          'SELECT id FROM categories WHERE name = $1',
          [offer.categoryName]
        );
        
        if (categoryResult.rows.length > 0) {
          const categoryId = categoryResult.rows[0].id;
          await client.query(
            `INSERT INTO offers (title, description, discount_percentage, applies_to, category_id, is_active)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [offer.title, offer.description, offer.discountPercentage, offer.appliesToType, categoryId, true]
          );
          console.log(`[v0] ✓ Created offer: ${offer.title}`);
        }
      }
    } else {
      console.log('[v0] ℹ Offers already exist, skipping...');
    }

    // Seed policies
    console.log('\n[v0] Seeding policies...');
    const policyCheckResult = await client.query('SELECT COUNT(*) FROM policies');
    if (policyCheckResult.rows[0].count === 0) {
      for (const policy of policies) {
        await client.query(
          `INSERT INTO policies (title, slug, type, content, is_published)
           VALUES ($1, $2, $3, $4, $5)`,
          [policy.title, policy.slug, policy.type, policy.content, true]
        );
        console.log(`[v0] ✓ Created policy: ${policy.title}`);
      }
    } else {
      console.log('[v0] ℹ Policies already exist, skipping...');
    }

    // Seed delivery settings
    console.log('\n[v0] Seeding delivery settings...');
    const deliveryCheckResult = await client.query('SELECT COUNT(*) FROM delivery_settings');
    if (deliveryCheckResult.rows[0].count === 0) {
      const deliveryOptions = [
        { name: 'Standard Delivery', description: 'Delivery within 3-5 business days', deliveryTimeDays: 5, cost: 0 },
        { name: 'Express Delivery', description: 'Delivery within 1-2 business days', deliveryTimeDays: 2, cost: 299 },
        { name: 'Same Day Delivery', description: 'Same day delivery available in select areas', deliveryTimeDays: 0, cost: 799 },
      ];
      
      for (const option of deliveryOptions) {
        await client.query(
          `INSERT INTO delivery_settings (name, description, delivery_time_days, cost, is_active)
           VALUES ($1, $2, $3, $4, $5)`,
          [option.name, option.description, option.deliveryTimeDays, option.cost, true]
        );
        console.log(`[v0] ✓ Created delivery option: ${option.name}`);
      }
    } else {
      console.log('[v0] ℹ Delivery settings already exist, skipping...');
    }

    client.release();

    console.log('\n[v0] ═══════════════════════════════════════');
    console.log('[v0] Additional data seeding completed!');
    console.log('[v0] ═══════════════════════════════════════');
    console.log('[v0] Summary:');
    console.log('[v0]   • Banners: 3');
    console.log('[v0]   • Offers: 3');
    console.log('[v0]   • Policies: 4');
    console.log('[v0]   • Delivery Options: 3');
    console.log('[v0] ═══════════════════════════════════════\n');

  } catch (error) {
    console.error('[v0] Error seeding additional data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdditionalData();
