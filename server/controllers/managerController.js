const db = require('../config/db');

exports.getAssignedBookings = async (req, res) => {
  try {
    const managerId = req.user.id;
    const [bookings] = await db.execute(
      `SELECT b.*, u.name as customer_name, m.name as menu_name 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       LEFT JOIN menus m ON b.menu_id = m.id 
       WHERE b.manager_id = ?`,
      [managerId]
    );
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { booking_id, employee_id, title, description, due_date } = req.body;
    await db.execute(
      'INSERT INTO tasks (booking_id, employee_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)',
      [booking_id, employee_id, title, description, due_date]
    );
    res.status(201).json({ success: true, message: 'Task assigned to employee' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Event status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
