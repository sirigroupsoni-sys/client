const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getMenusByCategory, 
  getMenuDishes, 
  getAddons, 
  calculatePrice 
} = require('../controllers/menuController');

router.get('/categories', getCategories);
router.get('/category/:categoryId', getMenusByCategory);
router.get('/:menuId/dishes', getMenuDishes);
router.get('/addons/all', getAddons);
router.post('/calculate-price', calculatePrice);

module.exports = router;
