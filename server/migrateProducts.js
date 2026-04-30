const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  console.log(counts);
  
  // Migration logic
  const mappings = {
    'BulkFood': 'Delivery Only',
    'LiveServices': 'Live Service',
    'SnackBox': 'Snack Box',
    'MealBox': 'Meal Box'
  };

  for (const [oldName, newName] of Object.entries(mappings)) {
    const res = await Product.updateMany({ category: oldName }, { category: newName });
    if (res.modifiedCount > 0) {
      console.log(`Migrated ${res.modifiedCount} products from ${oldName} to ${newName}`);
    }
  }
  
  process.exit(0);
}

check();
