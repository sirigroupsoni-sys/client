const express = require('express');
const router = express.Router();
const { calculatePrice, createBooking, getMyBookings } = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');

router.post('/calculate', calculatePrice);
router.post('/create', auth(), createBooking);
router.get('/my-bookings', auth(), getMyBookings);

module.exports = router;
