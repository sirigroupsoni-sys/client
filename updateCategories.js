const mongoose = require('mongoose');
const Category = require('./server/models/Category');
require('dotenv').config({ path: './server/.env' });

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const mappings = {
      'MSCATERERSBox': 'Delivery Only',
      'MSCATERERSBuffet': 'Live Service',
      'SnackBox': 'Snack Box',
      'MealBox': 'Meal Box'
    };

    for (const [oldName, newName] of Object.entries(mappings)) {
      const result = await Category.findOneAndUpdate(
        { name: oldName },
        { name: newName },
        { new: true }
      );
      if (result) {
        console.log(`Updated: ${oldName} -> ${newName}`);
      } else {
        // If it doesn't exist, create it
        const exists = await Category.findOne({ name: newName });
        if (!exists) {
          await Category.create({ name: newName });
          console.log(`Created: ${newName}`);
        }
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
