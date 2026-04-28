import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import MenuPopup from '../common/MenuPopup';

const PackagesSection = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dietFilter, setDietFilter] = useState('veg'); // 'veg' or 'non-veg'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under400', '400-550', '550plus'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch all menus directly
      const res = await API.get('/menus/all');
      if (res.data.success) {
        setPackages(res.data.menus);
      }
    } catch (err) {
      console.error('Error fetching all menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMenu = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  // Client-side filtering on top of fetched data
  const filteredPackages = packages.filter(pkg => {
    // Note: If backend provides type/price filtering, use API instead. 
    // For now, we simulate with existing backend structure.
    
    // Diet filter
    const pkgType = (pkg.type || 'Veg').toLowerCase();
    const filterType = dietFilter.toLowerCase();
    
    if (pkgType !== 'both' && pkgType !== filterType) return false;

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
      <div className="flex flex-col gap-6 mb-8">
        {/* Title & Item Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-10 bg-[#B70C10] rounded-full"></div>
             <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 tracking-tight">
               Catering Packages
             </h1>
          </div>
          <span className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
            {filteredPackages.length} Selections
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Diet Toggles */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <button 
                 onClick={() => setDietFilter('veg')}
                 className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${dietFilter === 'veg' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Veg
               </button>
               <button 
                 onClick={() => setDietFilter('non-veg')}
                 className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${dietFilter === 'non-veg' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                    className={`px-4 py-2.5 rounded-xl font-bold text-[10px] transition-all border-2 ${
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
             <div key={i} className="h-[370px] bg-slate-50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence mode='popLayout'>
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openMenu(pkg)}
                className="flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-[#1A1C1E] cursor-pointer group border border-white/5"
              >
                {/* Image Section */}
                <div className="h-[180px] w-full relative overflow-hidden bg-slate-800">
                  <img src={pkg.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800'} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 left-0 bg-[#D4AF37] text-white text-[8px] font-bold px-3 py-1 rounded-br-xl shadow-lg">PREMIUM CHOICE</div>
                  
                  {/* Diet Indicator */}
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20 flex gap-1">
                    {(pkg.type === 'Veg' || pkg.type === 'Both') && (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      </div>
                    )}
                    {(pkg.type === 'Non-Veg' || pkg.type === 'Both') && (
                      <div className="w-3.5 h-3.5 border-2 border-rose-500 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <h3 className="text-white font-heading font-bold text-lg tracking-tight leading-snug group-hover:text-[#B70C10] transition-colors line-clamp-1">{pkg.name}</h3>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">Starts at</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-2xl font-black italic tracking-tighter">₹{pkg.base_price_per_plate}</span>
                        <span className="text-slate-500 text-[8px] font-bold">/ pax</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[#FF9F43] text-[8px] font-bold uppercase tracking-tighter">Next Cycle</p>
                       <p className="text-white text-[10px] font-bold">Tom. 12:30 PM</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); openMenu(pkg); }}
                    className="w-full mt-5 bg-[#F8E9C1] hover:bg-white text-[#111] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
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
           <p className="text-slate-400 font-bold text-xl tracking-tighter">No packages found in this range.</p>
           <button onClick={() => { setDietFilter('veg'); setPriceFilter('all'); }} className="text-[#B70C10] font-bold text-sm uppercase tracking-widest hover:underline">Reset Logic</button>
        </div>
      )}
    </section>
  );
};

export default PackagesSection;
