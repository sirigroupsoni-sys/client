const db = require('../config/db');

// Categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Menus based on category
exports.getMenusByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const [menus] = await db.execute('SELECT * FROM menus WHERE category_id = ?', [categoryId]);
    res.json({ success: true, menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Menu Details (with dishes)
exports.getMenuDetails = async (req, res) => {
  const { menuId } = req.params;
  try {
    const [menus] = await db.execute('SELECT * FROM menus WHERE id = ?', [menuId]);
    if (menus.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    const [dishes] = await db.execute('SELECT * FROM dishes WHERE menu_id = ?', [menuId]);
    
    res.json({ 
      success: true, 
      menu: menus[0],
      dishes 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add-ons
exports.getAddOns = async (req, res) => {
  try {
    const [addons] = await db.execute('SELECT * FROM add_ons');
    res.json({ success: true, addons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
