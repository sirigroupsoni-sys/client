const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Product = require('./models/Product');
require('dotenv').config();

const backfillImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    const bookings = await Booking.find({ 'selectedDishes.0': { $exists: true } });
    console.log(`Checking ${bookings.length} bookings for missing images`);

    for (let booking of bookings) {
      let changed = false;
      for (let dish of booking.selectedDishes) {
        if (!dish.image && dish.productId) {
          const product = await Product.findById(dish.productId);
          if (product && product.image) {
            dish.image = product.image;
            changed = true;
          }
        }
      }
      if (changed) {
        await booking.save();
        console.log(`Updated images for booking ${booking.bookingId}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

backfillImages();
