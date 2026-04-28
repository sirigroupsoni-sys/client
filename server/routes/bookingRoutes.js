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

router.use(protect);

router.post('/', createBooking);
router.post('/duplicate', duplicateBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingDetails);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
