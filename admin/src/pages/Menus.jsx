import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Utensils, 
  ChefHat, 
  Trash2, 
  Edit,
  Tag,
  IndianRupee,
  Layers,
  ChevronRight,
  X,
  Image as ImageIcon
} from 'lucide-react';

const Menus = () => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Modals
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [activeMenuForDishes, setActiveMenuForDishes] = useState(null);

  // Form States
  const [menuForm, setMenuForm] = useState({ name: '', description: '', base_price_per_plate: '', min_guests: 10, category_id: '' });
  const [dishForm, setDishForm] = useState({ name: '', description: '', image_url: '', type: 'Veg', course: 'Main Course', price_impact: 0 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const catRes = await axios.get('http://localhost:5000/api/v1/menus/categories');
      setCategories(catRes.data.categories);
      if (catRes.data.categories.length > 0) {
        const firstCatId = catRes.data.categories[0].id;
        setSelectedCategory(firstCatId);
        fetchMenus(firstCatId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async (catId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/menus/category/${catId}`);
      setMenus(res.data.menus);
      setSelectedCategory(catId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await axios.patch(`http://localhost:5000/api/v1/admin/menus/${editingMenu.id}`, menuForm, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/v1/admin/menus', { ...menuForm, category_id: selectedCategory }, { withCredentials: true });
      }
      setShowMenuModal(false);
      setEditingMenu(null);
      fetchMenus(selectedCategory);
    } catch (err) {
      alert('Error saving menu');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm('Are you sure? All dishes in this menu will be deleted.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/menus/${id}`, { withCredentials: true });
      fetchMenus(selectedCategory);
    } catch (err) {
      alert('Error deleting menu');
    }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDish) {
        await axios.patch(`http://localhost:5000/api/v1/admin/dishes/${editingDish.id}`, dishForm, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/v1/admin/dishes', { ...dishForm, menu_id: activeMenuForDishes.id }, { withCredentials: true });
      }
      setShowDishModal(false);
      setEditingDish(null);
      // Refresh dishes for the active menu
      const res = await axios.get(`http://localhost:5000/api/v1/menus/${activeMenuForDishes.id}/dishes`);
      setActiveMenuForDishes({ ...activeMenuForDishes, dishes: res.data.dishes });
    } catch (err) {
      alert('Error saving dish');
    }
  };

  const openDishes = async (menu) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/menus/${menu.id}/dishes`);
      setActiveMenuForDishes({ ...menu, dishes: res.data.dishes });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!confirm('Delete this dish?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/dishes/${id}`, { withCredentials: true });
      openDishes(activeMenuForDishes);
    } catch (err) {
      alert('Error deleting dish');
    }
  };

  if (loading) return <div className="p-12 text-slate-400 font-black text-xl animate-pulse">Loading Menu System...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Menu & Product Mgmt</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your catering packages and individual dish offerings.</p>
        </div>
        <button 
          onClick={() => { setEditingMenu(null); setMenuForm({ name: '', description: '', base_price_per_plate: '', min_guests: 10, category_id: selectedCategory }); setShowMenuModal(true); }}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-3"
        >
          <Plus size={20} />
          Create New Package
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => fetchMenus(cat.id)}
            className={`px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat.id 
              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Menu List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Layers className="text-red-600" />
            Packages in {categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {menus.map((menu) => (
              <div 
                key={menu.id} 
                onClick={() => openDishes(menu)}
                className={`bg-white p-6 rounded-[32px] border transition-all cursor-pointer group ${activeMenuForDishes?.id === menu.id ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900">{menu.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-1">{menu.description}</p>
                    <div className="flex gap-6 mt-4">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <IndianRupee size={14} />
                        ₹{menu.base_price_per_plate}/plate
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <Tag size={14} />
                        Min {menu.min_guests} guests
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingMenu(menu); setMenuForm(menu); setShowMenuModal(true); }}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteMenu(menu.id); }}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dish List for Selected Menu */}
        <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-200/50 min-h-[600px]">
          {activeMenuForDishes ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{activeMenuForDishes.name}</h2>
                  <p className="text-slate-500 font-medium mt-1">Manage dishes for this package</p>
                </div>
                <button 
                  onClick={() => { setEditingDish(null); setDishForm({ name: '', description: '', image_url: '', type: 'Veg', course: 'Main Course', price_impact: 0 }); setShowDishModal(true); }}
                  className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {activeMenuForDishes.dishes?.map((dish) => (
                  <div key={dish.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-5 group">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300">
                      {dish.image_url ? <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{dish.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${dish.type === 'Veg' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {dish.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{dish.course}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {dish.price_impact > 0 && <span className="text-xs font-black text-slate-900">+₹{dish.price_impact}</span>}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingDish(dish); setDishForm(dish); setShowDishModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteDish(dish.id)} className="p-2 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <ChefHat size={48} className="opacity-20" />
              <p className="font-bold">Select a package to manage its dishes</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">{editingMenu ? 'Edit Package' : 'New Package'}</h3>
              <button onClick={() => setShowMenuModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleMenuSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
                <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={menuForm.name} onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20 h-32" value={menuForm.description} onChange={(e) => setMenuForm({...menuForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Price per Plate</label>
                  <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={menuForm.base_price_per_plate} onChange={(e) => setMenuForm({...menuForm, base_price_per_plate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Min Guests</label>
                  <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={menuForm.min_guests} onChange={(e) => setMenuForm({...menuForm, min_guests: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all mt-4">
                {editingMenu ? 'Update Package' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dish Modal */}
      {showDishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">{editingDish ? 'Edit Dish' : 'New Dish'}</h3>
              <button onClick={() => setShowDishModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleDishSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Dish Name</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={dishForm.name} onChange={(e) => setDishForm({...dishForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={dishForm.type} onChange={(e) => setDishForm({...dishForm, type: e.target.value})}>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Course</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={dishForm.course} onChange={(e) => setDishForm({...dishForm, course: e.target.value})}>
                    <option value="Starter">Starter</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" placeholder="https://example.com/dish.jpg" value={dishForm.image_url} onChange={(e) => setDishForm({...dishForm, image_url: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Price Impact (Extra cost)</label>
                <input type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20" value={dishForm.price_impact} onChange={(e) => setDishForm({...dishForm, price_impact: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all mt-4">
                {editingDish ? 'Update Dish' : 'Add Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;
