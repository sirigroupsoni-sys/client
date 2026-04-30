import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Utensils, Zap, ArrowLeft, ArrowRight, Calendar, Clock, Cake, AlertTriangle, PartyPopper, ChevronDown, ChevronRight, CheckCircle2, Trash2, User, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

const MenuPopup = ({ isOpen, onClose, menuData, initialEventDetails }) => {
  const navigate = useNavigate();
  const { user, register, login } = useAuth();
  
  const resolveImg = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
    if (img.startsWith('http')) return img;
    const baseUrl = 'https://mscaterers-server.onrender.com';
    return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
  };
  
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [eventDetails, setEventDetails] = useState({
    occasion: '',
    date: '',
    time: '',
    vegGuests: '10',
    nonVegGuests: '0',
    name: '',
    phone: '',
    address: ''
  });
  const [authDetails, setAuthDetails] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123'
  });
  const [isLoginView, setIsLoginView] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [serviceType, setServiceType] = useState('MS Caterers Buffet');
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (user) {
      setEventDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
      if (showLoginModal) {
        setShowLoginModal(false);
        setIsVerified(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (initialEventDetails) {
      setEventDetails(prev => ({
        ...prev,
        occasion: initialEventDetails.occasion || prev.occasion,
        date: initialEventDetails.date || prev.date,
        time: initialEventDetails.time || prev.time,
        vegGuests: initialEventDetails.guests || prev.vegGuests
      }));
      if (initialEventDetails.serviceType) {
        const typeMap = {
          'BulkFood': 'MS Caterers',
          'FoodService': 'MS Caterers Buffet',
          'LiveServices': 'MS Caterers Live',
          'MealBox': 'Meal Box Delivery'
        };
        setServiceType(typeMap[initialEventDetails.serviceType] || initialEventDetails.serviceType);
      }
    }
  }, [initialEventDetails]);

  useEffect(() => {
    if (isOpen && menuData?._id) {
      fetchDishes(menuData._id);
      setStep(1);
    }
  }, [isOpen, menuData]);

  useEffect(() => {
    const guests = parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests);
    if (selectedDishes.length > 0) {
      const updated = selectedDishes.map(d => {
        const ratio = d.ratio || (d.course?.toLowerCase() === 'starter' ? 2.5 : 0.15);
        let newQty = guests * ratio;
        if (d.unit === 'pcs' || d.course?.toLowerCase() === 'starter' || d.course?.toLowerCase() === 'bread') {
          newQty = Math.ceil(newQty);
        } else {
          newQty = parseFloat(newQty.toFixed(1));
        }
        return { ...d, qty: newQty || 1 };
      });
      setSelectedDishes(updated);
    }
  }, [eventDetails.vegGuests, eventDetails.nonVegGuests, dishes]);

  const fetchDishes = async (menuId) => {
    setLoading(true);
    try {
      const res = await api.get(`/menus/${menuId}/dishes`);
      if (res.data.success) {
        const fetchedDishes = res.data.dishes.map(d => ({
          ...d,
          qty: 1,
          unit: d.course?.toLowerCase() === 'starter' ? 'pcs' : 'kg'
        }));
        setDishes(fetchedDishes);
        setSelectedDishes(fetchedDishes);
      }
    } catch (err) {
      console.error('Error fetching dishes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 15 days for the date selector
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }
    return dates;
  };

  const timeSlots = [
    '12:00 PM', '01:00 PM', '02:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
  ];

  if (!isOpen) return null;

  const starters = dishes.filter(d => d.course?.toLowerCase() === 'starter');
  const mains = dishes.filter(d => d.course?.toLowerCase() === 'main');
  const rice = dishes.filter(d => d.course?.toLowerCase() === 'rice');
  const breads = dishes.filter(d => d.course?.toLowerCase() === 'bread');
  const desserts = dishes.filter(d => d.course?.toLowerCase() === 'dessert');
  
  const getSummary = () => {
    const parts = [];
    const sCount = menuData?.starters_count || starters.length;
    const mCount = menuData?.mains_count || mains.length;
    const brCount = menuData?.bread_rice_count || (rice.length + breads.length);
    const dCount = menuData?.dessert_count || desserts.length;

    if (sCount) parts.push(`${sCount} Starters`);
    if (mCount) parts.push(`${mCount} Mains`);
    if (brCount) parts.push(`${brCount} Bread / Rice`);
    if (dCount) parts.push(`${dCount} Dessert`);
    
    return parts.length > 0 ? parts.join(' + ') : 'Custom Package';
  };

  const calculateTotal = () => {
    const guests = parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests);
    const isBuffet = serviceType?.toLowerCase().includes('buffet');
    const serviceFee = isBuffet ? 4000 : 0;
    const delivery = 500;

    let basePrice = 0;
    if (menuData?.base_price_per_plate && menuData.base_price_per_plate > 0) {
      basePrice = menuData.base_price_per_plate * (guests || 10);
    } else {
      basePrice = selectedDishes.reduce((total, dish) => {
        const price = dish.price || 150;
        return total + (price * (dish.qty || 1));
      }, 0);
    }

    const subtotal = basePrice + serviceFee + delivery;
    const gst = Math.round(subtotal * 0.05);
    return { basePrice, gst, delivery, serviceFee, total: subtotal + gst };
  };

  const updateDishQty = (name, delta) => {
    setSelectedDishes(prev => prev.map(d => 
      d.name === name ? { ...d, qty: Math.max(1, d.qty + delta) } : d
    ));
  };

  const removeDish = (name) => {
    setSelectedDishes(prev => prev.filter(d => d.name !== name));
  };

  const { basePrice, gst, delivery, serviceFee, total } = calculateTotal();

  const handleAuthAndProceed = async () => {
    if (!eventDetails.occasion || !eventDetails.date || !eventDetails.time) {
      alert('Please select Occasion, Date, and Time for your event!');
      return;
    }
    if (user) {
      setStep(3);
      return;
    }
    if (!isLoginView && (!authDetails.name || !authDetails.email || !authDetails.phone)) {
      alert('Please provide your Name, Email, and Phone Number to continue!');
      return;
    }
    setBookingStatus('loading');
    try {
      if (isLoginView) {
        await login(authDetails.email, authDetails.password);
      } else {
        await register(authDetails);
        await login(authDetails.email, authDetails.password);
      }
      setStep(3);
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setBookingStatus('idle');
    }
  };


  const handleConfirmOrder = async () => {
    setBookingStatus('loading');
    try {
      const res = await api.post('/bookings', {
        menuId: menuData._id,
        eventDate: eventDetails.date,
        eventTime: eventDetails.time,
        guests: parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests),
        customerName: eventDetails.name,
        customerPhone: eventDetails.phone,
        deliveryAddress: eventDetails.address,
        totalPrice: total,
        breakdown: { basePrice, gst, delivery, serviceFee, total },
        selectedDishes: selectedDishes.map(d => ({
          productId: d._id,
          name: d.name,
          image: d.image || d.image_url,
          price: d.price,
          qty: d.qty,
          unit: d.unit || 'pcs'
        }))
      });
      if (res.data.success) {
        setConfirmedBookingId(res.data.bookingId);
        setBookingStatus('success');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingStatus('error');
      alert(err.response?.data?.message || 'Booking failed.');
    } finally {
      if (bookingStatus !== 'success') setBookingStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[450px] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {step === 1 ? (
          <>
            <div className="p-8 pb-4 flex justify-between items-start bg-white">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-[#B70C10] font-heading uppercase tracking-tight leading-none">{menuData?.name || 'Package'}</h2>
                  {menuData?.type && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                      menuData.type === 'Veg' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {menuData.type}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{getSummary()}</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-[#B70C10] transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="bg-slate-50 px-8 py-4 flex justify-between items-center mb-6 border-y border-slate-100">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Starting Price</span>
              <span className="text-[#B70C10] font-black text-xl">₹{menuData?.base_price_per_plate}/- <span className="text-[10px] text-slate-400">/ Plate</span></span>
            </div>
            <div className="px-8 pb-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : (
                <div className="space-y-10">
                  {starters.length > 0 && (
                    <div>
                      <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#B70C10] rounded-full"></div>
                        STARTERS ({starters.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {starters.map((item, i) => (
                          <div key={i} className="flex items-center gap-5 bg-white group">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                               <img src={resolveImg(item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                            </div>
                            <span className="font-bold text-slate-800 text-sm tracking-tight">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {mains.length > 0 && (
                    <div>
                      <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#B70C10] rounded-full"></div>
                        MAIN COURSE ({mains.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {mains.map((item, i) => (
                          <div key={i} className="flex items-center gap-5 bg-white group">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                               <img src={resolveImg(item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                            </div>
                            <span className="font-bold text-slate-800 text-sm tracking-tight">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-8 pt-4 bg-white border-t border-slate-50">
              <button onClick={() => setStep(2)} className="w-full bg-[#B70C10] text-white py-4.5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 hover:bg-red-800 transition-all transform active:scale-[0.98]">
                See Final Price <ArrowRight size={20} />
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <div className="bg-white">
            {/* Header with Back Button */}
            <div className="p-6 pb-2 flex items-center gap-4">
              <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Event Details</h2>
            </div>

            <div className="p-8 pt-2 space-y-8">
              {/* "Almost There" Progress Banner */}
              <div className="bg-[#FFF5F5] p-6 rounded-3xl flex items-center gap-5 border border-red-50">
                <div className="w-14 h-14 bg-[#B70C10] rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-600/20">
                   <PartyPopper size={28} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg leading-none mb-1.5">Almost There!</h3>
                  <p className="text-slate-500 text-[11px] font-bold leading-tight">Fill details to get exact price & availability</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Occasion */}
                <div className="col-span-2 relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B70C10]">
                    <Cake size={20} />
                  </div>
                  <select 
                    value={eventDetails.occasion} 
                    onChange={(e) => setEventDetails({...eventDetails, occasion: e.target.value})} 
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 font-bold text-slate-700 outline-none focus:border-[#B70C10] appearance-none transition-all shadow-sm"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Birthday">Birthday</option>
                    <option value="House Party">House Party</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Office Event">Office Event</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Date */}
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B70C10]">
                    <Calendar size={20} />
                  </div>
                  <input 
                    type="date"
                    value={eventDetails.date} 
                    onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})} 
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4.5 pl-14 pr-4 font-bold text-slate-700 outline-none focus:border-[#B70C10] transition-all shadow-sm text-sm"
                  />
                </div>

                {/* Time */}
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B70C10]">
                    <Clock size={20} />
                  </div>
                  <select 
                    value={eventDetails.time} 
                    onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})} 
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 font-bold text-slate-700 outline-none focus:border-[#B70C10] appearance-none transition-all shadow-sm text-sm"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Guest Count Header */}
                <div className="col-span-2 pt-2">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Guest Count Details</h4>
                   <div className="flex gap-4">
                      {/* Veg Guests */}
                      <div className="flex-1 relative">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">VEG</label>
                        </div>
                        <select 
                          value={eventDetails.vegGuests} 
                          onChange={(e) => setEventDetails({...eventDetails, vegGuests: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-100 rounded-2xl pt-9 pb-3 px-4 font-black text-slate-800 outline-none focus:border-[#B70C10] appearance-none transition-all"
                        >
                          {[10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                        </select>
                        <div className="absolute right-4 bottom-4 pointer-events-none text-slate-300">
                          <ChevronDown size={16} />
                        </div>
                      </div>

                      {/* Non-Veg Guests */}
                      <div className="flex-1 relative">
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NON-VEG</label>
                        </div>
                        <select 
                          value={eventDetails.nonVegGuests} 
                          onChange={(e) => setEventDetails({...eventDetails, nonVegGuests: e.target.value})} 
                          className="w-full bg-white border-2 border-slate-100 rounded-2xl pt-9 pb-3 px-4 font-black text-slate-800 outline-none focus:border-[#B70C10] appearance-none transition-all"
                        >
                          {[0, 10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                        </select>
                        <div className="absolute right-4 bottom-4 pointer-events-none text-slate-300">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Gas Supply Warning */}
              <div className="flex gap-3 items-start">
                <AlertTriangle className="text-[#B70C10] flex-shrink-0 mt-0.5" size={18} />
                <p className="text-[10px] font-bold text-[#B70C10] leading-relaxed">
                  Due to the ongoing gas supply limitations across India, certain menu items may not be available till 1st May 2026
                </p>
              </div>

              {/* Action Button */}
              <button onClick={() => {
                const params = new URLSearchParams({
                  menuId: menuData._id,
                  menuType: 'Premium',
                  productType: 'MS Caterers',
                  guests: parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests),
                  occasion: eventDetails.occasion,
                  date: eventDetails.date,
                  time: eventDetails.time
                });
                navigate(`/checkprice?${params.toString()}`);
                onClose();
              }} className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 hover:bg-red-800 transition-all transform active:scale-[0.98]">
                See Final Price <Plus size={20} className="bg-white/20 rounded-md p-0.5" />
              </button>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="p-8 space-y-8 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Menu Summary</h2>
              <button onClick={() => setStep(2)} className="text-[#B70C10] font-bold text-xs uppercase tracking-widest border-b-2 border-[#B70C10] pb-0.5">Edit Event</button>
            </div>
            
            <div className="space-y-4 max-h-[45vh] overflow-y-auto custom-scrollbar pr-2">
              {selectedDishes.map((dish, i) => (
                <div key={i} className="flex items-center gap-5 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group hover:border-[#B70C10]/20 transition-all">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                    <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} className="w-full h-full object-cover" alt={dish.name} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm mb-2">{dish.name}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 gap-4">
                        <button onClick={() => updateDishQty(dish.name, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#B70C10] shadow-sm font-black">-</button>
                        <span className="text-[10px] font-black text-slate-700">{dish.qty} {dish.unit}</span>
                        <button onClick={() => updateDishQty(dish.name, 1)} className="w-8 h-8 bg-[#B70C10] text-white rounded-lg flex items-center justify-center shadow-md font-black">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeDish(dish.name)} className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-slate-200 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <button onClick={() => setStep(4)} className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-800 transition-all">
               Proceed to Final Quote
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-8 bg-white">
            {!user && !isVerified ? (
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-5 mb-2">
                  <div className="w-14 h-14 bg-[#B70C10] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Order Details</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Provide details to see final price</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4.5 font-bold outline-none focus:border-[#B70C10] focus:bg-white transition-all text-sm" 
                      value={eventDetails.name} 
                      onChange={(e) => setEventDetails({...eventDetails, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="WhatsApp Number" 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4.5 font-bold outline-none focus:border-[#B70C10] focus:bg-white transition-all text-sm" 
                      value={eventDetails.phone} 
                      onChange={(e) => setEventDetails({...eventDetails, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                    <textarea 
                      placeholder="Full Address" 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4.5 font-bold outline-none focus:border-[#B70C10] focus:bg-white transition-all text-sm h-24 resize-none" 
                      value={eventDetails.address} 
                      onChange={(e) => setEventDetails({...eventDetails, address: e.target.value})} 
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    if(!eventDetails.name || !eventDetails.phone || !eventDetails.address) {
                      alert("Please fill all details!");
                      return;
                    }
                    if (!user) {
                      setShowLoginModal(true);
                    } else {
                      setIsVerified(true);
                    }
                  }} 
                  className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 hover:bg-red-800 transition-all mt-4"
                >
                  Show Final Price Summary
                </button>
              </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-1">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-2">
                       <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Final Quote</h3>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Review your event summary</p>
                  </div>

                  {/* Service Selection Toggles */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Service Plan</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setServiceType('MS Caterers')}
                        className={`p-3.5 rounded-2xl border-2 transition-all text-left relative flex flex-col gap-1 ${
                          serviceType === 'MS Caterers' 
                          ? 'border-[#B70C10] bg-red-50/50 ring-1 ring-red-100' 
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <span className={`font-black text-xs ${serviceType === 'MS Caterers' ? 'text-[#B70C10]' : 'text-slate-900'}`}>MS Caterers</span>
                        <span className="text-[9px] font-bold text-slate-500 leading-tight">Professional Delivery</span>
                      </button>

                      <button 
                        onClick={() => setServiceType('MS Caterers Buffet')}
                        className={`p-3.5 rounded-2xl border-2 transition-all text-left relative flex flex-col gap-1 ${
                          serviceType === 'MS Caterers Buffet' 
                          ? 'border-[#B70C10] bg-red-50/50 ring-1 ring-red-100' 
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <span className={`font-black text-xs ${serviceType === 'MS Caterers Buffet' ? 'text-[#B70C10]' : 'text-slate-900'}`}>MS Caterers Buffet</span>
                        <span className="text-[9px] font-bold text-slate-500 leading-tight">Setup + Servers</span>
                        <div className="absolute -top-2 -right-1 bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-white">+ ₹4k</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 space-y-3">
                     <div className="flex justify-between items-center text-slate-500">
                        <span className="text-[9px] font-black uppercase tracking-widest">Food Cost ({parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests)} Guests)</span>
                        <span className="text-sm font-bold text-slate-700">₹{basePrice.toLocaleString()}</span>
                     </div>
                     
                     {(serviceType?.includes('Buffet') || serviceType?.includes('Service')) && (
                       <div className="flex justify-between items-center text-slate-500">
                         <span className="text-[9px] font-black uppercase tracking-widest">Service & Setup</span>
                         <span className="text-sm font-bold text-slate-700">₹4,000</span>
                       </div>
                     )}

                     <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[9px] font-bold uppercase tracking-widest">GST (5%)</span>
                        <span className="text-xs font-black">₹{gst.toLocaleString()}</span>
                     </div>
                     
                     <div className="pt-3 border-t border-dashed border-slate-200">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[10px] font-black text-[#B70C10] uppercase tracking-[0.2em] mb-1">Grand Total</p>
                              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">₹{total.toLocaleString()}</p>
                           </div>
                           <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black flex items-center gap-1 border border-emerald-100">
                              <ShieldCheck size={12} /> ALL INCLUSIVE
                           </div>
                        </div>
                     </div>
                  </div>

                    {bookingStatus === 'success' ? (
                    <div className="py-10 text-center space-y-6">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-lg shadow-emerald-100">
                        <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Order Placed!</h3>
                        <div className="bg-slate-50 py-3 px-6 rounded-2xl border border-slate-100 inline-block">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking ID</p>
                           <p className="text-lg font-black text-[#B70C10] tracking-tighter">#{confirmedBookingId}</p>
                        </div>
                        <p className="text-slate-500 font-bold text-xs px-6">Your catering request has been received. Our team will call you shortly.</p>
                      </div>
                      <div className="flex flex-col gap-3 px-6">
                        <button 
                          onClick={() => {
                            navigate(`/track-order?id=${confirmedBookingId}`);
                            onClose();
                          }}
                          className="w-full bg-[#B70C10] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          Track My Order <ArrowRight size={16} />
                        </button>
                        <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl active:scale-[0.98] transition-all">
                          Close Window
                        </button>
                      </div>
                    </div>
                  ) : (
                      <>
                        <button 
                          onClick={handleConfirmOrder} 
                          disabled={bookingStatus === 'loading'} 
                          className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-red-600/30 hover:bg-red-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                        >
                          {bookingStatus === 'loading' ? <Loader2 className="animate-spin" /> : (
                            <>
                              Place My Order
                              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" /> Secure Checkout • No Hidden Charges
                        </p>
                      </>
                    )}
              </div>
            )}
          </div>
        )}
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default MenuPopup;
