import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
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
  Image as ImageIcon,
  MoreVertical,
  Filter,
  Copy
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
  const [menuForm, setMenuForm] = useState({ 
    name: '', 
    description: '', 
    base_price_per_plate: '', 
    min_guests: 10, 
    category: '',
    image: ''
  });
  
  const [dishForm, setDishForm] = useState({ 
    name: '', 
    description: '', 
    image_url: '', 
    type: 'Veg', 
    course: 'Starter', 
    price_impact: 0 
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const catRes = await api.get('/menus/categories');
      const cats = (catRes.data && catRes.data.categories) || [];
      setCategories(cats);
      if (cats.length > 0) {
        const firstCatId = cats[0]._id || cats[0].id;
        setSelectedCategory(firstCatId);
        fetchMenus(firstCatId);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async (catId) => {
    try {
      const res = await api.get(`/menus/category/${catId}`);
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
        await api.patch(`/admin/menus/${editingMenu._id}`, menuForm);
      } else {
        await api.post('/admin/menus', { ...menuForm, category: selectedCategory });
      }
      setShowMenuModal(false);
      setEditingMenu(null);
      fetchMenus(selectedCategory);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving menu');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm('Are you sure? All dishes in this menu will be deleted.')) return;
    try {
      await api.delete(`/admin/menus/${id}`);
      fetchMenus(selectedCategory);
    } catch (err) {
      alert('Error deleting menu');
    }
  };

  const handleDuplicateMenu = async (menu) => {
    if (!confirm(`Duplicate "${menu.name}"?`)) return;
    try {
      const { _id, createdAt, updatedAt, dishes, ...data } = menu;
      const res = await api.post('/admin/menus', { 
        ...data, 
        name: `${menu.name} (Copy)`,
        category: selectedCategory 
      });
      alert('Package duplicated! You can now add dishes to the new package.');
      fetchMenus(selectedCategory);
    } catch (err) {
      alert('Error duplicating package');
    }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        menuId: activeMenuForDishes._id,
        name: dishForm.name,
        type: dishForm.type,
        course: dishForm.course,
        price: dishForm.price,
        image_url: dishForm.image_url
      };
      
      if (editingDish) {
        payload.dishId = editingDish._id;
        await api.patch('/admin/dishes', payload);
      } else {
        await api.post('/admin/dishes', payload);
      }
      
      setShowDishModal(false);
      setEditingDish(null);
      openDishes(activeMenuForDishes); // Refresh dishes
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving dish');
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      await api.delete(`/admin/menus/${activeMenuForDishes._id}/dishes/${dishId}`);
      openDishes(activeMenuForDishes);
    } catch (err) {
      alert('Error deleting dish');
    }
  };

  const openDishes = async (menu) => {
    try {
      const res = await api.get(`/menus/${menu._id}/dishes`);
      setActiveMenuForDishes({ ...menu, dishes: res.data.dishes });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Initializing menu vault...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Menu Catalog</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your catering packages and dish offerings.</p>
        </div>
        <button 
          onClick={() => { 
            setMenuForm({ 
              name: '', 
              description: '', 
              base_price_per_plate: '', 
              min_guests: 10, 
              category: selectedCategory, 
              image: ''
            }); 
            setShowMenuModal(true); 
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-3"
        >
          <Plus size={18} />
          Create Package
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Categories & Filter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => fetchMenus(cat._id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-between group ${
                    selectedCategory === cat._id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                  <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat._id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Packages Table-style List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-base font-bold text-slate-900">Available Packages ({menus.length})</h3>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><Search size={18} /></button>
                   <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><Filter size={18} /></button>
                </div>
             </div>
             
             <div className="divide-y divide-slate-100">
               {menus.map((menu) => (
                 <div 
                   key={menu._id} 
                   onClick={() => openDishes(menu)}
                   className={`p-6 flex items-center justify-between group cursor-pointer transition-all hover:bg-slate-50/80 ${
                     activeMenuForDishes?._id === menu._id ? 'bg-blue-50/30 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                   }`}
                 >
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/50 flex-shrink-0">
                       {menu.image ? (
                         <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>
                       )}
                     </div>
                     <div>
                       <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{menu.name}</h4>
                       <p className="text-xs text-slate-500 font-medium mt-1 truncate max-w-[300px]">{menu.description || 'No description'}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Base Price</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">₹{menu.base_price_per_plate}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Min Qty</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{menu.min_guests || 0} Pax</p>
                     </div>
                     <div className="flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDuplicateMenu(menu); }}
                          title="Duplicate Package"
                          className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingMenu(menu); setMenuForm(menu); setShowMenuModal(true); }}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteMenu(menu._id); }}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Dish Sub-Editor (Slide-in Style or Bottom Section) */}
          {activeMenuForDishes && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm animate-in slide-in-from-top-4 duration-500">
               <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Dish Configuration: {activeMenuForDishes.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Manage individual items within this package.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingDish(null);
                      setDishForm({ name: '', type: 'Veg', course: 'Starter', price: 0, image_url: '' });
                      setShowDishModal(true);
                    }}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Add Dish
                  </button>
               </div>
               
               <div className="space-y-10">
                  {['Starter', 'Main', 'Rice', 'Bread', 'Dessert'].map((course) => {
                    const courseDishes = activeMenuForDishes.dishes?.filter(d => d.course === course);
                    if (!courseDishes?.length) return null;

                    return (
                      <div key={course} className="animate-in fade-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-4 w-[3px] bg-blue-600 rounded-full"></div>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{course}s</h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{courseDishes.length} items</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {courseDishes.map((dish) => (
                            <div key={dish._id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-200 hover:bg-white transition-all group shadow-sm hover:shadow-md">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
                                  {dish.image_url ? (
                                    <img src={dish.image_url} className="w-full h-full object-cover" alt={dish.name} />
                                  ) : (
                                    <ChefHat size={24} className="text-slate-200" />
                                  )}
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-slate-800 leading-tight block">{dish.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${dish.type === 'Veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dish.type}</span>
                                    {dish.price > 0 && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded">+₹{dish.price}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => { setEditingDish(dish); setDishForm(dish); setShowDishModal(true); }}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteDish(dish._id)}
                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {activeMenuForDishes.dishes?.filter(d => !['Starter', 'Main', 'Rice', 'Bread', 'Dessert'].includes(d.course)).length > 0 && (
                     <div className="animate-in fade-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-4 w-[3px] bg-slate-400 rounded-full"></div>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Uncategorized</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {activeMenuForDishes.dishes?.filter(d => !['Starter', 'Main', 'Rice', 'Bread', 'Dessert'].includes(d.course)).map(dish => (
                              <div key={dish._id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-200 hover:bg-white transition-all group shadow-sm hover:shadow-md">
                                 {/* ... same dish card content ... */}
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
                                       {dish.image_url ? <img src={dish.image_url} className="w-full h-full object-cover" alt={dish.name} /> : <ChefHat size={24} className="text-slate-200" />}
                                    </div>
                                    <div>
                                       <span className="text-sm font-bold text-slate-800 leading-tight block">{dish.name}</span>
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 block">{dish.type} • {dish.course || 'No Course'}</span>
                                    </div>
                                 </div>
                                 <button onClick={() => handleDeleteDish(dish._id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Minimal SaaS Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMenuModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-8">{editingMenu ? 'Edit Package' : 'Create New Package'}</h3>
            <form onSubmit={handleMenuSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Package Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={menuForm.name || ''} onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Base Price</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={menuForm.base_price_per_plate || ''} onChange={(e) => setMenuForm({...menuForm, base_price_per_plate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Min Guests</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={menuForm.min_guests || ''} onChange={(e) => setMenuForm({...menuForm, min_guests: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={menuForm.image || ''} onChange={(e) => setMenuForm({...menuForm, image: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4">
                {editingMenu ? 'Save Changes' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dish Modal */}
      {showDishModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDishModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-8">{editingDish ? 'Edit Dish' : 'Add New Dish'}</h3>
            <form onSubmit={handleDishSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dish Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={dishForm.name || ''} onChange={(e) => setDishForm({...dishForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                  <select className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={dishForm.type} onChange={(e) => setDishForm({...dishForm, type: e.target.value})}>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Extra Price</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={dishForm.price || 0} onChange={(e) => setDishForm({...dishForm, price: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Course</label>
                  <select className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={dishForm.course} onChange={(e) => setDishForm({...dishForm, course: e.target.value})}>
                    <option value="Starter">Starter</option>
                    <option value="Main">Main</option>
                    <option value="Rice">Rice</option>
                    <option value="Bread">Bread</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={dishForm.image_url || ''} onChange={(e) => setDishForm({...dishForm, image_url: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all mt-4">
                {editingDish ? 'Save Changes' : 'Add Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;
