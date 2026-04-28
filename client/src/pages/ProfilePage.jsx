import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  Settings as SettingsIcon, 
  LifeBuoy, 
  History,
  Home,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  ChevronRight,
  Calendar,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const ProfilePage = () => {
  const { user, login, loading, checkUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('Order History');
  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'Order History') {
      fetchMyBookings();
    }
  }, [user, activeTab]);

  const fetchMyBookings = async () => {
    setFetchingBookings(true);
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(email, password);
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Logic for updating profile would go here (requires backend route)
      alert('Profile update functionality linked. Backend sync pending.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDuplicateOrder = async (booking) => {
    if (!confirm('Would you like to repeat this order? This will create a new booking with the same menu and guest configuration.')) return;
    
    try {
      setFetchingBookings(true);
      // We send the core data to a new booking endpoint
      const payload = {
        menuId: booking.menuId?._id || booking.menuId,
        selectedDishes: booking.selectedDishes,
        eventDetails: {
          ...booking.eventDetails,
          date: '', // Clear date so user has to pick a new one
          time: ''
        },
        pricingBreakdown: booking.pricingBreakdown,
        vegGuests: booking.vegGuests,
        nonVegGuests: booking.nonVegGuests
      };
      
      const res = await api.post('/bookings/duplicate', { bookingId: booking._id });
      alert('Order duplicated successfully! Please check your latest booking to set the date/time.');
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error duplicating order');
    } finally {
      setFetchingBookings(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 font-black text-gray-800 tracking-tight">Accessing Secure Vault...</p>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-[90vh] flex flex-col relative overflow-hidden bg-white">
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-[#B70C10] to-[#E31E24] rounded-t-[100px] md:rounded-t-[200px] z-0"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white p-10 rounded-[40px] shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6">
                  <User size={40} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-gray-400 font-bold mt-2">Login to your MSCATERERS account</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold text-center animate-shake">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Login Now
                </button>
              </form>

              <div className="mt-8 text-center">
                 <p className="text-sm font-bold text-gray-400">
                   Don't have an account? <span className="text-red-600 cursor-pointer hover:underline">Register Here</span>
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Order History':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-800">Booking History</h2>
              <button 
                onClick={fetchMyBookings}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-red-600 ${fetchingBookings ? 'animate-spin' : ''}`}
              >
                <Clock size={20} />
              </button>
            </div>
            
            {fetchingBookings ? (
              <div className="py-20 text-center text-gray-300 animate-pulse font-bold">Fetching your culinary history...</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-red-100 transition-all group">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-gray-50 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-lg leading-none">Order #{booking.bookingId || booking._id.slice(-6)}</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                          <Calendar size={12} /> {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-xl font-black text-gray-900 tracking-tight">₹{(booking.pricingBreakdown?.total || 0).toLocaleString()}</div>
                        <div className={`text-[10px] font-black uppercase mt-1 px-2 py-1 rounded-md inline-block ${
                          booking.status === 'Confirmed' ? 'text-emerald-600 bg-emerald-50' : 
                          booking.status === 'Pending' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDuplicateOrder(booking); }}
                          title="Repeat Order"
                          className="p-3 bg-white text-gray-400 hover:text-red-600 border border-gray-100 hover:border-red-100 rounded-2xl transition-all shadow-sm group/btn"
                        >
                          <Copy size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <ChevronRight size={24} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                   <Package size={48} />
                </div>
                <div className="text-center">
                  <p className="font-black text-xl text-gray-800">No Bookings Yet</p>
                  <p className="text-sm font-medium opacity-60 mt-2">Start your premium catering experience today.</p>
                </div>
                <button className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-600/20 hover:scale-105 transition-all">
                  Browse Menu
                </button>
              </div>
            )}
          </div>
        );

      case 'My Addresses':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-800">Primary Address</h2>
            </div>
            
            <div className="space-y-8">
              <div className="p-8 bg-red-50/50 border-2 border-dashed border-red-200 rounded-[40px] relative group overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-5">
                   <MapPin size={160} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20"><Home size={20} /></div>
                  <span className="font-black text-gray-800 uppercase text-xs tracking-widest">Saved Residence</span>
                </div>
                <p className="text-lg text-gray-600 font-bold leading-relaxed max-w-md">
                  {user.address || 'No primary address provided yet. Please update in settings.'}
                </p>
                <button 
                  onClick={() => setActiveTab('Settings')}
                  className="mt-8 flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Edit Address <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-800 mb-10">Account Settings</h2>
            <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-100 focus:border-red-500 focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input type="text" defaultValue={user.phone} className="w-full bg-gray-50 border border-gray-100 focus:border-red-500 focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Read Only)</label>
                <input type="email" readOnly value={user.email} className="w-full bg-gray-100 border border-transparent rounded-2xl p-4 text-sm font-bold text-gray-400 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Delivery Address</label>
                <textarea rows={3} defaultValue={user.address} className="w-full bg-gray-50 border border-gray-100 focus:border-red-500 focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all resize-none" />
              </div>
              <button 
                type="submit"
                disabled={isUpdating}
                className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-sm shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isUpdating ? 'Synchronizing...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        );

      case 'Support':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-800 mb-10">Help & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-[#B70C10] rounded-[50px] text-white shadow-2xl shadow-red-900/40 relative overflow-hidden group">
                 <div className="absolute -right-16 -bottom-16 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <LifeBuoy size={280} />
                 </div>
                 <h3 className="text-3xl font-black mb-4 tracking-tight">Concierge</h3>
                 <p className="text-red-100 font-medium text-sm mb-10 leading-relaxed">Having trouble with an order? Our catering experts are available 24/7 to assist you with everything from menu tweaks to logistics.</p>
                 <button className="bg-white text-[#B70C10] px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-50 transition-all flex items-center gap-3">
                    <Phone size={18} /> Call Support Now
                 </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { label: 'Email Support', icon: Mail, desc: 'Average response: 2 hours' },
                   { label: 'FAQs & Policies', icon: History, desc: 'Find answers quickly' },
                   { label: 'Feedback', icon: CheckCircle2, desc: 'Tell us how we did' }
                 ].map((item, i) => (
                   <div key={i} className="p-8 bg-white border border-gray-100 rounded-[35px] flex items-center justify-between group cursor-pointer hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-gray-50 text-gray-400 group-hover:text-red-600 group-hover:bg-red-50 rounded-2xl transition-all"><item.icon size={24} /></div>
                         <div>
                            <span className="font-black text-gray-800 text-base block leading-none">{item.label}</span>
                            <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-widest">{item.desc}</span>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-200 group-hover:text-red-600 transition-all" />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-red-600 to-red-800 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-36 h-36 bg-white rounded-[50px] shadow-2xl flex items-center justify-center text-red-600 relative group border-[6px] border-white/20"
          >
            <User size={80} />
            <div className="absolute inset-0 bg-red-600/10 rounded-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          <div className="text-center md:text-left text-white">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-4 py-2 rounded-full backdrop-blur-md inline-block mb-4">MSCATERERS Member</span>
              <h1 className="text-5xl font-black tracking-tighter leading-none">{user.name}</h1>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center md:justify-start gap-4 mt-6"
            >
              <div className="flex items-center gap-3 font-bold text-xs bg-black/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10"><Mail size={16} className="text-red-300" /> {user.email}</div>
              {user.phone && <div className="flex items-center gap-3 font-bold text-xs bg-black/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10"><Phone size={16} className="text-red-300" /> {user.phone}</div>}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[50px] shadow-2xl shadow-red-900/5 border border-white sticky top-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 px-4 relative z-10">Navigation Center</h3>
            <div className="space-y-2 relative z-10">
              {[
                { label: 'Order History', icon: History },
                { label: 'My Addresses', icon: MapPin },
                { label: 'Settings', icon: SettingsIcon },
                { label: 'Support', icon: LifeBuoy }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full text-left px-6 py-5 rounded-[25px] font-black text-sm transition-all flex items-center gap-5 group relative overflow-hidden ${
                    activeTab === item.label 
                    ? 'bg-[#B70C10] text-white shadow-2xl shadow-red-500/30 scale-[1.05]' 
                    : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                  {item.label}
                  {activeTab === item.label && (
                    <motion.div layoutId="navBar" className="absolute left-0 w-2 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-12 pt-10 border-t border-gray-50">
               <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Membership Tenure</p>
                  <p className="text-base font-black text-gray-800 italic">Established {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-red-900/5 border border-white min-h-[650px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


