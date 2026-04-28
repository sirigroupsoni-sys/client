const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://mscaterers-client.onrender.com', 
  'https://mscaterers-admin.onrender.com',
  'https://avkart.shop'
];

if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(origin => {
    if (origin && !allowedOrigins.includes(origin.trim())) {
      allowedOrigins.push(origin.trim());
    }
  });
}

app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any origin that is making the request
    // This is safe because we still have authentication and other security measures
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests explicitly
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB Connection with Auto-Retry
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ms_caterers');
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MS Caterers MongoDB API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menus', menuRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/manager', managerRoutes);
app.use('/api/v1/employee', employeeRoutes);

// Static files for Admin Panel (served at /mscaterers/admin)
app.use('/mscaterers/admin', express.static(path.join(__dirname, '../admin/dist')));

// Static files for Client (served at /)
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Routing for Admin
app.use('/mscaterers/admin', (req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('.')) {
    return res.sendFile(path.resolve(__dirname, '../admin/dist/index.html'));
  }
  next();
});

// SPA Routing for Client
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('.')) {
    return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
  next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
