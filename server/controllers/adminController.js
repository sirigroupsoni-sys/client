const User = require('../models/User');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const Product = require('../models/Product');

exports.getAnalytics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const userCount = await User.countDocuments({ role: 'Customer' });
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: { $in: ['Confirmed', 'Completed'] } });
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.pricingBreakdown?.total || 0), 0);

    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('menu', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        userCount,
        totalRevenue
      },
      recentBookings
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role: req.body.role },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json({ success: true, menu });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, menu });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Menu deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('menu', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.addDish = async (req, res) => {
  try {
    const { menuId, name, type, course, price, image_url } = req.body;
    const menu = await Menu.findByIdAndUpdate(
      menuId,
      { $push: { dishes: { name, type, course, price, image_url } } },
      { new: true }
    );
    res.status(200).json({ success: true, menu });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { menuId, dishId, name, type, course, price, image_url } = req.body;
    const menu = await Menu.findOneAndUpdate(
      { _id: menuId, "dishes._id": dishId },
      { 
        $set: { 
          "dishes.$.name": name, 
          "dishes.$.type": type, 
          "dishes.$.course": course,
          "dishes.$.price": price,
          "dishes.$.image_url": image_url
        } 
      },
      { new: true }
    );
    res.status(200).json({ success: true, menu });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { menuId, dishId } = req.params;
    const menu = await Menu.findByIdAndUpdate(
      menuId,
      { $pull: { dishes: { _id: dishId } } },
      { new: true }
    );
    res.status(200).json({ success: true, menu });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.assignManager = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { manager: req.body.managerId },
      { new: true }
    );
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Product CRUD
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
