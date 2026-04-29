const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getAllMenus,
  getMenusByCategory,
  getMenusByCategoryName,
  getMenuDishes, 
  getAddons, 
  calculatePrice,
  getProducts,
  getProductById
} = require('../controllers/menuController');

router.get('/categories', getCategories);
router.get('/all', getAllMenus);
router.get('/products', getProducts);
router.get('/products/:productId', getProductById);
router.get('/category/:categoryId', getMenusByCategory);
router.get('/category-name/:categoryName', getMenusByCategoryName);
router.get('/:menuId/dishes', getMenuDishes);
router.get('/addons/all', getAddons);
router.post('/calculate-price', calculatePrice);

module.exports = router;
