import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MenuPopup from '../common/MenuPopup';

const PackagesSection = () => {
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dietFilter, setDietFilter] = useState('veg'); // 'veg' or 'non-veg'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under400', '400-550', '550plus'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const catRes = await axios.get('http://localhost:5000/api/v1/menus/categories');
      if (catRes.data.success && catRes.data.categories.length > 0) {
        setCategories(catRes.data.categories);
        // Find NinjaBox category by default or just pick first
        const defaultCat = catRes.data.categories.find(c => c.name.toLowerCase().includes('box')) || catRes.data.categories[0];
        setSelectedCategoryId(defaultCat.id);
        fetchMenus(defaultCat.id);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setLoading(false);
    }
  };

  const fetchMenus = async (categoryId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/menus/category/${categoryId}`);
      if (res.data.success) {
        setPackages(res.data.menus);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMenu = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
    fetchMenus(id);
  };

  // Client-side filtering on top of fetched data
  const filteredPackages = packages.filter(pkg => {
    // Note: If backend provides type/price filtering, use API instead. 
    // For now, we simulate with existing backend structure.
    
    // Diet filter (assuming 'type' comes from backend, defaulting to 'veg' for demo if missing)
    const pkgType = (pkg.type || 'veg').toLowerCase();
    if (pkgType !== dietFilter) return false;

    // Price filter
    const price = parseFloat(pkg.base_price_per_plate);
    if (priceFilter === 'under400' && price >= 400) return false;
    if (priceFilter === '400-550' && (price < 400 || price > 550)) return false;
    if (priceFilter === '550plus' && price <= 550) return false;

    return true;
  });

  return (
    <section className="py-12 w-full max-w-[1400px] mx-auto px-5 md:px-8">
      <MenuPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} menuData={selectedMenu} />

      {/* Header Area */}
      <div className="flex flex-col gap-8 mb-12">
        {/* Title & Item Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-10 bg-[#B70C10] rounded-full"></div>
             <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
               Catering Packages
             </h1>
          </div>
          <span className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest">
            {filteredPackages.length} Selections
          </span>
        </div>

        {/* Category Tabs (Dynamic from Backend) */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
           {categories.map((cat) => (
             <button
               key={cat.id}
               onClick={() => handleCategoryChange(cat.id)}
               className={`px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap border-2 uppercase tracking-tighter ${
                 selectedCategoryId === cat.id 
                 ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
                 : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200 hover:text-slate-600'
               }`}
             >
               {cat.name}
             </button>
           ))}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Diet Toggles */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <button 
                 onClick={() => setDietFilter('veg')}
                 className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${dietFilter === 'veg' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Veg
               </button>
               <button 
                 onClick={() => setDietFilter('non-veg')}
                 className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${dietFilter === 'non-veg' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Non-Veg
               </button>
            </div>

            {/* Price Filters */}
            <div className="flex gap-2">
               {[
                 { id: 'under400', label: '< ₹400' },
                 { id: '400-550', label: '₹400-550' },
                 { id: '550plus', label: '₹550+' }
               ].map((filter) => (
                 <button
                   key={filter.id}
                   onClick={() => setPriceFilter(priceFilter === filter.id ? 'all' : filter.id)}
                   className={`px-5 py-3 rounded-2xl font-black text-xs transition-all border-2 ${
                     priceFilter === filter.id 
                     ? 'bg-slate-900 text-white border-slate-900' 
                     : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                   }`}
                 >
                   {filter.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm cursor-pointer hover:text-slate-900 transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
             Sort by Price
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-[350px] bg-slate-50 rounded-[40px] animate-pulse"></div>
           ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id || pkg.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openMenu(pkg)}
                className="flex flex-col rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-[#1A1C1E] cursor-pointer group border border-white/5"
              >
                {/* Image Section */}
                <div className="h-[200px] w-full relative overflow-hidden bg-slate-800">
                  <img src={pkg.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 left-0 bg-[#D4AF37] text-white text-[9px] font-black px-4 py-1.5 rounded-br-2xl shadow-lg">PREMIUM CHOICE</div>
                  
                  {/* Veg Icon */}
                  <div className="absolute top-4 right-4 bg-white p-1 rounded-lg shadow-xl">
                    <div className={`w-4 h-4 border-2 ${pkg.type === 'Non-Veg' ? 'border-rose-500' : 'border-emerald-500'} rounded-sm flex items-center justify-center`}>
                      <div className={`w-1.5 h-1.5 ${pkg.type === 'Non-Veg' ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}></div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <h3 className="text-white font-black text-xl tracking-tight leading-tight min-h-[3rem] group-hover:text-[#B70C10] transition-colors">{pkg.name}</h3>
                  
                  <div className="flex justify-between items-end mt-6">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Starts at</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-3xl font-black italic tracking-tighter">₹{pkg.base_price_per_plate}</span>
                        <span className="text-slate-500 text-[9px] font-bold">/ pax</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[#FF9F43] text-[9px] font-black uppercase tracking-tighter">Next Cycle</p>
                       <p className="text-white text-[11px] font-black">Tom. 12:30 PM</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); openMenu(pkg); }}
                    className="w-full mt-6 bg-[#F8E9C1] hover:bg-white text-[#111] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                  >
                    <div className="w-5 h-5 border-2 border-[#111] rounded-md flex items-center justify-center text-[10px]">+</div>
                    View Menu
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredPackages.length === 0 && (
        <div className="py-24 text-center space-y-4 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200">
           <div className="text-4xl">🍽️</div>
           <p className="text-slate-400 font-black text-xl tracking-tighter">No packages found in this range.</p>
           <button onClick={() => { setDietFilter('veg'); setPriceFilter('all'); }} className="text-[#B70C10] font-black text-sm uppercase tracking-widest hover:underline">Reset Logic</button>
        </div>
      )}
    </section>
  );
};

export default PackagesSection;
