const db = require('../config/db');

// Calculate Price
exports.calculatePrice = async (req, res) => {
  const { menuId, guestCount, addonIds } = req.body;

  try {
    const [menus] = await db.execute('SELECT base_price_per_plate FROM menus WHERE id = ?', [menuId]);
    if (menus.length === 0) return res.status(404).json({ message: 'Menu not found' });

    const basePrice = parseFloat(menus[0].base_price_per_plate);
    let totalAddonsPrice = 0;

    if (addonIds && addonIds.length > 0) {
      const [addons] = await db.execute('SELECT price FROM add_ons WHERE id IN (' + addonIds.join(',') + ')');
      addons.forEach(addon => {
        totalAddonsPrice += parseFloat(addon.price);
      });
    }

    const subtotal = (basePrice * guestCount) + totalAddonsPrice;
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    res.json({
      success: true,
      breakdown: {
        basePricePerPlate: basePrice,
        guestCount,
        menuTotal: basePrice * guestCount,
        addonsTotal: totalAddonsPrice,
        subtotal,
        taxAmount,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Booking
exports.createBooking = async (req, res) => {
  const { 
    menuId, 
    eventDate, 
    eventTime, 
    location, 
    guestCount, 
    addonIds, 
    dishIds,
    totalPrice 
  } = req.body;
  const userId = req.user.id;
  const bookingId = 'MS' + Date.now();

  try {
    const [result] = await db.execute(
      'INSERT INTO bookings (booking_id, user_id, menu_id, event_date, event_time, location, guest_count, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [bookingId, userId, menuId, eventDate, eventTime, location, guestCount, totalPrice]
    );

    const bId = result.insertId;

    // Insert dishes
    if (dishIds && dishIds.length > 0) {
      for (const dishId of dishIds) {
        await db.execute('INSERT INTO booking_dishes (booking_id, dish_id) VALUES (?, ?)', [bId, dishId]);
      }
    }

    // Insert addons
    if (addonIds && addonIds.length > 0) {
      for (const addonId of addonIds) {
        await db.execute('INSERT INTO booking_addons (booking_id, addon_id) VALUES (?, ?)', [bId, addonId]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId,
      dbId: bId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, m.name as menu_name 
       FROM bookings b 
       JOIN menus m ON b.menu_id = m.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`, 
      [req.user.id]
    );
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
