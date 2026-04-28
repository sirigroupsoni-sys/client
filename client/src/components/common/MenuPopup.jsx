import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Utensils, Zap, ArrowLeft, Calendar, Clock, Cake, AlertTriangle, PartyPopper, ChevronDown, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MenuPopup = ({ isOpen, onClose, menuData, initialEventDetails }) => {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success, error
  const { user, register, login } = useAuth();
  const [eventDetails, setEventDetails] = useState({
    occasion: '',
    date: '',
    time: '',
    vegGuests: '10',
    nonVegGuests: '0'
  });

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
          'BulkFood': 'Bulk Food (Delivery)',
          'FoodService': 'Food + Service',
          'LiveServices': 'Food + Live Services',
          'MealBox': 'Meal Box Delivery'
        };
        setServiceType(typeMap[initialEventDetails.serviceType] || initialEventDetails.serviceType);
      }
    }
  }, [initialEventDetails]);
  const [authDetails, setAuthDetails] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123' // Default password for fast signup
  });
  const [isLoginView, setIsLoginView] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [serviceType, setServiceType] = useState('Food + Service');

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

  useEffect(() => {
    if (isOpen && menuData?._id) {
      fetchDishes(menuData._id);
      setStep(1); // Reset to step 1 when opening
    }
  }, [isOpen, menuData]);

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

  if (!isOpen) return null;

  const starters = dishes.filter(d => d.course?.toLowerCase() === 'starter');
  const mains = dishes.filter(d => d.course?.toLowerCase() === 'main');
  const rice = dishes.filter(d => d.course?.toLowerCase() === 'rice');
  const breads = dishes.filter(d => d.course?.toLowerCase() === 'bread');
  const desserts = dishes.filter(d => d.course?.toLowerCase() === 'dessert');
  const others = dishes.filter(d => !['starter', 'main', 'rice', 'bread', 'dessert'].includes(d.course?.toLowerCase()));

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
    const basePrice = (menuData?.base_price_per_plate || 0) * (guests || 10);
    const gst = Math.round(basePrice * 0.05); // 5% GST
    const delivery = 500; // Flat delivery
    return { basePrice, gst, delivery, total: basePrice + gst + delivery };
  };

  const updateDishQty = (name, delta) => {
    setSelectedDishes(prev => prev.map(d => 
      d.name === name ? { ...d, qty: Math.max(1, d.qty + delta) } : d
    ));
  };

  const removeDish = (name) => {
    setSelectedDishes(prev => prev.filter(d => d.name !== name));
  };

  const { basePrice, gst, delivery, total } = calculateTotal();

  const handleAuthAndProceed = async () => {
    // 1. Validate Event Details
    if (!eventDetails.eventType || !eventDetails.date || !eventDetails.time) {
      alert('Please select Occasion, Date, and Time for your event!');
      return;
    }

    // 2. If already logged in, just go to summary
    if (user) {
      setStep(3);
      return;
    }

    // 3. Validate Auth Details if registering
    if (!isLoginView && (!authDetails.name || !authDetails.email || !authDetails.phone)) {
      alert('Please provide your Name, Email, and Phone Number to continue!');
      return;
    }
    if (isLoginView && (!authDetails.email || !authDetails.password)) {
      alert('Please provide your Email and Password to login!');
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
      alert(err.response?.data?.message || 'Authentication failed. Please check your details.');
    } finally {
      setBookingStatus('idle');
    }
  };

  const handleConfirmOrder = async () => {
    if (!eventDetails.date || !eventDetails.time) {
      alert('Missing event date or time. Please go back and fill the details.');
      setStep(2);
      return;
    }

    setBookingStatus('loading');
    try {
      const res = await api.post('/bookings', {
        menuId: menuData._id,
        eventDate: eventDetails.date,
        eventTime: eventDetails.time,
        guests: eventDetails.guests,
        totalPrice: total,
        breakdown: { basePrice, gst, delivery, total }
      });

      if (res.data.success) {
        setBookingStatus('success');
        // Close modal after 2 seconds on success
        setTimeout(() => {
          onClose();
          setStep(1);
          setBookingStatus('idle');
        }, 3000);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingStatus('error');
      alert(err.response?.data?.message || 'Booking failed. Please login first.');
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
            {/* Modal Header */}
            <div className="p-6 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#B70C10] font-heading uppercase tracking-tight">{menuData?.name || 'Loading Package...'}</h2>
                  {menuData?.type && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                      menuData.type === 'Veg' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      menuData.type === 'Non-Veg' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {menuData.type}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] font-medium">
                   {getSummary()}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Starting Price Bar */}
            <div className="bg-[#FFF5F5] px-6 py-4 flex justify-between items-center mb-6">
              <span className="text-slate-600 font-medium text-sm">Starting Price</span>
              <span className="text-[#B70C10] font-bold text-lg">₹{menuData?.base_price_per_plate}/-</span>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 pb-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Starters Section */}
                  {starters.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-[3px] h-4 bg-[#B70C10] rounded-full"></div>
                        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">STARTERS</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {starters.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm hover:border-red-100 transition-all">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Utensils size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1">
                               <span className="font-bold text-slate-800 text-[13px] leading-tight">{item.name}</span>
                            </div>
                            <div className={`w-4 h-4 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.type === 'Non-Veg' ? 'border-red-600' : 'border-emerald-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.type === 'Non-Veg' ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mains Section */}
                  {mains.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-[3px] h-4 bg-[#B70C10] rounded-full"></div>
                        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">MAINS</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {mains.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm hover:border-red-100 transition-all">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Utensils size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1">
                               <span className="font-bold text-slate-800 text-[13px] leading-tight">{item.name}</span>
                            </div>
                            <div className={`w-4 h-4 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.type === 'Non-Veg' ? 'border-red-600' : 'border-emerald-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.type === 'Non-Veg' ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bread / Rice Section */}
                  {(breads.length > 0 || rice.length > 0) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-[3px] h-4 bg-[#B70C10] rounded-full"></div>
                        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">BREAD / RICE</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {[...breads, ...rice].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm hover:border-red-100 transition-all">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Utensils size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1">
                               <span className="font-bold text-slate-800 text-[13px] leading-tight">{item.name}</span>
                            </div>
                            <div className={`w-4 h-4 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.type === 'Non-Veg' ? 'border-red-600' : 'border-emerald-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.type === 'Non-Veg' ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dessert Section */}
                  {desserts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-[3px] h-4 bg-[#B70C10] rounded-full"></div>
                        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">DESSERT</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {desserts.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm hover:border-red-100 transition-all">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Utensils size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1">
                               <span className="font-bold text-slate-800 text-[13px] leading-tight">{item.name}</span>
                            </div>
                            <div className={`w-4 h-4 border flex items-center justify-center rounded-sm flex-shrink-0 ${item.type === 'Non-Veg' ? 'border-red-600' : 'border-emerald-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.type === 'Non-Veg' ? 'bg-red-600' : 'bg-emerald-600'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-6 pt-2">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:bg-red-800 transition-all active:scale-[0.98]"
              >
                Continue to Booking
                <div className="bg-white/20 rounded-md p-1">
                   <Plus size={16} strokeWidth={3} />
                </div>
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <div className="animate-in slide-in-from-right duration-300">
            {/* Premium Event Details Header */}
            <div className="p-6 pb-4 flex items-center gap-4 border-b border-gray-50">
              <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Caterninja Banner (Screenshot Match) */}
              <div className="bg-[#FEF5F5] p-8 rounded-[20px] flex items-center gap-6">
                <div className="w-14 h-14 bg-[#B70C10] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                   <Cake className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl leading-tight">Almost There!</h3>
                  <p className="text-gray-400 text-sm mt-1">Fill details to get exact price & availability</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Occasion */}
                <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-2">
                  <img src="https://caterninja.com/NEWUI/icons/occasion.svg" className="w-5 h-5 opacity-40" alt="occasion" />
                  <select 
                    value={eventDetails.occasion}
                    onChange={(e) => setEventDetails({...eventDetails, occasion: e.target.value})}
                    className="w-full text-base font-medium text-gray-600 outline-none appearance-none bg-transparent"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Birthday">Birthday</option>
                    <option value="House Party">House Party</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>

                {/* Date */}
                <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <select 
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                    className="w-full text-base font-medium text-gray-600 outline-none appearance-none bg-transparent"
                  >
                    <option value="">Select Event Date</option>
                    {getUpcomingDates().map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Time */}
                <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  <select 
                    value={eventDetails.time}
                    onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})}
                    className="w-full text-base font-medium text-gray-600 outline-none appearance-none bg-transparent"
                  >
                    <option value="">Select Event Time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GUEST COUNT DETAILS</h4>
              
              <div className="flex gap-4">
                {/* Veg Guests */}
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[15px] font-black text-emerald-600 uppercase tracking-widest">VEG</span>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-base font-medium text-gray-700 outline-none appearance-none"
                      value={eventDetails.vegGuests}
                      onChange={(e) => setEventDetails({...eventDetails, vegGuests: e.target.value})}
                    >
                      {[0, 10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Non-Veg Guests */}
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[15px] font-black text-red-600 uppercase tracking-widest">NON-VEG</span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-base font-medium text-gray-700 outline-none appearance-none"
                      value={eventDetails.nonVegGuests}
                      onChange={(e) => setEventDetails({...eventDetails, nonVegGuests: e.target.value})}
                    >
                      {[0, 10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Gas Warning (Screenshot Match) */}
              <div className="flex gap-2 items-start mt-2">
                <AlertTriangle size={14} className="text-[#E56159] flex-shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-[#E56159] leading-tight">
                  Due to the ongoing gas supply limitations across India, certain menu items may not be available till 28th April 2026
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="w-14 h-14 bg-[#B70C10] rounded-xl flex items-center justify-center text-white shadow-lg"
                >
                  <ArrowLeft size={24} />
                </button>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      menuType: 'Premium',
                      productType: 'NinjaBox',
                      guests: parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests),
                      occasion: eventDetails.occasion,
                      date: eventDetails.date,
                      time: eventDetails.time
                    });
                    navigate(`/checkprice?${params.toString()}`);
                    onClose();
                  }}
                  className="flex-1 bg-[#B70C10] text-white rounded-xl font-black text-xl flex items-center justify-center gap-2 shadow-lg hover:bg-red-800 transition-all active:scale-[0.95]"
                >
                  Check Price
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        ) : step === 3 ? (
          <div className="animate-in slide-in-from-right duration-300">
            {/* Premium Menu Summary Header (Screenshot 2 design) */}
            <div className="p-6 pb-4 flex items-center gap-4 border-b border-gray-50">
              <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-[#B70C10] tracking-tight">Menu Summary</h2>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-[#FFF5F5] border border-red-50 p-4 rounded-xl flex gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Utensils className="w-6 h-6 text-[#B70C10]" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Quantities are <span className="font-bold text-gray-800">auto-calculated</span> based on your guest count. You can adjust them manually if needed.
                </p>
              </div>

              <div className="space-y-4">
                {selectedDishes.map((dish, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-slate-50">
                      <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} className="w-full h-full object-cover" alt={dish.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 border border-emerald-500 flex items-center justify-center p-0.5">
                          <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                        </div>
                        <span className="font-bold text-gray-800 text-xs leading-tight">{dish.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-lg p-1 gap-4">
                          <button onClick={() => updateDishQty(dish.name, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#B70C10] font-black">－</button>
                          <span className="text-[10px] font-black text-gray-800">{dish.qty} {dish.unit}</span>
                          <button onClick={() => updateDishQty(dish.name, 1)} className="w-8 h-8 rounded-lg bg-[#B70C10] flex items-center justify-center shadow-md text-white font-black">＋</button>
                        </div>
                        <Trash2 size={16} className="text-gray-300" onClick={() => removeDish(dish.name)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setStep(2)}
                  className="w-14 h-14 bg-[#B70C10] rounded-xl flex items-center justify-center text-white shadow-lg"
                >
                  <ArrowLeft size={24} />
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="flex-1 bg-[#B70C10] text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                          Check Price
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right duration-300">
             {/* Order Summary Header */}
             <div className="p-6 pb-4 flex items-center gap-4 border-b border-gray-50">
              <button 
                onClick={() => setStep(3)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-[#1a1c1e] tracking-tight">Get Final Price</h2>
            </div>

            <div className="p-6 pt-4 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {!isVerified && !user ? (
                /* Premium OTP/WhatsApp Verification View (Matches Caterninja) */
                <div className="flex flex-col animate-in slide-in-from-right duration-500">
                  {/* Red Gradient Header with Illustration */}
                  <div className="bg-gradient-to-b from-[#B70C10] to-[#8a0f12] p-8 pb-12 relative overflow-hidden text-center">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-48 h-48 mx-auto mb-4 drop-shadow-2xl">
                        <img 
                          src="/otp_verification_illustration.png" 
                          alt="OTP Verification" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 font-heading tracking-tight">
                        Verify OTP & Get Final Price
                      </h3>
                      <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest">
                        Enter details to unlock the best price
                      </p>
                    </div>
                  </div>

                  {/* Input Section (White Background) */}
                  <div className="bg-white p-8 -mt-6 rounded-t-[32px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                    <div className="space-y-4">
                      {!isOtpSent ? (
                        <div className="space-y-4">
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
                            <input 
                              type="text" 
                              placeholder="Your Full Name" 
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-[#B70C10] focus:ring-4 focus:ring-[#B70C10]/5 transition-all"
                              value={authDetails.name}
                              onChange={(e) => setAuthDetails({...authDetails, name: e.target.value})}
                            />
                          </div>
                          <div className="flex gap-3">
                            <div className="relative flex-1 group">
                              <img src="https://caterninja.com/NEWUI/icons/whatsapp.svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 group-focus-within:opacity-100 transition-opacity" alt="whatsapp" />
                              <input 
                                type="tel" 
                                placeholder="WhatsApp Number" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-[#B70C10] focus:ring-4 focus:ring-[#B70C10]/5 transition-all"
                                value={authDetails.phone}
                                onChange={(e) => setAuthDetails({...authDetails, phone: e.target.value})}
                              />
                            </div>
                            <button 
                              onClick={() => authDetails.phone.length >= 10 && setIsOtpSent(true)}
                              className="bg-[#B70C10] text-white px-6 rounded-2xl font-black text-xs shadow-lg shadow-[#B70C10]/20 hover:bg-[#8a0f12] active:scale-95 transition-all"
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Verification code sent to {authDetails.phone}</p>
                            <input 
                              type="text" 
                              placeholder="0 0 0 0" 
                              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-5 font-black text-3xl text-center tracking-[0.5em] outline-none focus:border-[#B70C10] focus:ring-8 focus:ring-[#B70C10]/5 transition-all bg-gray-50/50"
                              maxLength={4}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                            />
                          </div>
                          <button 
                            onClick={() => otp.length === 4 && setIsVerified(true)}
                            className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#B70C10]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            Verify & Show Price
                          </button>
                          <button 
                            onClick={() => setIsOtpSent(false)} 
                            className="w-full text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#B70C10] transition-colors"
                          >
                            Change Phone Number
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Final Price Summary View */
                <div className="space-y-6">
                  {/* Event Summary Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SERVICE TYPE</span>
                        <span className="text-xs font-bold text-[#B70C10]">{serviceType}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PACKAGE</span>
                        <span className="text-xs font-bold text-slate-700">{menuData?.name}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OCCASION</span>
                        <span className="text-xs font-bold text-slate-700">{eventDetails.occasion || 'Birthday'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE & TIME</span>
                        <span className="text-xs font-bold text-slate-700">{eventDetails.date} | {eventDetails.time}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GUESTS</span>
                        <span className="text-xs font-bold text-slate-700">{parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests)} People</span>
                     </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-[#2d3138] uppercase tracking-wider">Bill Details</h4>
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Base Price</span>
                          <span className="text-slate-900 font-bold font-mono text-[13px]">₹{basePrice.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Taxes & GST (5%)</span>
                          <span className="text-slate-900 font-bold font-mono text-[13px]">₹{gst.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Delivery & Service Fee</span>
                          <span className="text-slate-900 font-bold font-mono text-[13px]">₹{delivery.toLocaleString()}</span>
                       </div>
                       <div className="h-[1px] bg-slate-100 my-2"></div>
                       <div className="flex justify-between items-center">
                          <span className="text-base font-black text-slate-900">Total Bill</span>
                          <span className="text-xl font-black text-[#B70C10] font-mono tracking-tighter">₹{total.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  {bookingStatus === 'success' ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-2 animate-in zoom-in duration-500">
                       <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                          <CheckCircle2 size={24} />
                       </div>
                       <h3 className="text-emerald-900 font-black text-lg">Order Received!</h3>
                       <p className="text-emerald-600 text-xs font-bold">Our manager will call you shortly to confirm details.</p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleConfirmOrder}
                      disabled={bookingStatus === 'loading'}
                      className={`w-full ${bookingStatus === 'loading' ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all`}
                    >
                       {bookingStatus === 'loading' ? 'Processing...' : 'Confirm & Place Order'}
                       {bookingStatus !== 'loading' && <Zap size={20} fill="white" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPopup;
