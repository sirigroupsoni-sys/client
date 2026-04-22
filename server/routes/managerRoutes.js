const express = require('express');
const router = express.Router();
const { 
  getAssignedBookings, 
  assignTask, 
  updateEventStatus 
} = require('../controllers/managerController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('manager', 'admin'));

router.get('/assigned-bookings', getAssignedBookings);
router.post('/assign-task', assignTask);
router.patch('/booking/:id/status', updateEventStatus);

module.exports = router;
