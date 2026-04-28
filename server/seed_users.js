const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for user seeding...');

    // Create Admin User
    const adminEmail = 'admin@mscaterers.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Admin password updated to: admin123');
    } else {
      await User.create({
        name: 'MS Caterers Admin',
        email: adminEmail,
        password: 'admin123',
        phone: '1234567890',
        role: 'Admin',
        status: 'active'
      });
      console.log('Admin user created successfully! Email: admin@mscaterers.com, Password: admin123');
    }

    process.exit();
  } catch (err) {
    console.error('User seeding error:', err);
    process.exit(1);
  }
};

seedUsers();
