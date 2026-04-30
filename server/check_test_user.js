const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const checkBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    const b = await Booking.findOne({ customerPhone: '7018610136' });
    console.log('Booking found with phone 7018610136:', b ? b.bookingId : 'None');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkBookings();
