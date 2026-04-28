const mongoose = require('mongoose');
const Menu = require('./models/Menu');
require('dotenv').config();

const count = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const menus = await Menu.find();
  console.log(`Found ${menus.length} menus in DB`);
  process.exit();
};

count();
