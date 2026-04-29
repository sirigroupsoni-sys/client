const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Tandoori Paneer Tikka',
    price: 180,
    category: 'BulkFood',
    dishType: 'Starters',
    description: 'Succulent paneer cubes marinated in spices and grilled to perfection.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    isVeg: true,
    unit: 'pcs',
    ratio: 2.5
  },
  {
    name: 'Veg Sheek Kebab',
    price: 150,
    category: 'BulkFood',
    dishType: 'Starters',
    description: 'Minced vegetables and spices shaped on skewers and grilled.',
    image: 'https://images.unsplash.com/photo-1626777553732-48995bc3d186?w=400',
    isVeg: true,
    unit: 'pcs',
    ratio: 2
  },
  {
    name: 'Paneer Butter Masala',
    price: 800, // Price per kg
    category: 'BulkFood',
    dishType: 'Mains',
    description: 'Creamy tomato-based gravy with soft paneer cubes.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    isVeg: true,
    unit: 'kg',
    ratio: 0.15
  },
  {
    name: 'Dal Makhani',
    price: 600, // Price per kg
    category: 'BulkFood',
    dishType: 'Mains',
    description: 'Slow-cooked black lentils with cream and butter.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    isVeg: true,
    unit: 'kg',
    ratio: 0.12
  },
  {
    name: 'Jeera Rice',
    price: 300, // Price per kg
    category: 'BulkFood',
    dishType: 'Rice & Breads',
    description: 'Fragrant basmati rice tempered with cumin seeds.',
    image: 'https://images.unsplash.com/photo-1512058560566-d8f437abc49d?w=400',
    isVeg: true,
    unit: 'kg',
    ratio: 0.2
  },
  {
    name: 'Butter Naan',
    price: 40,
    category: 'BulkFood',
    dishType: 'Rice & Breads',
    description: 'Soft leavened bread with butter.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400',
    isVeg: true,
    unit: 'pcs',
    ratio: 1.5
  },
  {
      name: 'Gulab Jamun',
      price: 30,
      category: 'BulkFood',
      dishType: 'Desserts',
      description: 'Sweet milk-based dumplings soaked in sugar syrup.',
      image: 'https://caterninja.com/NEWUI/images/gulab-jamun.webp',
      isVeg: true,
      unit: 'pcs',
      ratio: 2
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    console.log('Connected to MongoDB for seeding...');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(products);
    console.log('Seeded real products successfully!');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
