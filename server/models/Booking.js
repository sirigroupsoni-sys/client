const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: false
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  guestCount: {
    type: Number,
    required: true
  },
  addons: [{
    name: String,
    price: Number
  }],
  pricingBreakdown: {
    subtotal: Number,
    tax: Number,
    total: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
