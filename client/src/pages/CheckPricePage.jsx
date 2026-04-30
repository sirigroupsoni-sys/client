import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plus, ChevronDown, Search, Trash2, Calendar, Clock, MapPin, PartyPopper, CalendarCheck, Utensils, Receipt, CreditCard, Lightbulb, MessageCircle, X, Bookmark, CheckCircle2, User, Cake, ShieldCheck, Loader2, Package } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';

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
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
      if (showLoginModal) {
        setShowLoginModal(false);
        setShowFinalModal(true);
      }
    }
  }, [user]);
  const [availableDishes, setAvailableDishes] = useState({
    'Starters': [
      { id: 1, name: 'Tandoori Paneer Tikka', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?w=200', type: 'veg', unit: 'pcs', ratio: 2 },
      { id: 2, name: 'Veg Sheek Kebab', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200', type: 'veg', unit: 'pcs', ratio: 1.5 },
      { id: 3, name: 'Cocktail Samosa', img: 'https://images.unsplash.com/photo-1601050690597-df056fb0ce08?w=200', type: 'veg', unit: 'pcs', ratio: 3 }
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

  const resolveImg = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
    if (img.startsWith('http')) return img;
    const baseUrl = 'https://mscaterers-server.onrender.com';
    return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
  };
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [servicePreference, setServicePreference] = useState('MS Caterers');
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Starters');

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
          image: d.img,
          qty: d.qty || 1,
          unit: d.unit || 'pcs'
        })),
        totalPrice: Math.round((calculateTotal() + (servicePreference === 'MS Caterers Buffet' ? 4000 : 0)) * 1.05)
      });
      
      if (data.success) {
        setOrderSuccess({ id: data.bookingId });
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
            ratio: p.ratio || (p.unit === 'kg' ? 0.15 : 2.5),
            price: p.price || 150
          });
          return acc;
        }, {});

        if (Object.keys(grouped).length > 0) {
          setAvailableDishes(grouped);
          setActiveCategory(Object.keys(grouped)[0]);
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
  }, [formData.vegGuests, formData.nonVegGuests]);

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
      const guests = parseInt(formData.vegGuests) + parseInt(formData.nonVegGuests);
      const ratio = item.ratio || (item.unit === 'pcs' ? 2.5 : 0.15);
      let initialQty = guests * ratio;
      if (item.unit === 'pcs') initialQty = Math.ceil(initialQty);
      else initialQty = parseFloat(initialQty.toFixed(1));

      setSelectedDishes([...selectedDishes, { ...item, qty: initialQty || 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setSelectedDishes(prev => prev.map(d =>
      d.id === id ? { ...d, qty: Math.max(0.1, (d.qty || 0) + delta), isManual: true } : d
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

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 shadow-xl shadow-emerald-100"
        >
          <CheckCircle2 size={48} strokeWidth={3} />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-slate-900 mb-4 tracking-tight"
        >
          Order Placed!
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 font-bold mb-10 max-w-[280px] mx-auto leading-relaxed"
        >
          Your catering request has been received. Our team will contact you shortly.
        </motion.p>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-50 p-8 rounded-[40px] w-full max-w-[340px] border border-slate-100 mb-10 shadow-inner relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 text-red-600">
            <Package size={120} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Booking Tracking ID</p>
          <p className="text-3xl font-black text-[#B70C10] tracking-tighter mb-6">#{orderSuccess.id}</p>
          <button 
            onClick={() => window.location.href = `/track-order?id=${orderSuccess.id}`}
            className="w-full bg-white border border-red-100 text-[#B70C10] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Track Real-time Status <ArrowRight size={14} />
          </button>
        </motion.div>
        <div className="flex flex-col gap-4 w-full max-w-[320px]">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

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
              <div className="bg-gradient-to-r from-[#FFF5F5] to-white p-6 rounded-[28px] flex items-center gap-6 mb-10 border border-red-50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-100/30 rounded-full blur-2xl group-hover:bg-red-200/40 transition-all duration-500"></div>
                <div className="w-16 h-16 bg-[#B70C10] rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-xl shadow-red-600/20 transform group-hover:scale-105 transition-transform duration-300">
                  <PartyPopper size={32} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none mb-2">Almost There!</h3>
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Fill details to get exact price & availability</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Service City</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B70C10] group-focus-within:scale-110 transition-transform">
                      <MapPin size={22} />
                    </div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-gray-800 outline-none focus:border-[#B70C10] focus:ring-4 focus:ring-red-50 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select City</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Occasion</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Cake size={20} />
                      </div>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-10 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm appearance-none cursor-pointer text-sm"
                      >
                        <option value="">Event Type</option>
                        {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Event Date</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Calendar size={20} />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-4 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Delivery Time</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock size={22} />
                    </div>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select Delivery Window</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Guest Count Details</label>
                    <span className="text-[10px] font-black text-[#B70C10] bg-red-50 px-2 py-0.5 rounded-md">Min. 10 Guests</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                      <div className="absolute top-4 left-5 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">VEG</span>
                      </div>
                      <select
                        name="vegGuests"
                        value={formData.vegGuests}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl pt-10 pb-4 px-5 font-black text-gray-800 outline-none focus:border-emerald-500 transition-all shadow-sm appearance-none"
                      >
                        {[10, 20, 30, 40, 50, 75, 100, 150, 200].map(n => <option key={n} value={n}>{n} Guests</option>)}
                      </select>
                      <div className="absolute right-4 bottom-5 pointer-events-none text-gray-300">
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute top-4 left-5 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">NON-VEG</span>
                      </div>
                      <select
                        name="nonVegGuests"
                        value={formData.nonVegGuests}
                        onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl pt-10 pb-4 px-5 font-black text-gray-800 outline-none focus:border-rose-500 transition-all shadow-sm appearance-none"
                      >
                        {[0, 10, 20, 30, 40, 50, 75, 100, 150, 200].map(n => <option key={n} value={n}>{n} Guests</option>)}
                      </select>
                      <div className="absolute right-4 bottom-5 pointer-events-none text-gray-300">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 mb-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.city || !formData.date || !formData.occasion || !formData.time}
                  className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  Create Your Menu <ArrowRight size={24} />
                </button>
                <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-6">Secure Checkout • No Hidden Charges</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight font-heading">Select Menu</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-[#B70C10] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-600/20">Step 2/4</div>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar -mx-4 px-4">
                {Object.keys(availableDishes).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all duration-300 ${activeCategory === cat
                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200 scale-105'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {Object.entries(availableDishes).filter(([cat]) => cat === activeCategory).map(([cat, items]) => (
                  <div key={cat} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-[#B70C10] rounded-full"></div>
                      <h3 className="font-black text-xl text-gray-900 tracking-tight">{cat}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {items.map((item) => {
                        const isSelected = selectedDishes.find(d => d.id === item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleDish(item)}
                            className={`flex items-center gap-5 p-4 rounded-[24px] border-2 transition-all duration-300 cursor-pointer group ${isSelected
                                ? 'bg-red-50/50 border-[#B70C10] shadow-md'
                                : 'bg-white border-gray-50 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100'
                              }`}
                          >
                            <div className="relative flex-shrink-0">
                              <img src={resolveImg(item.img)} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#B70C10] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                  <CheckCircle2 size={14} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className={`w-2.5 h-2.5 rounded-sm border-[1px] flex items-center justify-center p-0.5 ${item.type === 'veg' ? 'border-emerald-500' : 'border-rose-500'}`}>
                                  <div className={`w-full h-full rounded-full ${item.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.type}</span>
                              </div>
                              <h4 className="font-black text-gray-900 text-lg tracking-tight leading-tight mb-1">{item.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium Quality</p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-[#B70C10] text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-gray-100'
                              }`}>
                              <Plus size={24} className={isSelected ? 'rotate-45' : ''} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex gap-4 max-w-md mx-auto z-50">
                <button
                  onClick={() => setStep(1)}
                  className="w-16 h-16 border-2 border-gray-100 rounded-[22px] flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
                >
                  <ArrowRight className="rotate-180" size={24} />
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedDishes.length === 0}
                  className="flex-1 bg-[#B70C10] text-white rounded-[22px] font-black text-xl flex items-center justify-between px-8 shadow-2xl shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <span>Review Menu</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">{selectedDishes.length}</span>
                    </div>
                    <ArrowRight size={24} />
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 duration-500 pb-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight font-heading">Menu Summary</h2>
                <div className="bg-[#B70C10] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-600/20">Step 3/4</div>
              </div>

              <div className="bg-[#FFF5F5] p-6 rounded-[28px] flex gap-5 mb-10 border border-red-50 relative overflow-hidden group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-yellow-500">
                  <Lightbulb size={24} />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-bold">
                  Quantities are <span className="text-[#B70C10] font-black">auto-calculated</span> based on your guest count. Feel free to adjust them!
                </p>
              </div>

              <div className="space-y-6">
                {selectedDishes.map((dish) => (
                  <div key={dish.id} className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-sm relative group hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
                    <button onClick={() => setSelectedDishes(selectedDishes.filter(d => d.id !== dish.id))} className="absolute top-5 right-5 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="flex gap-5">
                      <div className="relative">
                        <img src={resolveImg(dish.img)} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt={dish.name} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="font-black text-gray-900 tracking-tight">{dish.name}</span>
                        </div>

                        <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 w-fit gap-6 border border-gray-100">
                          <button onClick={() => updateQty(dish.id, dish.unit === 'pcs' ? -1 : -0.1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#B70C10] shadow-sm font-black hover:bg-red-50 transition-colors text-xl">-</button>
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-gray-900">{(dish.qty || 0).toFixed(dish.unit === 'kg' ? 1 : 0)}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{dish.unit}</span>
                          </div>
                          <button onClick={() => updateQty(dish.id, dish.unit === 'pcs' ? 1 : 0.1)} className="w-10 h-10 rounded-xl bg-[#B70C10] flex items-center justify-center text-white shadow-lg shadow-red-600/20 font-black hover:bg-red-800 transition-colors text-xl">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex gap-4 max-w-md mx-auto z-50">
                <button onClick={() => setStep(2)} className="w-16 h-16 border-2 border-gray-100 rounded-[22px] flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
                  <ArrowRight className="rotate-180" size={24} />
                </button>
                <button onClick={() => setStep(4)} className="flex-1 bg-[#B70C10] text-white rounded-[22px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30 active:scale-[0.98] transition-all">
                  Calculate Price <ArrowRight size={24} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 py-6">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center text-[#B70C10] mb-6 shadow-inner">
                  <User size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Almost There!</h2>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest px-12">Provide your details to unlock the final quotation</p>
              </div>

              <div className="space-y-6 px-2">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">WhatsApp Number</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500">
                      <MessageCircle size={20} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Delivery Address</label>
                  <div className="relative">
                    <div className="absolute left-5 top-6 text-gray-400">
                      <MapPin size={20} />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete event address..."
                      className="w-full bg-white border-2 border-gray-100 rounded-2xl pt-5 pb-5 pl-14 pr-6 font-bold text-gray-800 outline-none focus:border-[#B70C10] transition-all shadow-sm h-32 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => user ? setShowFinalModal(true) : setShowLoginModal(true)}
                    disabled={loading || !formData.name || !formData.phone || !formData.address}
                    className="w-full bg-[#B70C10] text-white py-5 rounded-[22px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Get Final Quote <ArrowRight size={24} /></>}
                  </button>
                  <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Secure • No Spam • Best Price Guaranteed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showFinalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFinalModal(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl z-10"
            >
              <div className="relative p-6 pb-3 text-center border-b border-slate-50 bg-slate-50/50">
                <button 
                  onClick={() => setShowFinalModal(false)}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-1">
                    <div className="w-12 h-12 bg-[#B70C10] rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-xl shadow-red-600/20">
                       <Receipt size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">Final Quotation</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Review & Place Your Order</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Service Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setServicePreference('MS Caterers')}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col items-center text-center gap-1.5 ${
                        servicePreference === 'MS Caterers' 
                        ? 'border-[#B70C10] bg-red-50/50 shadow-md ring-1 ring-red-100' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${servicePreference === 'MS Caterers' ? 'bg-[#B70C10] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Utensils size={20} />
                      </div>
                      <span className="font-black text-sm text-slate-900">MS Caterers</span>
                      <span className="text-[9px] font-bold text-slate-500 leading-tight">Professional Delivery</span>
                      {servicePreference === 'MS Caterers' && (
                        <motion.div layoutId="active-dot" className="w-1.5 h-1.5 bg-[#B70C10] rounded-full mt-1" />
                      )}
                    </div>

                    <div 
                      onClick={() => setServicePreference('MS Caterers Buffet')}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col items-center text-center gap-1.5 ${
                        servicePreference === 'MS Caterers Buffet' 
                        ? 'border-[#B70C10] bg-red-50/50 shadow-md ring-1 ring-red-100' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${servicePreference === 'MS Caterers Buffet' ? 'bg-[#B70C10] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <User size={20} />
                      </div>
                      <span className="font-black text-sm text-slate-900">MS Caterers Buffet</span>
                      <span className="text-[9px] font-bold text-slate-500 leading-tight">Setup + Full Service</span>
                      <div className="absolute -top-2.5 -right-1 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white">+ ₹4k</div>
                      {servicePreference === 'MS Caterers Buffet' && (
                        <motion.div layoutId="active-dot" className="w-1.5 h-1.5 bg-[#B70C10] rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-slate-500">
                    <div className="flex items-center gap-2">
                      <Utensils size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Food Cost ({parseInt(formData.vegGuests) + parseInt(formData.nonVegGuests)} guests)</span>
                    </div>
                    <span className="font-black text-slate-900">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  {servicePreference === 'MS Caterers Buffet' && (
                    <div className="flex justify-between items-center text-slate-500">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Service & Setup Fee</span>
                      </div>
                      <span className="font-black text-slate-900">₹4,000</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-widest">GST (5%)</span>
                    <span className="text-xs font-black">₹{Math.round((calculateTotal() + (servicePreference === 'MS Caterers Buffet' ? 4000 : 0)) * 0.05).toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-[#B70C10] uppercase tracking-[0.2em] mb-2">Grand Total</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">₹{Math.round((calculateTotal() + (servicePreference === 'MS Caterers Buffet' ? 4000 : 0)) * 1.05).toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-emerald-100 shadow-sm mb-1">
                          <ShieldCheck size={12} /> ALL INCLUSIVE
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-[#B70C10] text-white py-5 rounded-[24px] font-black text-xl shadow-2xl shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-red-800 group"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        Confirm & Place Order 
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" /> Secure Checkout • No Hidden Charges
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default CheckPricePage;
