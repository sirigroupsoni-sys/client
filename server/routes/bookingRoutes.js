const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getBookingDetails, 
  updateBookingStatus,
  duplicateBooking
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', createBooking);
router.post('/duplicate', protect, duplicateBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingDetails);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
