const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getAllUsers, 
  updateUserRole, 
  createMenu, 
  updateMenu,
  deleteMenu,
  addDish, 
  updateDish,
  deleteDish,
  getAllBookings, 
  assignManager 
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/menus', createMenu);
router.patch('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);
router.post('/dishes', addDish);
router.patch('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/assign-manager', assignManager);

module.exports = router;
