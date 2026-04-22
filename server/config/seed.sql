USE ms_caterers;

-- Seed Categories
INSERT INTO categories (name, description, image_url) VALUES 
('Wedding', 'Grand celebration catering for your big day.', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'),
('Birthday', 'Fun and delicious menus for birthday parties.', 'https://images.unsplash.com/photo-1530103862676-fa8c9d3433b9?w=800'),
('Corporate', 'Professional catering for office events and meetings.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800');

-- Seed Menus
INSERT INTO menus (category_id, name, description, base_price_per_plate, min_guests) VALUES 
(1, 'Royal Wedding Buffet', 'A premium selection of over 20 dishes.', 850.00, 100),
(1, 'Elegant Reception', 'Sophisticated multi-cuisine experience.', 650.00, 50),
(2, 'Kids Party Box', 'Simple, tasty and child-friendly options.', 350.00, 20),
(3, 'Executive Lunch', 'Balanced meal for business professionals.', 450.00, 15);

-- Seed Dishes
INSERT INTO dishes (menu_id, name, type, course, price_impact) VALUES 
(1, 'Paneer Butter Masala', 'Veg', 'Main Course', 0.00),
(1, 'Chicken Biryani', 'Non-Veg', 'Main Course', 50.00),
(1, 'Gulab Jamun', 'Veg', 'Dessert', 0.00),
(1, 'Hara Bhara Kabab', 'Veg', 'Starter', 0.00);

-- Seed Add-ons
INSERT INTO add_ons (name, type, price, description) VALUES 
('Live Pasta Counter', 'Live Counter', 5000.00, 'Freshly cooked pasta with choice of sauces.'),
('Uniformed Servers', 'Staff', 2000.00, 'Professional serving staff (per 50 guests).'),
('Premium Cutlery', 'Equipment', 1500.00, 'Fine bone china and silver-plated cutlery.');

-- Seed Admin User (password: admin123)
-- Hash: $2a$10$w3O1m6GqH8W66hB6H1g1e.t6vY1nZ2mO3QvR4S5T6U7V8W9X0Y1Z (Actually bcrypt it)
INSERT INTO users (name, email, password, role) VALUES 
('Super Admin', 'admin@mscaterers.com', '$2a$10$vI8qP9V9yXvG.8k8z/7/Ue1S3mR2tY.8Y.8Y.8Y.8Y.8Y.8Y.8Y.8Y', 'admin');
