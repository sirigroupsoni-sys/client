const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { 
      menuId, eventDate, eventTime, location, guests, 
      totalPrice, breakdown, customerName, customerEmail, customerPhone, deliveryAddress,
      selectedDishes, city
    } = req.body;
    
    const userId = req.user ? req.user.id : null;
    const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newBooking = await Booking.create({
      bookingId,
      user: userId,
      menu: menuId,
      eventDate,
      eventTime,
      location: location || deliveryAddress || 'Not Specified',
      customerName,
      customerEmail: customerEmail || (req.user ? req.user.email : null),
      customerPhone,
      deliveryAddress,
      guestCount: guests,
      city: city || 'Not Specified',
      selectedDishes: selectedDishes || [],
      pricingBreakdown: {
        subtotal: breakdown?.basePrice || totalPrice,
        tax: breakdown?.gst || 0,
        total: breakdown?.total || totalPrice
      },
      status: 'Pending',
      statusUpdates: [{
        status: 'Pending',
        message: 'Order placed successfully and is awaiting confirmation.'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: newBooking.bookingId
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userPhone = req.user.phone;

    const bookings = await Booking.find({ 
      $or: [
        { user: userId },
        { customerPhone: userPhone },
        { customerEmail: userEmail }
      ]
    })
      .populate('menu', 'name image')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('menu', 'name image');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      id, 
      { 
        status,
        $push: { 
          statusUpdates: { 
            status, 
            message: message || `Order status updated to ${status}` 
          } 
        } 
      }, 
      { new: true }
    );
    
    res.status(200).json({ success: true, message: 'Booking status updated', booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.trackBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId })
      .populate('menu', 'name image');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invalid Tracking ID' });
    }
    
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.duplicateBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const original = await Booking.findById(bookingId);
    
    if (!original) return res.status(404).json({ success: false, message: 'Original booking not found' });
    
    const newBookingId = `BK-DUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const duplicate = await Booking.create({
      bookingId: newBookingId,
      user: req.user.id,
      menu: original.menu,
      eventDate: new Date(), // Default to today, user can change later
      eventTime: original.eventTime,
      location: original.location,
      guestCount: original.guestCount,
      addons: original.addons,
      pricingBreakdown: original.pricingBreakdown,
      status: 'Pending'
    });
    
    res.status(201).json({ success: true, message: 'Order duplicated successfully', bookingId: duplicate.bookingId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Security check: Only the user who placed the order (or Admin) can cancel it
    // If user is guest (no user ID), we might need to check phone/email but for now, we assume if they hit this route from dashboard they are auth'd
    if (booking.user && booking.user.toString() !== req.user.id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'You do not have permission to cancel this booking' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Cannot cancel booking in ${booking.status} status. Please contact support.` });
    }

    booking.status = 'Cancelled';
    booking.statusUpdates.push({
      status: 'Cancelled',
      message: 'Order cancelled by user.'
    });

    await booking.save();
    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
