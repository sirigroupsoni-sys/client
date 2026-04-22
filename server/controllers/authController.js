const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address,
      role: req.body.role || 'Customer'
    });

    sendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
