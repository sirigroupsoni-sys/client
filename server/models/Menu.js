const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Veg', 'Non-Veg', 'Jain'], default: 'Veg' },
  price: { type: Number, default: 0 } // Extra price if added as custom
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
  dishes: [dishSchema],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
