-- Seed categories for Sonya Stores
INSERT INTO categories (name, slug, description, image_url, is_active, sort_order) VALUES
('Women''s Shoes', 'womens-shoes', 'Premium collection of women''s shoes including heels, flats, and sneakers', '/images/categories/womens-shoes.jpg', true, 1),
('Men''s Shoes', 'mens-shoes', 'Quality men''s footwear for all occasions', '/images/categories/mens-shoes.jpg', true, 2),
('Sneakers', 'sneakers', 'Comfortable and stylish sneakers for everyday wear', '/images/categories/sneakers.jpg', true, 3),
('Handbags', 'handbags', 'Designer and casual handbags for women', '/images/categories/handbags.jpg', true, 4),
('Home Decor', 'home-decor', 'Beautiful home décor items to enhance your living space', '/images/categories/home-decor.jpg', true, 5),
('Sandals', 'sandals', 'Casual and formal sandals for all ages', '/images/categories/sandals.jpg', true, 6)
ON CONFLICT (slug) DO NOTHING;
