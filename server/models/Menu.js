const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Veg', 'Non-Veg', 'Jain'], default: 'Veg' },
  price: { type: Number, default: 0 }, // Extra price if added as custom
  course: { type: String, default: 'Main' }, // e.g., Starter, Main, Rice, Bread, Dessert
  image_url: { type: String }
});

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  base_price_per_plate: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  type: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Both'],
    default: 'Veg'
  },
  dishes: [dishSchema],
  starters_count: { type: Number, default: 0 },
  mains_count: { type: Number, default: 0 },
  bread_rice_count: { type: Number, default: 0 },
  dessert_count: { type: Number, default: 0 },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
