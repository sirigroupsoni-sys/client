const db = require('../config/db');

// --- Dashboard Analytics ---
exports.getAnalytics = async (req, res) => {
  try {
    const [totalBookings] = await db.execute('SELECT COUNT(*) as count FROM bookings');
    const [totalRevenue] = await db.execute('SELECT SUM(total_price) as total FROM bookings WHERE status != "Cancelled"');
    const [pendingBookings] = await db.execute('SELECT COUNT(*) as count FROM bookings WHERE status = "Pending"');
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "customer"');

    // Recent Bookings
    const [recentBookings] = await db.execute(
      `SELECT b.*, u.name as customer_name 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC LIMIT 5`
    );

    res.status(200).json({
      success: true,
      stats: {
        totalBookings: totalBookings[0].count,
        totalRevenue: totalRevenue[0].total || 0,
        pendingBookings: pendingBookings[0].count,
        userCount: userCount[0].count
      },
      recentBookings
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- User Management ---
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, name, email, role, phone, created_at FROM users');
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.status(200).json({ success: true, message: 'User role updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Menu Management ---
exports.createMenu = async (req, res) => {
  try {
    const { category_id, name, description, base_price_per_plate, min_guests } = req.body;
    const [result] = await db.execute(
      'INSERT INTO menus (category_id, name, description, base_price_per_plate, min_guests) VALUES (?, ?, ?, ?, ?)',
      [category_id, name, description, base_price_per_plate, min_guests]
    );
    res.status(201).json({ success: true, menuId: result.insertId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, base_price_per_plate, min_guests } = req.body;
    await db.execute(
      'UPDATE menus SET category_id = ?, name = ?, description = ?, base_price_per_plate = ?, min_guests = ? WHERE id = ?',
      [category_id, name, description, base_price_per_plate, min_guests, id]
    );
    res.status(200).json({ success: true, message: 'Menu updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM menus WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Menu deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.addDish = async (req, res) => {
  try {
    const { menu_id, name, description, image_url, type, course, price_impact } = req.body;
    await db.execute(
      'INSERT INTO dishes (menu_id, name, description, image_url, type, course, price_impact) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [menu_id, name, description, image_url, type, course, price_impact]
    );
    res.status(201).json({ success: true, message: 'Dish added' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, type, course, price_impact } = req.body;
    await db.execute(
      'UPDATE dishes SET name = ?, description = ?, image_url = ?, type = ?, course = ?, price_impact = ? WHERE id = ?',
      [name, description, image_url, type, course, price_impact, id]
    );
    res.status(200).json({ success: true, message: 'Dish updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM dishes WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Dish deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Booking Management ---
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, u.name as customer_name, m.name as menu_name 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       LEFT JOIN menus m ON b.menu_id = m.id 
       ORDER BY b.created_at DESC`
    );
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.assignManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;
    await db.execute('UPDATE bookings SET manager_id = ? WHERE id = ?', [managerId, id]);
    res.status(200).json({ success: true, message: 'Manager assigned' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
