require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

async function ensureCategories() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
  const requiredCategories = ['MSCATERERSBox', 'FoodService', 'MSCATERERSBuffet', 'SnackBox', 'MealBox'];
  
  for (const name of requiredCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      console.log('Created category:', name);
    } else {
      console.log('Category exists:', name);
    }
  }
  process.exit(0);
}
ensureCategories();
