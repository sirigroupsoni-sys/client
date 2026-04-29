const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { 
      menuId, eventDate, eventTime, location, guests, 
      totalPrice, breakdown, customerName, customerPhone, deliveryAddress
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
      customerPhone,
      deliveryAddress,
      guestCount: guests,
      pricingBreakdown: {
        subtotal: breakdown?.basePrice || totalPrice,
        tax: breakdown?.gst || 0,
        total: breakdown?.total || totalPrice
      },
      status: 'Pending'
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
    const bookings = await Booking.find({ user: userId })
      .populate('menu', 'name')
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
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    
    res.status(200).json({ success: true, message: 'Booking status updated', booking });
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
