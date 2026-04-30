const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

async function cleanCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const allowedCategories = [
      'Delivery Only',
      'Delivery + Services',
      'Live Service',
      'Snack Box',
      'Meal Box'
    ];

    const result = await Category.deleteMany({ name: { $nin: allowedCategories } });
    console.log(`Deleted ${result.deletedCount} categories.`);

    console.log('Cleanup complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanCategories();
