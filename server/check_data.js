const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('./models/Category');
const Menu = require('./models/Menu');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find();
    console.log('Categories:', JSON.stringify(categories, null, 2));

    const menus = await Menu.find().limit(1);
    console.log('Sample Menu:', JSON.stringify(menus, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
