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
      { name: 'Wedding', description: 'Grand wedding catering' },
      { name: 'Birthday', description: 'Fun and delicious birthday menus' },
      { name: 'Corporate', description: 'Professional corporate catering' }
    ]);

    // Create Menus
    await Menu.insertMany([
      {
        name: 'Desi Darbar',
        category: categories[0]._id,
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
        category: categories[0]._id,
        base_price_per_plate: 509,
        description: 'Spicy and rich Punjabi cuisine',
        image: 'food_2.png',
        dishes: [
          { name: 'Sarson ka Saag', type: 'Veg' },
          { name: 'Makki di Roti', type: 'Veg' }
        ]
      }
    ]);

    console.log('Seed data inserted!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
