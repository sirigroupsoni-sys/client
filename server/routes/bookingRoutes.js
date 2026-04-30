const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getBookingDetails, 
  updateBookingStatus,
  duplicateBooking,
  trackBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, identifyUser } = require('../middlewares/authMiddleware');

router.get('/track/:bookingId', trackBooking);
router.post('/', identifyUser, createBooking);
router.post('/duplicate', protect, duplicateBooking);
router.post('/cancel/:id', protect, cancelBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingDetails);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
