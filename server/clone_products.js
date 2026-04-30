require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function cloneProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    console.log('Connected to MongoDB');

    const sourceProducts = await Product.find({ category: 'BulkFood' }).lean();
    if (sourceProducts.length === 0) {
      console.log('No BulkFood products found to clone.');
      process.exit(0);
    }

    const categoriesToSeed = ['FoodService', 'LiveServices', 'SnackBox', 'MealBox'];
    let count = 0;

    for (const cat of categoriesToSeed) {
      // Check if products already exist in this category
      const existing = await Product.countDocuments({ category: cat });
      if (existing === 0) {
        const newProducts = sourceProducts.map(p => {
          const newP = { ...p, category: cat };
          delete newP._id;
          delete newP.createdAt;
          delete newP.updatedAt;
          delete newP.__v;
          return newP;
        });
        await Product.insertMany(newProducts);
        console.log(`Cloned ${newProducts.length} products to ${cat}`);
        count += newProducts.length;
      } else {
        console.log(`${cat} already has ${existing} products. Skipping.`);
      }
    }

    console.log(`Total new products created: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cloneProducts();
