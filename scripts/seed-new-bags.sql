-- Insert 8 new bag products (5 women's handbags + 3 men's bags)
-- These are added to the handbags category (bags category)

-- First, verify the handbags category exists, if not create it
INSERT INTO categories (name, slug, image_url, is_active, sort_order)
VALUES ('Handbags & Bags', 'handbags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Get category ID for inserting products
WITH category_id AS (
  SELECT id FROM categories WHERE slug = 'handbags' LIMIT 1
)

-- Insert 5 Women's Handbags
INSERT INTO products (
  name, slug, description, price, discount_price, is_on_sale, stock_quantity,
  category_id, image_url, images, tags, is_featured, is_new, status
)
SELECT
  'Luxury Cognac Crossbody Bag', 'luxury-cognac-crossbody', 
  'Premium leather crossbody handbag perfect for the modern woman. Features cognac-colored genuine leather with an adjustable chain strap and gold hardware accents. Ideal for both professional settings and casual outings. Compact design holds essentials elegantly.',
  8500, 7225, true, 15,
  (SELECT id FROM categories WHERE slug = 'handbags'), 
  '/products/womens-handbag-crossbody.jpg',
  '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa", "/products/womens-handbag-crossbody.jpg"]'::jsonb,
  '["luxury", "leather", "crossbody", "gold-hardware", "cognac", "women", "elegant", "professional"]'::jsonb,
  true, true,   'active'::product_status::product_status
UNION ALL
SELECT
  'Vintage Tan Leather Tote Bag', 'vintage-tan-leather-tote',
  'Timeless vintage-inspired tote crafted from premium tan leather. Spacious capacity perfect for work, travel, or daily errands. Features durable double handles and authentic worn leather texture for character and charm. A wardrobe essential that ages beautifully.',
  7200, 5760, true, 12,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/womens-handbag-vintage-tote.jpg',
  '["https://images.unsplash.com/photo-1544434606-913884894f6b", "/products/womens-handbag-vintage-tote.jpg"]'::jsonb,
  '["vintage", "tote", "leather", "spacious", "tan", "women", "boho", "timeless"]'::jsonb,
  true, true,   'active'::product_status::product_status
UNION ALL
SELECT
  'Minimalist Charcoal Shoulder Bag', 'minimalist-charcoal-shoulder',
  'Contemporary shoulder bag in soft charcoal gray leather with clean, minimalist design. Features adjustable shoulder strap and structured silhouette for a modern aesthetic. Perfect for professionals and style-conscious individuals who prefer understated elegance.',
  6800, 5440, true, 18,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/womens-handbag-minimalist.jpg',
  '["https://images.unsplash.com/photo-1594938298603-c8148c4dae35", "/products/womens-handbag-minimalist.jpg"]'::jsonb,
  '["minimalist", "shoulder", "gray", "charcoal", "women", "contemporary", "modern", "structured"]'::jsonb,
  false, true,   'active'::product_status::product_status
UNION ALL
SELECT
  'Bohemian Macramé Woven Bag', 'bohemian-macrame-woven',
  'Relaxed boho-chic woven handbag in natural beige and cream tones with authentic macramé details and fringe trim. Lightweight and perfect for summer adventures. Handcrafted aesthetic brings artisanal charm to any outfit. Great for beach, festival, or casual wear.',
  4900, 3920, true, 20,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/womens-handbag-bohemian.jpg',
  '["https://images.unsplash.com/photo-1606941622874-e8904cbf17a0", "/products/womens-handbag-bohemian.jpg"]'::jsonb,
  '["bohemian", "woven", "macramé", "fringe", "boho", "women", "summer", "handcrafted", "festival"]'::jsonb,
  false, true,   'active'::product_status
UNION ALL
SELECT
  'Professional Executive Briefcase Bag', 'professional-executive-briefcase',
  'Sophisticated black leather briefcase bag designed for the modern executive. Features dedicated laptop compartment, organized interior pockets, and structured design for a polished look. Premium construction ensures longevity. Perfect for business travel and professional settings.',
  11500, 9200, true, 10,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/womens-handbag-professional.jpg',
  '["https://images.unsplash.com/photo-1548127222-cb24ba15dd60", "/products/womens-handbag-professional.jpg"]'::jsonb,
  '["professional", "briefcase", "business", "laptop", "executive", "women", "formal", "structured", "luxury"]'::jsonb,
  true, false,   'active'::product_status
UNION ALL
-- Insert 3 Men's Bags
SELECT
  'Olive Canvas Messenger Bag', 'olive-canvas-messenger',
  'Rugged and practical men''s messenger bag in waxed olive canvas with premium leather accents. Features adjustable shoulder strap and utility-style pockets perfect for everyday carry. Vintage aesthetic meets modern functionality—ideal for commuters and adventurers.',
  5500, 4400, true, 16,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/mens-bag-canvas-messenger.jpg',
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "/products/mens-bag-canvas-messenger.jpg"]'::jsonb,
  '["messenger", "canvas", "waxed", "men", "leather", "vintage", "utility", "adventure", "commute"]'::jsonb,
  true, true,   'active'::product_status
UNION ALL
SELECT
  'Premium Leather Backpack for Men', 'premium-leather-backpack-men',
  'Premium distressed brown leather backpack combining vintage charm with modern functionality. Features spacious main compartment, dedicated laptop section, and comfortable padded straps. Perfect for travel, work, and weekend adventures. Rich patina develops with age and use.',
  12800, 10240, true, 11,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/mens-bag-leather-backpack.jpg',
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "/products/mens-bag-leather-backpack.jpg"]'::jsonb,
  '["backpack", "leather", "vintage", "distressed", "men", "travel", "laptop", "adventure", "premium"]'::jsonb,
  true, true,   'active'::product_status
UNION ALL
SELECT
  'Black & Gray Sports Duffel Bag', 'black-gray-sports-duffel',
  'Spacious and durable sports duffel bag in stylish black and gray color-blocking. Waterproof material protects gear from the elements. Multiple compartments and reinforced handles make it ideal for gym sessions, weekend trips, or sports activities. Athletic meets practical design.',
  3800, 2660, true, 22,
  (SELECT id FROM categories WHERE slug = 'handbags'),
  '/products/mens-bag-duffel.jpg',
  '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "/products/mens-bag-duffel.jpg"]'::jsonb,
  '["duffel", "sports", "gym", "waterproof", "men", "travel", "athletic", "weekend", "spacious"]'::jsonb,
  false, true,   'active'::product_status;
