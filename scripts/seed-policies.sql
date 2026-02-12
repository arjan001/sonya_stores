-- Seed policies for Sonya Stores
INSERT INTO policies (type, title, slug, content, is_published) VALUES
('privacy', 'Privacy Policy', 'privacy-policy', 
'Sonya Stores respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you visit our website or make a purchase. We collect information including your name, email, address, and payment details to process your orders and improve our services. Your data is stored securely and is never shared with third parties without your consent. You have the right to access, update, or delete your personal information at any time by contacting us.', true),

('terms', 'Terms of Service', 'terms-of-service',
'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Sonya Stores reserves the right to modify these terms at any time. Your continued use of the site following any changes constitutes your acceptance of new terms. All products are sold as is. We do not warranty that the quality of any product meets your expectations. We reserve the right to refuse service to anyone for any reason at any time. Your use of this site is at your sole risk.', true),

('refund', 'Refund & Return Policy', 'refund-return-policy',
'We want you to be completely satisfied with your purchase. If you are not satisfied with your order, you can return it within 14 days for a full refund or exchange. Items must be in original condition with all packaging and labels intact. Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Shipping costs are non-refundable unless the return is due to our error or a defective item. To initiate a return, please contact our customer service team.', true),

('shipping', 'Shipping Policy', 'shipping-policy',
'We offer multiple shipping options to meet your needs. Standard delivery takes 3-5 business days within Nairobi and up to 7 days for upcountry areas. Express delivery is available for 1-2 business days within Nairobi CBD for an additional fee. Shipping costs are calculated at checkout based on your location and the weight of your order. Orders above KSh 5000 qualify for free standard delivery. We ship Monday to Friday and do not process orders on weekends and public holidays. Once your order ships, you will receive a tracking number via email.', true),

('about', 'About Us', 'about-us',
'Sonya Stores is a premium online marketplace dedicated to bringing you quality shoes and home décor items. Founded in 2020, we have grown to become a trusted destination for fashion-forward individuals and home enthusiasts across Kenya. We carefully curate our product selection to ensure we offer only the finest quality items at competitive prices. Our mission is to make premium shopping accessible and convenient for everyone. We pride ourselves on excellent customer service and fast, reliable delivery. Thank you for choosing Sonya Stores!', true)
ON CONFLICT (slug) DO NOTHING;
