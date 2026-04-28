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
  assignManager,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
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
router.delete('/menus/:menuId/dishes/:dishId', deleteDish);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/assign-manager', assignManager);

// Product Routes
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
