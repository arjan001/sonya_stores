-- Seed offers and promotions for Sonya Stores
DELETE FROM offers WHERE title IN ('Summer Sale 2024', 'New Customer Discount', 'Flash Sale', 'Free Shipping', 'Weekend Special');
INSERT INTO offers (title, description, discount_percentage, applies_to, start_date, end_date, is_active) VALUES
('Summer Sale 2024', '50% off on selected items', 50, 'category', NOW(), NOW() + INTERVAL '30 days', true),
('New Customer Discount', 'Get 20% off on your first order', 20, 'all', NOW(), NOW() + INTERVAL '60 days', true),
('Flash Sale', 'Limited time offer - up to 40% off sneakers', 40, 'category', NOW(), NOW() + INTERVAL '7 days', true),
('Free Shipping', 'Free delivery on orders above KSh 5000', 0, 'all', NOW(), NOW() + INTERVAL '90 days', true),
('Weekend Special', 'Flat KSh 500 off on handbags', 0, 'category', NOW(), NOW() + INTERVAL '2 days', true);

-- Seed banners for Sonya Stores
DELETE FROM banners WHERE title IN ('Summer Collection', 'New Sneakers Arrivals', 'Premium Handbags', 'Home Decor Sale', 'Clearance Sale');
INSERT INTO banners (title, image_url, link_url, is_active) VALUES
('Summer Collection', '/images/banners/summer-collection.jpg', '/products?category=womens-shoes', true),
('New Sneakers Arrivals', '/images/banners/sneakers-new.jpg', '/products?category=sneakers', true),
('Premium Handbags', '/images/banners/handbags-banner.jpg', '/products?category=handbags', true),
('Home Decor Sale', '/images/banners/home-decor-sale.jpg', '/products?category=home-decor', true),
('Clearance Sale', '/images/banners/clearance.jpg', '/products?clearance=true', true);
