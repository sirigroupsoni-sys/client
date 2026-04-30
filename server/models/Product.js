const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Delivery Only', 'Delivery + Services', 'Live Service', 'Snack Box', 'Meal Box'],
    default: 'Delivery Only'
  },
  dishType: {
    type: String,
    enum: ['Starters', 'Mains', 'Rice & Breads', 'Desserts', 'Beverages', 'Other'],
    default: 'Other'
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'ltr', 'plate'],
    default: 'pcs'
  },
  ratio: {
    type: Number,
    default: 1 // Quantity per guest
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
