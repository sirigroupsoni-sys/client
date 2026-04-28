const mongoose = require('mongoose');
const Category = require('./models/Category');
const Menu = require('./models/Menu');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for seeding...');

    // Clear existing
    await Category.deleteMany({});
    await Menu.deleteMany({});

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'MSCATERERSBox', description: 'Gourmet boxes for small gatherings' },
      { name: 'MSCATERERSBuffet', description: 'Premium buffet catering' },
      { name: 'SnackBox', description: 'Quick bites and snacks' },
      { name: 'MealBox', description: 'Individual meal boxes' },
      { name: 'Wedding', description: 'Grand wedding catering' },
      { name: 'Birthday', description: 'Fun and delicious birthday menus' },
      { name: 'Corporate', description: 'Professional corporate catering' }
    ]);

    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    // Create Menus
    await Menu.insertMany([
      {
        name: 'Desi Darbar',
        category: catMap['MSCATERERSBox'],
        base_price_per_plate: 479,
        description: 'Authentic Indian flavors in a box',
        image: 'food_1.png',
        dishes: [
          { name: 'Paneer Tikka', type: 'Veg' },
          { name: 'Dal Makhani', type: 'Veg' },
          { name: 'Butter Chicken', type: 'Non-Veg', price: 50 }
        ]
      },
      {
        name: 'Punjabi Tadka',
        category: catMap['MSCATERERSBox'],
        base_price_per_plate: 509,
        description: 'Spicy and rich Punjabi cuisine',
        image: 'food_2.png',
        dishes: [
          { name: 'Sarson ka Saag', type: 'Veg' },
          { name: 'Makki di Roti', type: 'Veg' }
        ]
      },
      {
        name: 'Royal Buffet',
        category: catMap['MSCATERERSBuffet'],
        base_price_per_plate: 899,
        description: 'A royal feast for your guests',
        image: 'food_3.png',
        dishes: [
          { name: 'Mutton Rogan Josh', type: 'Non-Veg' },
          { name: 'Veg Pulao', type: 'Veg' }
        ]
      },
      {
        name: 'Evening Snacks',
        category: catMap['SnackBox'],
        base_price_per_plate: 249,
        description: 'Assorted snacks for tea time',
        image: 'food_4.png',
        dishes: [
          { name: 'Samosa', type: 'Veg' },
          { name: 'Spring Roll', type: 'Veg' }
        ]
      },
      {
        name: 'Daily Meal',
        category: catMap['MealBox'],
        base_price_per_plate: 199,
        description: 'Simple and healthy daily meal',
        image: 'food_5.png',
        dishes: [
          { name: 'Roti & Sabzi', type: 'Veg' },
          { name: 'Rice & Dal', type: 'Veg' }
        ]
      }
    ]);

    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
