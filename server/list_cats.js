require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

async function list() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
  const cats = await Category.find();
  console.log('Categories:', cats.map(c => c.name));
  process.exit(0);
}
list();
