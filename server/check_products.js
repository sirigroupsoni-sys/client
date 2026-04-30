require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProducts() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
  const count = await Product.countDocuments();
  console.log('Total products in MongoDB:', count);
  
  if (count > 0) {
    const products = await Product.find().limit(3);
    console.log('Sample products:', products.map(p => ({ name: p.name, category: p.category })));
  }
  process.exit(0);
}
checkProducts();
