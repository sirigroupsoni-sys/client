const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const checkKeys = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    const b = await Booking.findOne();
    if (b) {
      console.log('Booking keys:', Object.keys(b.toObject()));
      console.log('createdAt:', b.createdAt);
      console.log('created_at:', b.created_at);
    } else {
      console.log('No bookings found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
checkKeys();
