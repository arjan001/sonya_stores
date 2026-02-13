-- Get first 3 customers and insert orders for them
-- If no customers exist, create them first
DO $$ 
DECLARE
  cust1_id uuid;
  cust2_id uuid;
  cust3_id uuid;
BEGIN
  -- Try to get existing customers, or create new ones
  SELECT id INTO cust1_id FROM customers WHERE email = 'john@example.com' LIMIT 1;
  IF cust1_id IS NULL THEN
    INSERT INTO customers (first_name, last_name, email, phone, address, city, country, zip_code)
    VALUES ('John', 'Doe', 'john@example.com', '+254712345678', '123 Main St', 'Nairobi', 'KE', '00100')
    RETURNING id INTO cust1_id;
  END IF;

  SELECT id INTO cust2_id FROM customers WHERE email = 'jane@example.com' LIMIT 1;
  IF cust2_id IS NULL THEN
    INSERT INTO customers (first_name, last_name, email, phone, address, city, country, zip_code)
    VALUES ('Jane', 'Smith', 'jane@example.com', '+254787654321', '456 Oak Ave', 'Mombasa', 'KE', '80100')
    RETURNING id INTO cust2_id;
  END IF;

  SELECT id INTO cust3_id FROM customers WHERE email = 'bob@example.com' LIMIT 1;
  IF cust3_id IS NULL THEN
    INSERT INTO customers (first_name, last_name, email, phone, address, city, country, zip_code)
    VALUES ('Bob', 'Johnson', 'bob@example.com', '+254702468135', '789 Pine Rd', 'Kisumu', 'KE', '40100')
    RETURNING id INTO cust3_id;
  END IF;

  -- Insert sample orders
  INSERT INTO orders (order_number, customer_id, total_amount, shipping_amount, tax_amount, status, payment_status, shipping_address, created_at, updated_at)
  VALUES
    ('ORD-2025-001', cust1_id, 5490.00, 500.00, 490.00, 'pending', 'pending', '123 Main St, Nairobi', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ('ORD-2025-002', cust1_id, 12990.00, 1500.00, 1490.00, 'processing', 'completed', '123 Main St, Nairobi', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('ORD-2025-003', cust2_id, 7980.00, 1000.00, 480.00, 'completed', 'completed', '456 Oak Ave, Mombasa', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),
    ('ORD-2025-004', cust3_id, 3290.00, 300.00, 190.00, 'pending', 'pending', '789 Pine Rd, Kisumu', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('ORD-2025-005', cust2_id, 9870.00, 1000.00, 370.00, 'cancelled', 'pending', '456 Oak Ave, Mombasa', NOW(), NOW())
  ON CONFLICT (order_number) DO NOTHING;
END $$;
