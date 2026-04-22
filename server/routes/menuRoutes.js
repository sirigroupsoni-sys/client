const express = require('express');
const router = express.Router();
const { getCategories, getMenusByCategory, getMenuDetails, getAddOns } = require('../controllers/menuController');

router.get('/categories', getCategories);
router.get('/category/:categoryId', getMenusByCategory);
router.get('/details/:menuId', getMenuDetails);
router.get('/addons', getAddOns);

module.exports = router;
