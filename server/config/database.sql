CREATE DATABASE IF NOT EXISTS ms_caterers;
USE ms_caterers;

-- Roles: 'customer', 'admin', 'manager', 'employee'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'manager', 'employee') DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price_per_plate DECIMAL(10, 2) NOT NULL,
    min_guests INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    name VARCHAR(255) NOT NULL,
    type ENUM('Veg', 'Non-Veg', 'Jain') DEFAULT 'Veg',
    course ENUM('Starter', 'Main Course', 'Dessert', 'Beverage', 'Other') DEFAULT 'Main Course',
    price_impact DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

CREATE TABLE add_ons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Staff', 'Equipment', 'Live Counter') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    menu_id INT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location TEXT NOT NULL,
    guest_count INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    manager_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE booking_dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    dish_id INT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE booking_addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    addon_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES add_ons(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    transaction_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Success', 'Failed', 'Refunded') DEFAULT 'Pending',
    provider VARCHAR(50) DEFAULT 'Razorpay',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    employee_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'Started', 'Completed') DEFAULT 'Pending',
    due_date TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL
);
