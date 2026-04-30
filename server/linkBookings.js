const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/User');
require('dotenv').config();

const linkBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    console.log('Connected to MongoDB');

    const bookings = await Booking.find({ user: null });
    console.log(`Found ${bookings.length} unlinked bookings`);

    for (let booking of bookings) {
      if (booking.customerPhone) {
        const user = await User.findOne({ phone: booking.customerPhone });
        if (user) {
          booking.user = user._id;
          await booking.save();
          console.log(`Linked booking ${booking.bookingId} to user ${user.email}`);
        }
      } else if (booking.customerName) {
         // Fallback to name if phone is missing (less reliable)
         const user = await User.findOne({ name: booking.customerName });
         if (user) {
           booking.user = user._id;
           await booking.save();
           console.log(`Linked booking ${booking.bookingId} to user ${user.email} (by name)`);
         }
      }
    }

    console.log('Finished linking bookings');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

linkBookings();
