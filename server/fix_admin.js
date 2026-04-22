const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function fixAdmin() {
    console.log('Attempting to fix Admin credentials on MongoDB...');
    
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
        console.log('Connected to MongoDB...');
        
        const email = 'admin@mscaterers.com';
        const password = 'admin123';
        
        // Delete existing admin if any
        await User.deleteOne({ email });
        
        // Insert correct admin (password will be hashed by pre-save hook)
        await User.create({
            name: 'Super Admin',
            email,
            password,
            phone: '9876543210',
            role: 'Admin'
        });
        
        console.log('SUCCESS: Admin user created on MongoDB with password "admin123".');
        process.exit(0);
    } catch (err) {
        console.error('Database not ready yet. Retrying in 5 seconds...', err.message);
        setTimeout(fixAdmin, 5000);
    }
}

fixAdmin();
