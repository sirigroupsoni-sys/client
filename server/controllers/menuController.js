const db = require('../config/db');

// Fetch all event types (categories)
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Fetch menus based on category
exports.getMenusByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [menus] = await db.execute('SELECT * FROM menus WHERE category_id = ?', [categoryId]);
    res.status(200).json({ success: true, menus });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Fetch dishes for a menu
exports.getMenuDishes = async (req, res) => {
  try {
    const { menuId } = req.params;
    const [dishes] = await db.execute('SELECT * FROM dishes WHERE menu_id = ?', [menuId]);
    res.status(200).json({ success: true, dishes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Fetch all add-ons
exports.getAddons = async (req, res) => {
  try {
    const [addons] = await db.execute('SELECT * FROM add_ons');
    res.status(200).json({ success: true, data: addons });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Pricing Engine Logic
exports.calculatePrice = async (req, res) => {
  try {
    const { menuId, guestCount, selectedDishIds, selectedAddonIds } = req.body;

    // 1. Get Menu Base Price
    const [menus] = await db.execute('SELECT base_price_per_plate, min_guests FROM menus WHERE id = ?', [menuId]);
    if (menus.length === 0) return res.status(404).json({ success: false, message: 'Menu not found' });
    
    const menu = menus[0];
    let pricePerPlate = parseFloat(menu.base_price_per_plate);
    const count = parseInt(guestCount) || menu.min_guests;

    // 2. Add Dish Price Impacts (if any)
    if (selectedDishIds && selectedDishIds.length > 0) {
      const [dishes] = await db.execute('SELECT SUM(price_impact) as totalImpact FROM dishes WHERE id IN (?)', [selectedDishIds]);
      if (dishes[0].totalImpact) {
        pricePerPlate += parseFloat(dishes[0].totalImpact);
      }
    }

    const subtotalPlates = pricePerPlate * count;

    // 3. Add Add-ons
    let addonTotal = 0;
    if (selectedAddonIds && selectedAddonIds.length > 0) {
      const [addons] = await db.execute('SELECT SUM(price) as totalAddon FROM add_ons WHERE id IN (?)', [selectedAddonIds]);
      if (addons[0].totalAddon) {
        addonTotal = parseFloat(addons[0].totalAddon);
      }
    }

    const subtotal = subtotalPlates + addonTotal;
    const taxRate = 0.05; // 5% GST example
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    res.status(200).json({
      success: true,
      breakdown: {
        pricePerPlate,
        guestCount: count,
        subtotalPlates,
        addonTotal,
        subtotal,
        tax,
        total
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
