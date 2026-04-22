import React, { useState, useEffect } from 'react';
import { X, Plus, Utensils, Zap } from 'lucide-react';
import axios from 'axios';

const MenuPopup = ({ isOpen, onClose, menuData }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && menuData?.id) {
      fetchDishes(menuData.id);
    }
  }, [isOpen, menuData]);

  const fetchDishes = async (menuId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/menus/${menuId}/dishes`);
      if (res.data.success) {
        setDishes(res.data.dishes);
      }
    } catch (err) {
      console.error('Error fetching dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const starters = dishes.filter(d => d.course?.toLowerCase().includes('starter'));
  const mains = dishes.filter(d => d.course?.toLowerCase().includes('main'));
  const others = dishes.filter(d => !starters.includes(d) && !mains.includes(d));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[480px] rounded-[50px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 border border-white/20">
        
        {/* Modal Header */}
        <div className="p-10 pb-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-10 top-10 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#B70C10] hover:bg-red-50 transition-all z-10 hover:rotate-90"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-red-50 text-[#B70C10] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Verified Menu</div>
             {loading && <div className="w-2 h-2 bg-[#B70C10] rounded-full animate-ping"></div>}
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter leading-none">{menuData?.name || 'Loading Package...'}</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">
             {dishes.length} Items • Multi-Course Experience
          </p>
        </div>

        {/* Price Engine Bar */}
        <div className="bg-[#FEF2F2] px-10 py-6 flex justify-between items-center mb-6 border-y border-red-100/50 group">
          <div>
             <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest">Reserve from</p>
             <div className="flex items-baseline gap-2">
                <span className="text-[#B70C10] font-black text-4xl italic tracking-tighter group-hover:scale-110 transition-transform origin-left">₹{menuData?.base_price_per_plate}/-</span>
                <span className="text-slate-400 font-bold text-xs">/ plate</span>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-tighter">
                <Zap size={12} fill="currentColor" />
                Live Pricing
             </div>
             <p className="text-slate-400 font-bold text-[10px] mt-1">Min {menuData?.min_guests || 10} Guests</p>
          </div>
        </div>

        {/* Scrollable Culinary Content */}
        <div className="px-10 pb-8 max-h-[45vh] overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                   <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="space-y-12">
              {/* Starters Section */}
              {starters.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-8 bg-[#B70C10] rounded-full"></div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-3">
                       STARTERS 
                       <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">{starters.length} Items</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {starters.map((item, i) => (
                      <div key={i} className="flex items-center gap-5 bg-white border-2 border-slate-50 p-4 rounded-[28px] hover:border-red-100 transition-all group shadow-sm">
                        <div className="w-16 h-16 rounded-[20px] overflow-hidden flex-shrink-0 shadow-inner border border-slate-100 bg-slate-50">
                          {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-200"><Utensils size={24} /></div>
                          )}
                        </div>
                        <div className="flex-1">
                           <span className="font-black text-slate-800 text-base leading-tight group-hover:text-[#B70C10] transition-colors">{item.name}</span>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Classic Selection</p>
                        </div>
                        {item.type === 'Non-Veg' && <div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mains Section */}
              {mains.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-8 bg-slate-900 rounded-full"></div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-3">
                       SIGNATURE MAINS 
                       <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">{mains.length} Items</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {mains.map((item, i) => (
                      <div key={i} className="flex items-center gap-5 bg-slate-50 border-2 border-transparent p-4 rounded-[28px] hover:border-slate-200 hover:bg-white transition-all group">
                         <div className="w-16 h-16 rounded-[20px] overflow-hidden flex-shrink-0 shadow-sm border border-white bg-white">
                          {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-200"><Utensils size={24} /></div>
                          )}
                        </div>
                        <span className="font-black text-slate-800 text-base flex-grow leading-tight">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Items Section */}
              {others.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-1.5 h-8 bg-slate-400 rounded-full"></div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight">ADDITIONAL TREATS</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     {others.map((item, i) => (
                        <div key={i} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 text-sm flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                           {item.name}
                        </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-10 bg-white border-t border-slate-50">
          <button className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all group">
            Customize & Check Price 
            <div className="bg-white text-slate-900 rounded-[14px] p-2 group-hover:rotate-12 transition-transform">
               <Plus size={20} strokeWidth={4} />
            </div>
          </button>
          <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mt-6">
             Final pricing includes all taxes & service fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPopup;
