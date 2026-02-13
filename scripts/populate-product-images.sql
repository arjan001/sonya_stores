UPDATE products SET image_url = '/images/categories/womens-shoes.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'womens-shoes') AND image_url IS NULL;
UPDATE products SET image_url = '/images/categories/mens-shoes.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'mens-shoes') AND image_url IS NULL;
UPDATE products SET image_url = '/images/categories/sneakers.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'sneakers') AND image_url IS NULL;
UPDATE products SET image_url = '/images/categories/handbags.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'handbags') AND image_url IS NULL;
UPDATE products SET image_url = '/images/categories/home-decor.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'home-decor') AND image_url IS NULL;
UPDATE products SET image_url = '/images/categories/sandals.jpg' WHERE category_id = (SELECT id FROM categories WHERE slug = 'sandals') AND image_url IS NULL;
