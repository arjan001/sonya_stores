-- Seed Sonya Stores Demo Data

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM offers;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM banners;
DELETE FROM newsletter_subscribers;
DELETE FROM delivery_settings;
DELETE FROM policies;
DELETE FROM customers;

-- Seed Categories
INSERT INTO categories (id, name, slug, description, image_url, is_active, sort_order, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Shoes', 'shoes', 'Premium footwear collection', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', true, 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Accessories', 'accessories', 'Stylish accessories for every occasion', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Clothing', 'clothing', 'Trendy clothing collection', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500', true, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Home & Living', 'home-living', 'Home decor and essentials', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', true, 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Electronics', 'electronics', 'Latest gadgets and devices', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', true, 5, NOW(), NOW());

-- Seed Products
INSERT INTO products (id, name, slug, description, category_id, price, discount_price, cost_price, sku, stock_quantity, status, is_featured, is_new, is_on_sale, image_url, images, tags, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Premium Leather Shoes', 'premium-leather-shoes', 'High-quality genuine leather shoes perfect for formal and casual occasions', '550e8400-e29b-41d4-a716-446655440001', 4999, 3499, 1500, 'SHOES-001', 50, 'active', true, false, true, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", "https://images.unsplash.com/photo-1552062407-d4ca0944dec9?w=500"]', '["leather", "formal", "men", "shoes"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'Running Sneakers', 'running-sneakers', 'Comfortable and durable running shoes with advanced cushioning technology', '550e8400-e29b-41d4-a716-446655440001', 2999, 1999, 800, 'SHOES-002', 120, 'active', false, true, false, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]', '["sports", "running", "casual"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'Elegant Wrist Watch', 'elegant-wrist-watch', 'Sophisticated timepiece with stainless steel case and leather strap', '550e8400-e29b-41d4-a716-446655440002', 8999, 6499, 2500, 'ACC-001', 30, 'active', true, false, true, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500', '["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500"]', '["watch", "accessories", "luxury"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', 'Designer Sunglasses', 'designer-sunglasses', 'UV-protected designer sunglasses with polarized lenses', '550e8400-e29b-41d4-a716-446655440002', 2499, 1499, 600, 'ACC-002', 80, 'active', false, true, true, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', '["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"]', '["glasses", "summer", "fashion"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440005', 'Cotton T-Shirt', 'cotton-t-shirt', '100% organic cotton comfortable everyday t-shirt', '550e8400-e29b-41d4-a716-446655440003', 799, 499, 200, 'SHIRT-001', 200, 'active', false, false, false, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]', '["shirt", "cotton", "casual", "men"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440006', 'Winter Jacket', 'winter-jacket', 'Warm and stylish winter jacket with water-resistant material', '550e8400-e29b-41d4-a716-446655440003', 5999, 3999, 1800, 'JACKET-001', 45, 'active', true, true, true, 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500', '["https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500"]', '["jacket", "winter", "outerwear"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440007', 'Decorative Lamp', 'decorative-lamp', 'Modern LED decorative lamp for living spaces', '550e8400-e29b-41d4-a716-446655440004', 1999, 999, 400, 'HOME-001', 60, 'active', false, false, false, 'https://images.unsplash.com/photo-1565636192335-14c9e1c6bbaa?w=500', '["https://images.unsplash.com/photo-1565636192335-14c9e1c6bbaa?w=500"]', '["lamp", "lighting", "home"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440008', 'Wireless Earbuds', 'wireless-earbuds', 'Premium Bluetooth earbuds with noise cancellation', '550e8400-e29b-41d4-a716-446655440005', 3999, 2499, 1000, 'ELEC-001', 150, 'active', true, true, true, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]', '["electronics", "audio", "wireless"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440009', 'Portable Charger', 'portable-charger', 'Fast charging portable battery pack 20000mAh', '550e8400-e29b-41d4-a716-446655440005', 1499, 999, 350, 'ELEC-002', 200, 'active', false, false, true, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', '["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"]', '["charger", "power", "tech"]', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440010', 'Sports Backpack', 'sports-backpack', 'Durable waterproof sports backpack with ergonomic design', '550e8400-e29b-41d4-a716-446655440002', 1799, 999, 400, 'BAG-001', 90, 'active', false, true, false, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"]', '["backpack", "sports", "travel"]', NOW(), NOW());

-- Seed Banners
INSERT INTO banners (id, title, image_url, link_url, is_active, sort_order, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Summer Sale - 50% Off', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=300', '/products?sale=summer', true, 1, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', 'New Arrivals Collection', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=300', '/products?new=true', true, 2, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440003', 'Flash Deal - Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=300', '/products?category=electronics', true, 3, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440004', 'Free Shipping on Orders Over 5000', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=300', '/shipping', true, 4, NOW(), NOW());

-- Seed Offers
INSERT INTO offers (id, title, description, discount_percentage, discount_amount, applies_to, product_id, category_id, start_date, end_date, is_active, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Summer Shoes Sale', '30% off all shoes', 30, NULL, 'category', NULL, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440002', 'Electronics Flash Sale', '25% off electronics', 25, NULL, 'category', NULL, '550e8400-e29b-41d4-a716-446655440005', NOW(), NOW() + INTERVAL '7 days', true, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440003', 'Premium Leather Shoes Special', 'Save 1500 on leather shoes', NULL, 1500, 'product', '650e8400-e29b-41d4-a716-446655440001', NULL, NOW(), NOW() + INTERVAL '15 days', true, NOW(), NOW());

-- Seed Newsletter Subscribers
INSERT INTO newsletter_subscribers (id, email, name, subscribed_at, is_active) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', NOW(), true),
('950e8400-e29b-41d4-a716-446655440002', 'jane@example.com', 'Jane Smith', NOW(), true),
('950e8400-e29b-41d4-a716-446655440003', 'alex@example.com', 'Alex Johnson', NOW(), true),
('950e8400-e29b-41d4-a716-446655440004', 'sarah@example.com', 'Sarah Williams', NOW(), true),
('950e8400-e29b-41d4-a716-446655440005', 'mike@example.com', 'Mike Brown', NOW(), true);

-- Seed Delivery Settings
INSERT INTO delivery_settings (id, name, description, delivery_time_days, cost, is_active, created_at, updated_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Standard Delivery', 'Delivery in 3-5 business days', 5, 200, true, NOW(), NOW()),
('a50e8400-e29b-41d4-a716-446655440002', 'Express Delivery', 'Delivery in 1-2 business days', 2, 500, true, NOW(), NOW()),
('a50e8400-e29b-41d4-a716-446655440003', 'Overnight Delivery', 'Next day delivery', 1, 1000, true, NOW(), NOW()),
('a50e8400-e29b-41d4-a716-446655440004', 'Free Delivery', 'Free for orders over 5000', 7, 0, true, NOW(), NOW());

-- Seed Policies
INSERT INTO policies (id, type, title, slug, content, is_published, created_at, updated_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'privacy', 'Privacy Policy', 'privacy-policy', 'Your privacy is important to us. This policy outlines how we collect, use, and protect your personal data. We are committed to safeguarding your information and maintaining transparency in all our operations.', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440002', 'terms', 'Terms of Service', 'terms-of-service', 'By using Sonya Stores, you agree to these terms and conditions. Our service is provided as-is, and users are responsible for their interactions and transactions on our platform. We reserve the right to update these terms at any time.', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440003', 'refund', 'Refund & Return Policy', 'refund-policy', 'We offer a 30-day money-back guarantee on all products. Items must be in original condition with all packaging. Contact our support team to initiate a return or refund request.', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440004', 'shipping', 'Shipping Policy', 'shipping-policy', 'We ship to all major cities within Kenya. Standard shipping takes 3-5 business days. Express and overnight options are available. All orders are insured and tracked.', true, NOW(), NOW());

-- Seed Settings (Update existing or insert)
INSERT INTO settings (id, key, value, category, description, created_at, updated_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'store_name', '"Sonya Stores"', 'general', 'Name of the store', NOW(), NOW()),
('c50e8400-e29b-41d4-a716-446655440002', 'store_email', '"support@sonyastores.com"', 'general', 'Store contact email', NOW(), NOW()),
('c50e8400-e29b-41d4-a716-446655440003', 'store_phone', '"+254712345678"', 'general', 'Store contact phone', NOW(), NOW()),
('c50e8400-e29b-41d4-a716-446655440004', 'currency', '"KSh"', 'general', 'Store currency', NOW(), NOW()),
('c50e8400-e29b-41d4-a716-446655440005', 'tax_rate', '16', 'financial', 'Tax rate percentage', NOW(), NOW()),
('c50e8400-e29b-41d4-a716-446655440006', 'min_order_value', '500', 'financial', 'Minimum order value', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Seed Sample Customers
INSERT INTO customers (id, first_name, last_name, email, phone, address, city, zip_code, country, created_at, updated_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', 'John', 'Doe', 'john@example.com', '0712345678', '123 Main Street', 'Nairobi', '00100', 'Kenya', NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440002', 'Jane', 'Smith', 'jane@example.com', '0712345679', '456 Oak Avenue', 'Mombasa', '80100', 'Kenya', NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440003', 'Alex', 'Johnson', 'alex@example.com', '0712345680', '789 Pine Road', 'Kisumu', '40100', 'Kenya', NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440004', 'Sarah', 'Williams', 'sarah@example.com', '0712345681', '321 Elm Street', 'Nakuru', '20100', 'Kenya', NOW(), NOW());

-- Seed Sample Orders
INSERT INTO orders (id, order_number, customer_id, total_amount, discount_amount, tax_amount, shipping_amount, status, payment_status, shipping_address, notes, created_at, updated_at) VALUES
('e50e8400-e29b-41d4-a716-446655440001', 'ORD-001', 'd50e8400-e29b-41d4-a716-446655440001', 8999, 1500, 1344, 200, 'completed', 'completed', '123 Main Street, Nairobi', 'Delivered successfully', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
('e50e8400-e29b-41d4-a716-446655440002', 'ORD-002', 'd50e8400-e29b-41d4-a716-446655440002', 4999, 0, 750, 200, 'completed', 'completed', '456 Oak Avenue, Mombasa', 'Satisfied customer', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),
('e50e8400-e29b-41d4-a716-446655440003', 'ORD-003', 'd50e8400-e29b-41d4-a716-446655440003', 6499, 1000, 974, 500, 'processing', 'pending', '789 Pine Road, Kisumu', 'Awaiting payment confirmation', NOW() - INTERVAL '5 days', NOW());

-- Seed Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal, created_at) VALUES
('f50e8400-e29b-41d4-a716-446655440001', 'e50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 1, 4999, 4999, NOW() - INTERVAL '30 days'),
('f50e8400-e29b-41d4-a716-446655440002', 'e50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440008', 1, 3999, 3999, NOW() - INTERVAL '30 days'),
('f50e8400-e29b-41d4-a716-446655440003', 'e50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 2, 2499, 4999, NOW() - INTERVAL '15 days'),
('f50e8400-e29b-41d4-a716-446655440004', 'e50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', 1, 5999, 5999, NOW() - INTERVAL '5 days');
