const db = require('../config/db');

exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      menuId, eventDate, eventTime, location, guestCount, 
      totalPrice, selectedDishIds, selectedAddonIds 
    } = req.body;
    
    const userId = req.user.id;
    const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Insert into bookings table
    const [bookingResult] = await connection.execute(
      'INSERT INTO bookings (booking_id, user_id, menu_id, event_date, event_time, location, guest_count, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [bookingId, userId, menuId, eventDate, eventTime, location, guestCount, totalPrice, 'Pending']
    );

    const internalId = bookingResult.insertId;

    // 2. Insert selected dishes
    if (selectedDishIds && selectedDishIds.length > 0) {
      for (const dishId of selectedDishIds) {
        await connection.execute(
          'INSERT INTO booking_dishes (booking_id, dish_id) VALUES (?, ?)',
          [internalId, dishId]
        );
      }
    }

    // 3. Insert selected add-ons
    if (selectedAddonIds && selectedAddonIds.length > 0) {
      for (const addonId of selectedAddonIds) {
        await connection.execute(
          'INSERT INTO booking_addons (booking_id, addon_id, quantity) VALUES (?, ?, ?)',
          [internalId, addonId, 1]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId
    });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [bookings] = await db.execute(
      `SELECT b.*, m.name as menu_name 
       FROM bookings b 
       LEFT JOIN menus m ON b.menu_id = m.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params; // internal ID or booking_id
    const [bookings] = await db.execute(
      'SELECT b.*, m.name as menu_name FROM bookings b LEFT JOIN menus m ON b.menu_id = m.id WHERE b.id = ? OR b.booking_id = ?',
      [id, id]
    );
    
    if (bookings.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    const booking = bookings[0];

    // Fetch dishes
    const [dishes] = await db.execute(
      'SELECT d.* FROM dishes d JOIN booking_dishes bd ON d.id = bd.dish_id WHERE bd.booking_id = ?',
      [booking.id]
    );

    // Fetch add-ons
    const [addons] = await db.execute(
      'SELECT a.*, ba.quantity FROM add_ons a JOIN booking_addons ba ON a.id = ba.addon_id WHERE ba.booking_id = ?',
      [booking.id]
    );

    res.status(200).json({
      success: true,
      booking: {
        ...booking,
        dishes,
        addons
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    
    res.status(200).json({ success: true, message: 'Booking status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
