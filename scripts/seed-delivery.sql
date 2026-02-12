-- Seed delivery settings
INSERT INTO delivery_settings (name, cost, delivery_time_days, is_active)
VALUES
  ('Nairobi CBD - Pick Up', 0, 0, true),
  ('Nairobi CBD & Westlands', 200, 1, true),
  ('Rest of Nairobi', 300, 2, true),
  ('Kiambu / Thika / Machakos', 400, 3, true),
  ('Mombasa / Kisumu / Nakuru', 500, 4, true),
  ('Upcountry (Other Towns)', 600, 5, true)
ON CONFLICT DO NOTHING;
