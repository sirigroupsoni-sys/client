const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newCategories = [
      'Delivery Only',
      'Delivery + Services',
      'Live Service',
      'Snack Box',
      'Meal Box'
    ];

    for (const name of newCategories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`Created: ${name}`);
      } else {
        console.log(`Already exists: ${name}`);
      }
    }

    console.log('Category update complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateCategories();
