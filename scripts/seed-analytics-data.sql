-- Seed page views for the last 30 days
INSERT INTO page_views (page_path, referrer, browser_name, device_type, country, created_at) VALUES
-- Homepage views
('/', 'direct', 'Chrome', 'Desktop', 'KE', NOW() - INTERVAL '5 days'),
('/', 'google.com', 'Chrome', 'Mobile', 'KE', NOW() - INTERVAL '4 days'),
('/', 'direct', 'Safari', 'Mobile', 'US', NOW() - INTERVAL '3 days'),
-- Shop views
('/shop', 'direct', 'Chrome', 'Desktop', 'KE', NOW() - INTERVAL '2 days'),
('/shop/women', 'google.com', 'Chrome', 'Desktop', 'KE', NOW() - INTERVAL '2 days'),
('/shop/men', 'kallittofashions.com', 'Chrome', 'Desktop', 'KE', NOW() - INTERVAL '1 day'),
('/shop/babyshop', 'direct', 'Safari', 'Mobile', 'US', NOW() - INTERVAL '1 day'),
-- Product pages
('/product/wide-leg-palazzo-jeans', 'google.com', 'Chrome', 'Desktop', 'KE', NOW()),
('/product/casual-sneakers', 'direct', 'Chrome', 'Mobile', 'KE', NOW()),
('/product/leather-handbag', 'v0.app', 'Firefox', 'Desktop', 'US', NOW()),
-- Checkout
('/checkout', 'direct', 'Chrome', 'Desktop', 'KE', NOW() - INTERVAL '6 hours'),
-- Terms
('/terms-of-service', 'direct', 'Chrome Desktop', 'Desktop', 'KE', NOW() - INTERVAL '12 hours'),
('/wishlist', 'direct', 'Safari', 'Mobile', 'KE', NOW() - INTERVAL '18 hours'),
('/track-order', 'google.com', 'Chrome', 'Desktop', 'US', NOW() - INTERVAL '1 day');

-- Seed traffic sources
DELETE FROM traffic_sources WHERE source IN ('Direct', 'kallittofashions.com', 'v0.app', 'www.google.com', 'vercel.com', 'vm-vhntgw23w2vnvn7xygcosm.vusercontent.net', 'vm-f5fw410430kh7vmbsbklnj.vusercontent.net');
INSERT INTO traffic_sources (source, page_views) VALUES
('Direct', 101),
('kallittofashions.com', 53),
('v0.app', 42),
('www.google.com', 7),
('vercel.com', 1),
('vm-vhntgw23w2vnvn7xygcosm.vusercontent.net', 2),
('vm-f5fw410430kh7vmbsbklnj.vusercontent.net', 1);

-- Seed browser stats
DELETE FROM browser_stats WHERE browser_name IN ('Chrome', 'Unknown', 'Chrome Headless', 'Mobile Safari', 'Mobile Chrome');
INSERT INTO browser_stats (browser_name, page_views) VALUES
('Chrome', 70),
('Unknown', 15),
('Chrome Headless', 12),
('Mobile Safari', 1),
('Mobile Chrome', 1);
