-- Comprehensive product seed script with diverse products across all categories
-- Includes women's shoes, men's shoes, sneakers, handbags, home decor, and sandals

-- First, ensure all categories exist
INSERT INTO categories (name, slug, image_url, is_active, sort_order) VALUES
('Womens Shoes', 'womens-shoes', 'https://images.unsplash.com/photo-1543163521-9efcc06b90d2?w=500&h=500&fit=crop', true, 1),
('Mens Shoes', 'mens-shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', true, 2),
('Sneakers', 'sneakers', 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=500&fit=crop', true, 3),
('Handbags', 'handbags', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', true, 4),
('Home Decor', 'home-decor', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop', true, 5),
('Sandals', 'sandals', 'https://images.unsplash.com/photo-1469095806926-4d80f8accc4e?w=500&h=500&fit=crop', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert comprehensive products
WITH cats AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (name, slug, description, price, discount_price, is_on_sale, stock_quantity, category_id, image_url, images, tags, is_featured, is_new, status)
SELECT
  -- Women's Shoes
  'Classic Black Pumps', 'classic-black-pumps', 'Elegant black leather pumps perfect for professional settings and evening wear. Features a comfortable 3-inch heel and timeless design that works with any outfit.',
  5200, 3900, true, 25, (SELECT id FROM cats WHERE slug = 'womens-shoes'),
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"]'::jsonb,
  '["pumps", "black", "leather", "professional", "women"]'::jsonb,
  true, false, 'active'::product_status

UNION ALL SELECT 'White Sneaker Flats', 'white-sneaker-flats', 'Comfortable casual white sneaker flats for everyday wear. Lightweight sole and soft cushioning make them perfect for walking and all-day wear.',
  3800, 2850, true, 30, (SELECT id FROM cats WHERE slug = 'womens-shoes'),
  'https://images.unsplash.com/photo-1572830165842-1aa18632e71f?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1572830165842-1aa18632e71f"]'::jsonb,
  '["flats", "white", "sneaker", "casual", "women", "comfortable"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Rose Gold Heels', 'rose-gold-heels', 'Stunning rose gold metallic heels perfect for parties and formal events. Glamorous finish with a sturdy 4-inch heel for all-night comfort.',
  7800, 5850, true, 12, (SELECT id FROM cats WHERE slug = 'womens-shoes'),
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a"]'::jsonb,
  '["heels", "rose-gold", "metallic", "party", "formal", "women"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Leopard Print Flats', 'leopard-print-flats', 'Bold leopard print ballet flats that add a pop of style to casual outfits. Soft suede construction with a comfortable fit.',
  3500, 2450, true, 18, (SELECT id FROM cats WHERE slug = 'womens-shoes'),
  'https://images.unsplash.com/photo-1595777712802-e2e2671ba771?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1595777712802-e2e2671ba771"]'::jsonb,
  '["flats", "leopard", "print", "casual", "women"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Red Patent Pumps', 'red-patent-pumps', 'Classic red patent leather pumps for a timeless look. High shine finish and elegant silhouette perfect for any occasion.',
  6200, 4650, true, 15, (SELECT id FROM cats WHERE slug = 'womens-shoes'),
  'https://images.unsplash.com/photo-1599643478112-88a710eb63d4?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1599643478112-88a710eb63d4"]'::jsonb,
  '["pumps", "red", "patent", "classic", "women"]'::jsonb,
  true, false, 'active'::product_status

-- Men's Shoes
UNION ALL SELECT 'Black Oxford Shoes', 'black-oxford-shoes', 'Sophisticated black oxford shoes perfect for business and formal events. Premium leather construction with cushioned insoles for all-day comfort.',
  8900, 6675, true, 20, (SELECT id FROM cats WHERE slug = 'mens-shoes'),
  'https://images.unsplash.com/photo-1614610535308-eb5400a7d147?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1614610535308-eb5400a7d147"]'::jsonb,
  '["oxfords", "black", "leather", "business", "formal", "men"]'::jsonb,
  true, false, 'active'::product_status

UNION ALL SELECT 'Brown Loafers', 'brown-loafers', 'Comfortable brown leather loafers suitable for both business casual and weekend wear. Timeless design with practical versatility.',
  5900, 4425, true, 22, (SELECT id FROM cats WHERE slug = 'mens-shoes'),
  'https://images.unsplash.com/photo-1608256621200-91ebc9967ba7?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1608256621200-91ebc9967ba7"]'::jsonb,
  '["loafers", "brown", "leather", "casual", "men"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Tan Leather Boots', 'tan-leather-boots', 'Rugged tan leather boots perfect for adventure and casual wear. Durable construction with excellent ankle support and traction.',
  9500, 7125, true, 10, (SELECT id FROM cats WHERE slug = 'mens-shoes'),
  'https://images.unsplash.com/photo-1608256621200-91ebc9967ba7?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1608256621200-91ebc9967ba7"]'::jsonb,
  '["boots", "tan", "leather", "adventure", "men"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Navy Dress Shoes', 'navy-dress-shoes', 'Elegant navy dress shoes for professional and formal occasions. Premium leather with a sleek design that complements any suit.',
  7200, 5400, true, 16, (SELECT id FROM cats WHERE slug = 'mens-shoes'),
  'https://images.unsplash.com/photo-1624373460897-c18df8bfb0ba?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1624373460897-c18df8bfb0ba"]'::jsonb,
  '["dress", "navy", "leather", "formal", "men"]'::jsonb,
  true, false, 'active'::product_status

-- Sneakers
UNION ALL SELECT 'Air Max White Sneakers', 'air-max-white-sneakers', 'Classic white air max sneakers with excellent cushioning and breathability. Perfect for sports, gym, and casual daily wear.',
  8200, 5740, true, 35, (SELECT id FROM cats WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]'::jsonb,
  '["sneakers", "white", "air-max", "sports", "casual"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Black High-Top Sneakers', 'black-high-top-sneakers', 'Stylish black high-top sneakers combining comfort with edgy street style. Reinforced ankle support for basketball and skateboarding.',
  6900, 5175, true, 28, (SELECT id FROM cats WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]'::jsonb,
  '["sneakers", "black", "high-top", "street", "sports"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Colorful Running Sneakers', 'colorful-running-sneakers', 'Vibrant multi-color running sneakers with advanced cushioning technology. Lightweight and breathable for marathon-distance running.',
  9800, 7350, true, 18, (SELECT id FROM cats WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1612521534857-c2c2a4f83f60?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1612521534857-c2c2a4f83f60"]'::jsonb,
  '["sneakers", "running", "colorful", "sports", "athletic"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Casual Canvas Sneakers', 'casual-canvas-sneakers', 'Relaxed canvas sneakers in timeless colors. Perfect for everyday wear with a laid-back, comfortable aesthetic.',
  3200, 2240, true, 40, (SELECT id FROM cats WHERE slug = 'sneakers'),
  'https://images.unsplash.com/photo-1608256621200-91ebc9967ba7?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1608256621200-91ebc9967ba7"]'::jsonb,
  '["sneakers", "canvas", "casual", "comfortable"]'::jsonb,
  false, true, 'active'::product_status

-- Handbags (already has 8, adding more)
UNION ALL SELECT 'Quilted Black Shoulder Bag', 'quilted-black-shoulder', 'Elegant quilted black shoulder bag with signature quilting pattern. Spacious interior with multiple pockets for organization.',
  12000, 9000, true, 14, (SELECT id FROM cats WHERE slug = 'handbags'),
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"]'::jsonb,
  '["handbag", "quilted", "black", "shoulder", "luxury"]'::jsonb,
  true, false, 'active'::product_status

UNION ALL SELECT 'Woven Summer Tote', 'woven-summer-tote', 'Light and breezy woven tote perfect for beach trips and summer outings. Includes an inner zippered pocket for valuables.',
  4200, 3150, true, 26, (SELECT id FROM cats WHERE slug = 'handbags'),
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"]'::jsonb,
  '["handbag", "woven", "summer", "tote", "beach"]'::jsonb,
  false, true, 'active'::product_status

-- Home Decor items
UNION ALL SELECT 'Modern Wall Shelves', 'modern-wall-shelves', 'Sleek floating wall shelves perfect for displaying books, plants, and decor. Minimalist design complements any modern interior.',
  4500, 3375, true, 32, (SELECT id FROM cats WHERE slug = 'home-decor'),
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1578500494198-246f612d03b3"]'::jsonb,
  '["shelves", "wall", "modern", "decor", "home"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Ceramic Plant Pots Set', 'ceramic-plant-pots', 'Beautiful set of 3 ceramic plant pots in neutral tones. Perfect for succulents, herbs, or small flowering plants.',
  2800, 2100, true, 45, (SELECT id FROM cats WHERE slug = 'home-decor'),
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1578500494198-246f612d03b3"]'::jsonb,
  '["pots", "ceramic", "plants", "home", "decor"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Abstract Canvas Wall Art', 'abstract-canvas-art', 'Large abstract canvas artwork that adds modern elegance to any room. Ready to hang with secure hardware included.',
  6800, 5100, true, 8, (SELECT id FROM cats WHERE slug = 'home-decor'),
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1578500494198-246f612d03b3"]'::jsonb,
  '["art", "canvas", "abstract", "wall", "home"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Wooden Coffee Table', 'wooden-coffee-table', 'Rustic wooden coffee table with open shelving for storage. Crafted from sustainable hardwood with natural finish.',
  18500, 13875, true, 6, (SELECT id FROM cats WHERE slug = 'home-decor'),
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1578500494198-246f612d03b3"]'::jsonb,
  '["table", "wood", "furniture", "rustic", "home"]'::jsonb,
  true, false, 'active'::product_status

-- Sandals
UNION ALL SELECT 'Brown Leather Sandals', 'brown-leather-sandals', 'Classic brown leather sandals with adjustable straps for a perfect fit. Comfortable for everyday wear and travel.',
  3900, 2925, true, 35, (SELECT id FROM cats WHERE slug = 'sandals'),
  'https://images.unsplash.com/photo-1469095806926-4d80f8accc4e?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1469095806926-4d80f8accc4e"]'::jsonb,
  '["sandals", "brown", "leather", "casual", "summer"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'White Flip Flops', 'white-flip-flops', 'Simple white flip-flops perfect for beach and casual settings. Lightweight and easy to pack for travels.',
  1800, 1260, true, 50, (SELECT id FROM cats WHERE slug = 'sandals'),
  'https://images.unsplash.com/photo-1469095806926-4d80f8accc4e?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1469095806926-4d80f8accc4e"]'::jsonb,
  '["flip-flops", "white", "beach", "casual"]'::jsonb,
  false, true, 'active'::product_status

UNION ALL SELECT 'Strappy Gold Sandals', 'strappy-gold-sandals', 'Glamorous gold strappy sandals perfect for evening events and parties. Metallic finish with comfortable cushioned footbed.',
  5500, 4125, true, 20, (SELECT id FROM cats WHERE slug = 'sandals'),
  'https://images.unsplash.com/photo-1469095806926-4d80f8accc4e?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1469095806926-4d80f8accc4e"]'::jsonb,
  '["sandals", "gold", "strappy", "evening", "formal"]'::jsonb,
  true, true, 'active'::product_status

UNION ALL SELECT 'Orthopedic Black Sandals', 'orthopedic-black-sandals', 'Comfortable orthopedic sandals with arch support and cushioning. Ideal for people who spend long hours on their feet.',
  6200, 4650, true, 25, (SELECT id FROM cats WHERE slug = 'sandals'),
  'https://images.unsplash.com/photo-1469095806926-4d80f8accc4e?w=500&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1469095806926-4d80f8accc4e"]'::jsonb,
  '["sandals", "black", "orthopedic", "comfort", "support"]'::jsonb,
  true, false, 'active'::product_status
ON CONFLICT DO NOTHING;
