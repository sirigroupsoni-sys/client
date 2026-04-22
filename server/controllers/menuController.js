const Category = require('../models/Category');
const Menu = require('../models/Menu');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMenusByCategory = async (req, res) => {
  try {
    const menus = await Menu.find({ category: req.params.categoryId });
    res.status(200).json({ success: true, menus });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMenuDishes = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }
    res.status(200).json({ success: true, dishes: menu.dishes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.calculatePrice = async (req, res) => {
  try {
    const { menuId, guests, selectedDishes } = req.body;
    const menu = await Menu.findById(menuId);
    
    if (!menu) return res.status(404).json({ success: false, message: 'Menu not found' });

    let totalPrice = menu.base_price_per_plate * guests;
    
    // Add extra price for specific dishes if any
    if (selectedDishes && selectedDishes.length > 0) {
      selectedDishes.forEach(dishName => {
        const dish = menu.dishes.find(d => d.name === dishName);
        if (dish && dish.price) {
          totalPrice += dish.price * guests;
        }
      });
    }

    res.status(200).json({ success: true, totalPrice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAddons = async (req, res) => {
  try {
    // Returning empty array since Addon model doesn't exist yet
    res.status(200).json({ success: true, addons: [] });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
