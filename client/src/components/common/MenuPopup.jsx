import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Utensils, Zap, ArrowLeft, Calendar, Clock, Cake, AlertTriangle, PartyPopper, ChevronDown, ChevronRight, CheckCircle2, Trash2, User } from 'lucide-react';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MenuPopup = ({ isOpen, onClose, menuData, initialEventDetails }) => {
  const navigate = useNavigate();
  const { user, register, login } = useAuth();
  
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
  const [serviceType, setServiceType] = useState('Food + Service');

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

  const { basePrice, gst, delivery, total } = calculateTotal();

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
        breakdown: { basePrice, gst, delivery, total }
      });
      if (res.data.success) {
        setBookingStatus('success');
        setTimeout(() => {
          onClose();
          setStep(1);
          setBookingStatus('idle');
        }, 3000);
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
            <div className="p-6 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#B70C10] font-heading uppercase tracking-tight">{menuData?.name || 'Package'}</h2>
                  {menuData?.type && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                      menuData.type === 'Veg' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {menuData.type}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] font-medium">{getSummary()}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="bg-[#FFF5F5] px-6 py-4 flex justify-between items-center mb-6">
              <span className="text-slate-600 font-medium text-sm">Starting Price</span>
              <span className="text-[#B70C10] font-bold text-lg">Rs. {menuData?.base_price_per_plate}/-</span>
            </div>
            <div className="px-6 pb-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {loading ? <div className="h-16 bg-slate-50 rounded-xl animate-pulse"></div> : (
                <div className="space-y-8">
                  {starters.length > 0 && (
                    <div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4">STARTERS</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {starters.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
                            <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} className="w-14 h-14 rounded-lg object-cover" alt={item.name} />
                            <span className="font-bold text-slate-800 text-[13px]">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {mains.length > 0 && (
                    <div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4">MAINS</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {mains.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
                            <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} className="w-14 h-14 rounded-lg object-cover" alt={item.name} />
                            <span className="font-bold text-slate-800 text-[13px]">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 pt-2">
              <button onClick={() => setStep(2)} className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                Continue to Booking <Plus size={16} />
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
              <button onClick={() => setStep(1)}><ArrowLeft size={20} /></button>
              <h2 className="text-xl font-bold">Event Details</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <select value={eventDetails.occasion} onChange={(e) => setEventDetails({...eventDetails, occasion: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold outline-none">
                  <option value="">Select Occasion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="House Party">House Party</option>
                </select>
                <select value={eventDetails.date} onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold outline-none">
                  <option value="">Select Date</option>
                  {getUpcomingDates().map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={eventDetails.time} onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 font-bold outline-none">
                  <option value="">Select Time</option>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black text-emerald-600">VEG GUESTS</label>
                <select value={eventDetails.vegGuests} onChange={(e) => setEventDetails({...eventDetails, vegGuests: e.target.value})} className="w-full border rounded-xl p-3 mt-1">
                  {[10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-red-600">NON-VEG</label>
                <select value={eventDetails.nonVegGuests} onChange={(e) => setEventDetails({...eventDetails, nonVegGuests: e.target.value})} className="w-full border rounded-xl p-3 mt-1">
                  {[0, 10, 20, 30, 40, 50, 75, 100].map(n => <option key={n} value={n}>{n} Guests</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => {
              const params = new URLSearchParams({
                menuId: menuData._id,
                menuType: 'Premium',
                productType: 'NinjaBox',
                guests: parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests),
                occasion: eventDetails.occasion,
                date: eventDetails.date,
                time: eventDetails.time
              });
              navigate(`/checkprice?${params.toString()}`);
              onClose();
            }} className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-black text-lg">Check Price</button>
          </div>
        ) : step === 3 ? (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-black text-[#B70C10]">Menu Summary</h2>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {selectedDishes.map((dish, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-2xl border shadow-sm">
                  <img src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} className="w-12 h-12 rounded-xl object-cover" alt={dish.name} />
                  <div className="flex-1">
                    <p className="font-bold text-xs">{dish.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <button onClick={() => updateDishQty(dish.name, -1)} className="w-6 h-6 border rounded">-</button>
                      <span className="text-[10px] font-bold">{dish.qty} {dish.unit}</span>
                      <button onClick={() => updateDishQty(dish.name, 1)} className="w-6 h-6 bg-[#B70C10] text-white rounded">+</button>
                    </div>
                  </div>
                  <Trash2 size={14} className="text-gray-300" onClick={() => removeDish(dish.name)} />
                </div>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-black">Final Quote</button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {!user && !isVerified ? (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#B70C10]">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">Order Details</h3>
                    <p className="text-[10px] text-slate-500">Provide details to see final price</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 font-bold outline-none text-sm" 
                      value={eventDetails.name} 
                      onChange={(e) => setEventDetails({...eventDetails, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="WhatsApp Number" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 font-bold outline-none text-sm" 
                      value={eventDetails.phone} 
                      onChange={(e) => setEventDetails({...eventDetails, phone: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                    <textarea 
                      placeholder="Full Address" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 font-bold outline-none text-sm h-20 resize-none" 
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
                    setIsVerified(true);
                  }} 
                  className="w-full bg-[#B70C10] text-white py-4 rounded-xl font-black shadow-lg mt-2"
                >
                  Show Final Price
                </button>
              </div>
            ) : (
                <div className="space-y-6">
                  {/* Event Summary Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>Service</span><span>{serviceType}</span></div>
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>Guests</span><span>{parseInt(eventDetails.vegGuests) + parseInt(eventDetails.nonVegGuests)}</span></div>
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>Food Cost</span><span>Rs. {basePrice.toLocaleString()}</span></div>
                     {serviceFee > 0 && <div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>Setup Fee</span><span>Rs. {serviceFee.toLocaleString()}</span></div>}
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase"><span>GST (5%)</span><span>Rs. {gst.toLocaleString()}</span></div>
                     <div className="flex justify-between text-lg font-black text-[#B70C10] border-t pt-2 mt-2"><span>Grand Total</span><span>Rs. {total.toLocaleString()}</span></div>
                  </div>
                <button onClick={handleConfirmOrder} disabled={bookingStatus === 'loading'} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black">
                   {bookingStatus === 'loading' ? 'Processing...' : bookingStatus === 'success' ? 'Order Placed!' : 'Confirm Order'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPopup;
