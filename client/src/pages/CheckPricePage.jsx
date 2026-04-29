import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plus, ChevronDown, Search, Trash2, Calendar, Clock, MapPin, PartyPopper, CalendarCheck, Utensils, Receipt, CreditCard, Lightbulb, MessageCircle, X, Bookmark, CheckCircle2, User } from 'lucide-react';
import api from '../api/axios';

const CheckPricePage = () => {
  const [formData, setFormData] = useState({
    city: '',
    occasion: '',
    date: '',
    time: '',
    vegGuests: '10',
    nonVegGuests: '0',
    name: '',
    phone: '',
    address: ''
  });

  const [step, setStep] = useState(1);
  const [availableDishes, setAvailableDishes] = useState({
    'Starters': [
      { id: 1, name: 'Tandoori Paneer Tikka', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200', type: 'veg', unit: 'pcs', ratio: 2 },
      { id: 2, name: 'Veg Sheek Kebab', img: 'https://images.unsplash.com/photo-1626777553732-48995bc3d186?w=200', type: 'veg', unit: 'pcs', ratio: 1.5 },
      { id: 3, name: 'Cocktail Samosa', img: 'https://caterninja.com/NEWUI/images/cocktail-samosa.webp', type: 'veg', unit: 'pcs', ratio: 3 }
    ],
    'Mains': [
      { id: 4, name: 'Paneer Butter Masala', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200', type: 'veg', unit: 'kg', ratio: 0.15 },
      { id: 5, name: 'Dal Makhani', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200', type: 'veg', unit: 'kg', ratio: 0.12 }
    ],
    'Rice & Breads': [
      { id: 6, name: 'Jeera Rice', img: 'https://images.unsplash.com/photo-1512058560566-d8f437abc49d?w=200', type: 'veg', unit: 'kg', ratio: 0.2 },
      { id: 7, name: 'Butter Naan', img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=200', type: 'veg', unit: 'pcs', ratio: 1.5 }
    ]
  });
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [servicePreference, setServicePreference] = useState('NinjaBox');
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const guests = parseInt(formData.vegGuests) + parseInt(formData.nonVegGuests);
      const { data } = await api.post('/bookings', {
        eventDate: formData.date,
        eventTime: formData.time,
        occasion: formData.occasion,
        guests: guests,
        city: formData.city,
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        serviceType: servicePreference,
        selectedDishes: selectedDishes.map(d => ({
          productId: d.id,
          name: d.name,
          qty: d.qty,
          unit: d.unit
        })),
        totalPrice: calculateTotal() + (servicePreference === 'NinjaBuffet' ? 4000 : 0)
      });
      
      if (data.success) {
        setOrderSuccess(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProductById = async (productId, guestsCount) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/menus/products/${productId}`);
      if (data.success) {
        const p = data.product;
        const guests = parseInt(guestsCount) || 10;
        const ratio = p.ratio || (p.unit === 'pcs' ? 2.5 : 0.15);
        let qty = guests * ratio;
        if (p.unit === 'pcs') qty = Math.ceil(qty);
        else qty = parseFloat(qty.toFixed(1));

        setSelectedDishes([{
          id: p._id,
          name: p.name,
          img: p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
          type: p.isVeg ? 'veg' : 'non-veg',
          unit: p.unit || 'pcs',
          ratio: ratio,
          qty: qty || 1,
          price: p.price || 150
        }]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuDishes = async (menuId, guestsCount) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/menus/${menuId}/dishes`);
      if (data.success) {
        const guests = parseInt(guestsCount) || 10;
        const dishes = data.dishes.map(d => {
          const ratio = d.ratio || (d.course?.toLowerCase() === 'starter' ? 2.5 : 0.15);
          let qty = guests * ratio;
          if (d.unit === 'pcs' || d.course?.toLowerCase() === 'starter' || d.course?.toLowerCase() === 'bread') {
            qty = Math.ceil(qty);
          } else {
            qty = parseFloat(qty.toFixed(1));
          }
          return {
            id: d._id,
            name: d.name,
            img: d.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
            type: d.isVeg ? 'veg' : 'non-veg',
            unit: d.unit || (d.course?.toLowerCase() === 'starter' ? 'pcs' : 'kg'),
            ratio: ratio,
            qty: qty || 1,
            price: d.price || 150
          };
        });
        setSelectedDishes(dishes);
      }
    } catch (error) {
      console.error('Error fetching menu dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/menus/products');
      if (data.success) {
        const grouped = data.products.reduce((acc, p) => {
          const cat = p.dishType || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({
            id: p._id,
            name: p.name,
            img: p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
            type: p.isVeg ? 'veg' : 'non-veg',
            unit: p.unit || 'pcs',
            ratio: p.ratio || 1,
            price: p.price
          });
          return acc;
        }, {});
        
        if (Object.keys(grouped).length > 0) {
          setAvailableDishes(grouped);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const guests = parseInt(formData.vegGuests) + parseInt(formData.nonVegGuests);
    if (selectedDishes.length > 0) {
      const updated = selectedDishes.map(d => {
        if (d.isManual) return d;
        const ratio = d.ratio || (d.unit === 'pcs' ? 2.5 : 0.15);
        let newQty = guests * ratio;
        if (d.unit === 'pcs') newQty = Math.ceil(newQty);
        else newQty = parseFloat(newQty.toFixed(1));
        return { ...d, qty: newQty || 1 };
      });
      if (JSON.stringify(updated) !== JSON.stringify(selectedDishes)) {
        setSelectedDishes(updated);
      }
    }
  }, [formData.vegGuests, formData.nonVegGuests, availableDishes]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const menuId = searchParams.get('menuId');
    const productId = searchParams.get('productId');
    const menuParam = searchParams.get('menuType');
    const productParam = searchParams.get('productType');
    
    if (menuId || productId || menuParam || productParam) {
      const guests = searchParams.get('guests') || '10';
      setFormData(prev => ({
        ...prev,
        occasion: searchParams.get('occasion') || '',
        date: searchParams.get('date') || '',
        time: searchParams.get('time') || '',
        vegGuests: guests
      }));
      
      if (menuId) {
        fetchMenuDishes(menuId, guests);
      } else if (productId) {
        fetchProductById(productId, guests);
      }
      setStep(3);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDish = (item) => {
    if (selectedDishes.find(d => d.id === item.id)) {
      setSelectedDishes(selectedDishes.filter(d => d.id !== item.id));
    } else {
      setSelectedDishes([...selectedDishes, item]);
    }
  };

  const updateQty = (id, delta) => {
    setSelectedDishes(prev => prev.map(d =>
      d.id === id ? { ...d, qty: Math.max(0.1, d.qty + delta), isManual: true } : d
    ));
  };

  const calculateTotal = () => {
    return selectedDishes.reduce((total, dish) => {
      const price = dish.price || 150;
      return total + (price * (dish.qty || 0));
    }, 0);
  };

  const cities = ["Bangalore", "Gurgaon", "Delhi", "Noida", "Mumbai", "Thane", "Navi-Mumbai", "Ghaziabad", "Pune", "Chennai", "Hyderabad", "Chandigarh"];
  const occasions = ["Birthday", "House Party", "Wedding", "Office Event", "Anniversary"];
  const timeSlots = ["12:00 PM - 12:30 PM", "1:00 PM - 1:30 PM", "7:00 PM - 7:30 PM", "8:00 PM - 8:30 PM"];

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <main className="max-w-md mx-auto pb-24">
        <div className="bg-white py-4 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between px-6">
            {[
              { id: 1, label: 'Select Event', Icon: CalendarCheck },
              { id: 2, label: 'Select Menu', Icon: Utensils },
              { id: 3, label: 'Get Price', Icon: Receipt },
              { id: 4, label: 'Payment', Icon: CreditCard }
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step >= s.id ? 'bg-[#B70C10] shadow-lg scale-110 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <s.Icon className="w-4 h-4" />
                  </div>
                  <p className={`text-[8px] mt-1.5 font-bold uppercase tracking-tighter ${step >= s.id ? 'text-[#B70C10]' : 'text-gray-400'}`}>{s.label}</p>
                </div>
                {idx < 3 && (
                  <div className="h-[1px] flex-1 bg-gray-100 mx-1 mb-4 relative">
                    <div className={`absolute left-0 top-0 h-full bg-[#B70C10] transition-all duration-500 ${step > s.id ? 'w-full' : 'w-0'}`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-6 px-4">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">Event Details</h2>
              <div className="bg-[#FEF5F5] p-6 rounded-2xl flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#B70C10] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                   <PartyPopper size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">Almost There!</h3>
                  <p className="text-gray-500 text-xs mt-1">Fill details to get exact price & availability</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select City</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <MapPin size={18} className="text-[#B70C10]" />
                    <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none">
                      <option value="">Choose City</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Occasion</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <PartyPopper size={18} className="text-gray-300" />
                    <select name="occasion" value={formData.occasion} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none">
                      <option value="">Type</option>
                      {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Date</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <Calendar size={18} className="text-gray-300" />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none" />
                  </div>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Time</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <Clock size={18} className="text-gray-300" />
                    <select name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none">
                      <option value="">Choose Time</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Veg Guest</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    <select name="vegGuests" value={formData.vegGuests} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none">
                      {[10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Non-Veg</label>
                  <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <select name="nonVegGuests" value={formData.nonVegGuests} onChange={handleInputChange} className="w-full bg-transparent font-bold text-sm text-gray-700 outline-none">
                      {[0, 10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.city || !formData.date}
                  className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                >
                  Create Menu <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-black text-gray-800">Select Menu</h2>
                 <div className="bg-red-50 px-3 py-1 rounded-full text-[10px] font-black text-[#B70C10] uppercase">{selectedDishes.length} Items</div>
               </div>
               <div className="space-y-4">
                 {Object.entries(availableDishes).map(([cat, items]) => (
                   <div key={cat} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                     <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                       <span className="font-bold text-gray-700 text-sm">{cat}</span>
                       <ChevronDown size={18} className="text-gray-400" />
                     </div>
                     <div className="p-4 space-y-4">
                       {items.map(item => {
                         const isSelected = selectedDishes.find(d => d.id === item.id);
                         return (
                           <div key={item.id} className="flex items-center gap-4">
                             <img src={item.img} className="w-14 h-14 rounded-xl object-cover" alt={item.name} />
                             <div className="flex-1">
                               <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                 <span className="text-sm font-bold text-gray-800 leading-tight">{item.name}</span>
                               </div>
                             </div>
                             <button onClick={() => toggleDish(item)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-[#B70C10] text-white' : 'bg-gray-100 text-gray-400'}`}>
                               {isSelected ? 'Check' : <Plus size={16} />}
                             </button>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 ))}
               </div>
               <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-4 max-w-md mx-auto">
                 <button onClick={() => setStep(1)} className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    <ArrowRight className="rotate-180" />
                 </button>
                 <button onClick={() => setStep(3)} className="flex-1 bg-[#B70C10] text-white rounded-xl font-black text-lg flex items-center justify-center gap-2">
                   Customize Quantity <ArrowRight size={20} />
                 </button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right duration-300">
               <h2 className="text-2xl font-black text-[#B70C10] mb-6">Menu Summary</h2>
               <div className="bg-[#FFF5F5] p-5 rounded-2xl flex gap-4 mb-8 border border-red-50">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-yellow-500">
                   <Lightbulb size={24} />
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed">
                   Quantities are <span className="font-bold text-gray-800">auto-calculated</span> based on your guest count.
                 </p>
               </div>
               <div className="space-y-6">
                  {selectedDishes.map((dish) => (
                    <div key={dish.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative">
                      <button onClick={() => setSelectedDishes(selectedDishes.filter(d => d.id !== dish.id))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                      <div className="flex gap-4">
                        <img src={dish.img} className="w-16 h-16 rounded-xl object-cover" alt={dish.name} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                             <span className="font-bold text-gray-800 text-sm">{dish.name}</span>
                          </div>
                          <div className="flex items-center bg-red-50 rounded-lg p-1 w-fit gap-4">
                            <button onClick={() => updateQty(dish.id, dish.unit === 'pcs' ? -1 : -0.1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#B70C10] shadow-sm font-black">-</button>
                            <span className="text-xs font-black text-gray-800">{dish.qty.toFixed(dish.unit === 'kg' ? 1 : 0)} {dish.unit}</span>
                            <button onClick={() => updateQty(dish.id, dish.unit === 'pcs' ? 1 : 0.1)} className="w-8 h-8 rounded-lg bg-[#B70C10] flex items-center justify-center text-white shadow-md font-black">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
               <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-4 max-w-md mx-auto">
                 <button onClick={() => setStep(2)} className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                    <ArrowRight className="rotate-180" />
                 </button>
                 <button onClick={() => setStep(4)} className="flex-1 bg-[#B70C10] text-white rounded-xl font-black text-lg flex items-center justify-center gap-2">
                   Check Price <ArrowRight size={20} />
                 </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in duration-300 py-10 text-center">
               {!isVerified ? (
                 <>
                   <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#B70C10]">
                     <User size={40} />
                   </div>
                   <h3 className="text-2xl font-black text-gray-800 mb-2">Order Details</h3>
                   <p className="text-sm text-gray-500 mb-8 px-10">Please provide your details to see the final quote.</p>
                   
                   <div className="space-y-4 px-6 text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name" 
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 font-bold outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number" 
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 font-bold outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                        <textarea 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter full address" 
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-4 font-bold outline-none h-24 resize-none" 
                        />
                      </div>
                      <button 
                        onClick={() => {
                          if(!formData.name || !formData.phone || !formData.address) {
                            alert("Please fill all details!");
                            return;
                          }
                          setIsVerified(true);
                        }} 
                        className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-black text-lg shadow-lg mt-4"
                      >
                        Show Price Summary
                      </button>
                      <button onClick={() => setStep(3)} className="w-full py-2 text-[10px] font-bold text-gray-400 uppercase">Back to Summary</button>
                   </div>
                 </>
               ) : (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#800000] to-[#3a0000] opacity-95"></div>
                    <div className="relative bg-[#FAFAFA] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                       <button onClick={() => setIsVerified(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center shadow-md z-10">
                          <X size={16} />
                       </button>
                       <div className="p-5 text-left">
                          {orderSuccess ? (
                            <div className="text-center py-10 animate-in zoom-in duration-500">
                              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle2 size={50} />
                              </div>
                              <h3 className="text-2xl font-black text-gray-800 mb-2">Order Confirmed!</h3>
                              <p className="text-sm text-gray-500 mb-8">Our team will contact you shortly.</p>
                              <button onClick={() => window.location.href = '/'} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-lg">Back to Home</button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-[15px] font-black text-gray-800 mb-3">Service Preference?</h3>
                              <div className="flex gap-2 mb-6">
                                 <div onClick={() => setServicePreference('NinjaBox')} className={`flex-1 rounded-xl p-2 border-2 ${servicePreference === 'NinjaBox' ? 'border-[#B70C10]' : 'border-gray-200 opacity-60'}`}>
                                    <p className="font-black text-[13px]">NinjaBox</p>
                                    <img src="https://caterninja.com/frontend/web/images/ninjabox/1.png" className="w-full h-12 object-contain" alt="box" />
                                 </div>
                                 <div onClick={() => setServicePreference('NinjaBuffet')} className={`flex-1 rounded-xl p-2 border-2 ${servicePreference === 'NinjaBuffet' ? 'border-[#B70C10]' : 'border-gray-200 opacity-60'}`}>
                                    <p className="font-black text-[13px]">NinjaBuffet</p>
                                    <img src="https://caterninja.com/NEWUI/images/buffet.png" className="w-full h-10 object-cover" alt="buffet" />
                                 </div>
                              </div>
                              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2 mb-4 text-xs">
                                 <div className="flex justify-between font-bold text-gray-600"><span>Food Cost</span><span>Rs. {calculateTotal().toLocaleString()}</span></div>
                                 {servicePreference === 'NinjaBuffet' && <div className="flex justify-between font-bold text-gray-600"><span>Buffet Setup</span><span>Rs. 4,000</span></div>}
                                 <div className="border-t border-dashed my-2"></div>
                                 <div className="flex justify-between font-black text-gray-900 text-sm"><span>Grand Total</span><span>Rs. {Math.round((calculateTotal() + (servicePreference === 'NinjaBuffet' ? 4000 : 0) + 500) * 1.05).toLocaleString()}</span></div>
                              </div>
                              <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-[#B70C10] text-white py-3.5 rounded-lg font-black shadow-md hover:bg-red-800 transition-all mb-4 text-sm disabled:opacity-50">
                                 {loading ? 'Processing...' : 'Place My Order'}
                              </button>
                            </>
                          )}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckPricePage;
