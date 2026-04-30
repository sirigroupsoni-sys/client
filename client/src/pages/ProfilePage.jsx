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
  Copy,
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Award,
  Bell,
  LogOut,
  Wallet,
  Star,
  Zap,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const ProfilePage = () => {
  const { user, login, logout, loading, checkUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

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
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDuplicateOrder = async (bookingId) => {
    if (!confirm('Would you like to repeat this order? This will create a new booking with the same menu and guest configuration.')) return;
    
    try {
      setFetchingBookings(true);
      await api.post('/bookings/duplicate', { bookingId });
      alert('Order duplicated successfully! Please check your latest booking to set the date/time.');
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error duplicating order');
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleCancelOrder = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this catering order?')) return;
    try {
      setFetchingBookings(true);
      await api.post(`/bookings/cancel/${bookingId}`);
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling order');
    } finally {
      setFetchingBookings(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Cancelled': return 'bg-slate-50 text-slate-400 border-slate-100';
      case 'Completed': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-400 text-sm tracking-widest uppercase">Initializing Dashboard</p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-white">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6">
                <User size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Premium Catering Access</p>
            </div>
            {loginError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">{loginError}</div>}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" required placeholder="Email Address" className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-red-100 transition-all border border-transparent" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" required placeholder="Password" className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-red-100 transition-all border border-transparent" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all">Login Now</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
        activeTab === id ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
      }`}
    >
      <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} className={activeTab === id ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
      {label}
      {activeTab === id && <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
    </button>
  );

  const StatCard = ({ label, value, icon: Icon, color, trend }) => {
    const colorConfigs = {
      'bg-red-600': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-600' },
      'bg-amber-500': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
      'bg-emerald-500': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
      'bg-purple-500': { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
    };
    
    const config = colorConfigs[color] || colorConfigs['bg-red-600'];

    return (
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${config.dot} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700`}></div>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center ${config.text}`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight size={10} /> {trend}
          </div>
        )}
      </div>
    );
  };

  const filteredBookings = bookings.filter(b => orderFilter === 'All' || b.status === orderFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-10 z-20">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
             <ShoppingBag size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">MSCATERERS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Menu</p>
          <SidebarItem id="Dashboard" label="Overview" icon={LayoutDashboard} />
          <SidebarItem id="Orders" label="My Orders" icon={ShoppingBag} />
          <SidebarItem id="Track" label="Track Order" icon={Zap} />
          <SidebarItem id="Addresses" label="Saved Addresses" icon={MapPin} />
          <SidebarItem id="Wallet" label="Wallet & Rewards" icon={Wallet} />
          
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mt-8 mb-4">Support & Personal</p>
          <SidebarItem id="Notifications" label="Notifications" icon={Bell} />
          <SidebarItem id="Settings" label="Settings" icon={SettingsIcon} />
          <SidebarItem id="Help" label="Help Center" icon={LifeBuoy} />
        </nav>

        <button 
          onClick={logout}
          className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-10 max-h-screen overflow-y-auto custom-scrollbar">
        {/* Top Profile Strip */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 bg-white rounded-[28px] shadow-2xl shadow-slate-200 border border-slate-100 flex items-center justify-center text-red-600 overflow-hidden relative">
                 <User size={40} />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Edit</div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                 <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hi, {user.name} 👋</h1>
                <div className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Award size={12} /> Gold Member
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Mail size={14} className="text-red-400" /> {user.email}</span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Phone size={14} className="text-red-400" /> {user.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-red-200 transition-all">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <Wallet size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Wallet balance</p>
                   <p className="text-lg font-black text-slate-900 tracking-tight mt-1">₹450.00</p>
                </div>
                <button className="ml-4 p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all">
                   <Plus size={16} />
                </button>
             </div>
             <button className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-slate-400 hover:text-red-600 transition-all relative">
                <Bell size={20} />
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></div>
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={bookings.length} icon={ShoppingBag} color="bg-red-600" trend="+12% vs last month" />
                <StatCard label="Active Orders" value={bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length} icon={Zap} color="bg-amber-500" />
                <StatCard label="Total Spent" value={`₹${bookings.reduce((sum, b) => sum + (b.pricingBreakdown?.total || 0), 0).toLocaleString()}`} icon={CreditCard} color="bg-emerald-500" trend="Top 5% Spender" />
                <StatCard label="Loyalty Points" value="1,240" icon={Award} color="bg-purple-500" trend="Gold Tier" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                       Recent Culinary Journeys
                       <div className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md uppercase tracking-widest">Latest</div>
                    </h2>
                    <button onClick={() => setActiveTab('Orders')} className="text-xs font-black text-red-600 hover:gap-2 transition-all flex items-center gap-1.5 uppercase tracking-widest">View All <ArrowRight size={14} /></button>
                  </div>
                  
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map(order => (
                      <div key={order._id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                            {order.menu?.image ? (
                               <img src={order.menu.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full bg-slate-50 flex items-center justify-center text-red-600"><Package size={24} /></div>
                            )}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="font-black text-slate-800">#{order.bookingId || order._id.slice(-6)}</span>
                               <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>{order.status}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(order.createdAt)}</span>
                               <span className="flex items-center gap-1"><Clock size={12} /> {order.eventTime}</span>
                            </div>
                         </div>
                         <div className="text-right pr-4">
                            <p className="text-lg font-black text-slate-900 tracking-tighter">₹{(order.pricingBreakdown?.total || 0).toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Paid via Wallet</p>
                         </div>
                         <button onClick={() => window.location.href = `/track-order?id=${order.bookingId}`} className="p-4 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all">
                            <ChevronRight size={20} />
                         </button>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="py-12 bg-white rounded-[40px] border border-dashed border-slate-200 text-center space-y-4">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto"><ShoppingBag size={32} /></div>
                         <p className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">No recent orders found</p>
                         <button onClick={() => window.location.href = '/package'} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:scale-105 transition-all">Start Your First Order</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                   <div className="bg-gradient-to-br from-[#B70C10] to-[#E31E24] p-8 rounded-[40px] text-white shadow-2xl shadow-red-200 relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                         <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <Star size={24} className="fill-white" />
                         </div>
                         <h3 className="text-2xl font-black mb-2 tracking-tight leading-none">Upgrade to Platinum</h3>
                         <p className="text-red-50/70 font-medium text-xs mb-6 leading-relaxed">Unlock free deliveries, 10% extra loyalty points, and priority concierge support.</p>
                         <button className="w-full bg-white text-[#B70C10] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shadow-xl">Get Membership</button>
                      </div>
                   </div>

                   <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 blur-[80px] rounded-full"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4">
                            <Info size={28} className="text-red-500" />
                         </div>
                         <p className="text-lg font-black tracking-tight mb-2">Need help with an event?</p>
                         <p className="text-slate-400 text-xs font-medium mb-6">Our concierge team can help you plan your custom menu in minutes.</p>
                         <button className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">Connect Now <ArrowRight size={14} /></button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Orders' && !selectedBooking && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h2>
                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                     {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
                        <button 
                          key={f} 
                          onClick={() => setOrderFilter(f)}
                          className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            orderFilter === f ? 'bg-[#B70C10] text-white shadow-lg shadow-red-200' : 'text-slate-400 hover:text-red-600'
                          }`}
                        >
                          {f}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map(order => (
                    <div 
                      key={order._id} 
                      onClick={() => setSelectedBooking(order)}
                      className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-pointer"
                    >
                       <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="w-24 h-24 bg-slate-50 rounded-[30px] flex items-center justify-center text-red-600 overflow-hidden border border-slate-100">
                            {order.menu?.image ? (
                               <img src={order.menu.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <Package size={32} />
                            )}
                          </div>
                          <div className="flex-1 space-y-4">
                             <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Catering Order</p>
                                   <h3 className="text-xl font-black text-slate-800 tracking-tight">#{order.bookingId || order._id.slice(-6)}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                      {order.status}
                                   </div>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                                   <p className="text-xs font-bold text-slate-600">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Date</p>
                                   <p className="text-xs font-bold text-slate-600">{formatDate(order.eventDate)}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                   <p className="text-sm font-black text-slate-900 tracking-tight">₹{(order.pricingBreakdown?.total || 0).toLocaleString()}</p>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex md:flex-col gap-3">
                             <button onClick={(e) => { e.stopPropagation(); window.location.href = `/track-order?id=${order.bookingId}`; }} className="flex-1 md:w-40 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                <Zap size={14} className="text-amber-400" /> Track
                             </button>
                             <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedBooking(order); }} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                   <Search size={14} /> Details
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDuplicateOrder(order._id); }} className="p-3.5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm group/btn" title="Repeat Order">
                                   <Copy size={16} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'Orders' && selectedBooking && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <button onClick={() => setSelectedBooking(null)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-600 transition-all">
                  <ArrowRight size={14} className="rotate-180" /> Back to History
               </button>

               <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-10 text-red-500"><ShoppingBag size={200} /></div>
                     <div className="relative z-10">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Catering Booking Details</span>
                        <h2 className="text-4xl font-black tracking-tighter mt-2">Order #{selectedBooking.bookingId || selectedBooking._id.slice(-6)}</h2>
                        <div className="flex items-center gap-4 mt-6">
                           <div className={`px-4 py-1.5 rounded-full border font-black text-[10px] uppercase tracking-widest ${getStatusStyles(selectedBooking.status)}`}>{selectedBooking.status}</div>
                           <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Calendar size={14} /> Placed {formatDate(selectedBooking.createdAt)}</span>
                        </div>
                     </div>
                     <div className="relative z-10 text-left md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount Paid</p>
                        <p className="text-4xl font-black tracking-tighter text-white">₹{(selectedBooking.pricingBreakdown?.total || 0).toLocaleString()}</p>
                        <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                           <Download size={14} /> Download Invoice
                        </button>
                     </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-2 space-y-10">
                        <section>
                           <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                              <ShoppingBag size={20} className="text-red-600" /> Items Breakdown
                           </h3>
                           <div className="space-y-4">
                              {selectedBooking.selectedDishes?.map((dish, i) => (
                                 <div key={i} className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                                       {dish.image ? <img src={dish.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 font-black">{dish.name.charAt(0)}</div>}
                                    </div>
                                    <div className="flex-1">
                                       <p className="font-black text-slate-800">{dish.name}</p>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {dish.qty} {dish.unit}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="font-black text-slate-900">₹{(dish.price * dish.qty).toLocaleString()}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>

                        <section className="bg-slate-50 p-8 rounded-[35px] border border-slate-100">
                           <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                              <Receipt size={20} className="text-red-600" /> Pricing Summary
                           </h3>
                           <div className="space-y-3">
                              <div className="flex justify-between text-sm font-bold text-slate-500">
                                 <span>Subtotal</span>
                                 <span>₹{(selectedBooking.pricingBreakdown?.subtotal || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm font-bold text-slate-500">
                                 <span>GST (5%)</span>
                                 <span>₹{(selectedBooking.pricingBreakdown?.tax || 0).toLocaleString()}</span>
                              </div>
                              <div className="pt-3 border-t border-slate-200 flex justify-between">
                                 <span className="font-black text-slate-800 uppercase text-xs tracking-widest">Grand Total</span>
                                 <span className="text-xl font-black text-red-600 tracking-tight">₹{(selectedBooking.pricingBreakdown?.total || 0).toLocaleString()}</span>
                              </div>
                           </div>
                        </section>
                     </div>

                     <div className="space-y-10">
                        <section>
                           <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                              <MapPin size={20} className="text-red-600" /> Event Logistics
                           </h3>
                           <div className="space-y-6">
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Occasion</p>
                                 <p className="text-sm font-black text-slate-800">{selectedBooking.occasion || 'General Event'}</p>
                              </div>
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Venue</p>
                                 <p className="text-sm font-bold text-slate-600 leading-relaxed">{selectedBooking.location || selectedBooking.deliveryAddress}</p>
                              </div>
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Date & Time</p>
                                 <p className="text-sm font-black text-slate-800">{formatDate(selectedBooking.eventDate)} at {selectedBooking.eventTime}</p>
                              </div>
                           </div>
                        </section>

                        <div className="p-8 bg-rose-50 rounded-[40px] border border-rose-100">
                           <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-2">Order Support</p>
                           <p className="text-xs font-bold text-rose-400 leading-relaxed mb-6">Need to modify this order or change the venue? Connect with our logistics team.</p>
                           <button className="w-full bg-white text-rose-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-100 flex items-center justify-center gap-2">
                              <Phone size={14} /> Call Support
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl space-y-10">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Account Settings</h2>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Profile & Security</p>
               </div>
               
               <form onSubmit={handleUpdateProfile} className="space-y-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-red-600"><SettingsIcon size={120} /></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                        <div className="relative">
                           <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input type="text" defaultValue={user.name} className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all shadow-inner" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Tether</label>
                        <div className="relative">
                           <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input type="text" defaultValue={user.phone} className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all shadow-inner" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email (Fixed)</label>
                     <div className="relative opacity-60">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="email" readOnly value={user.email} className="w-full pl-14 pr-5 py-5 bg-slate-100 border border-transparent rounded-2xl outline-none font-bold text-sm cursor-not-allowed" />
                     </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Base Address</label>
                     <div className="relative">
                        <MapPin className="absolute left-5 top-6 text-slate-300" size={18} />
                        <textarea rows={4} defaultValue={user.address} className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all shadow-inner resize-none" />
                     </div>
                  </div>

                  <div className="pt-6 relative z-10">
                     <button type="submit" disabled={isUpdating} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                        {isUpdating ? 'Synchronizing...' : 'Update Profile Metadata'}
                        <ShieldCheck size={18} className="text-emerald-500" />
                     </button>
                  </div>
               </form>
               
               <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                     <h4 className="text-xl font-black text-red-600 tracking-tight">Security Vault</h4>
                     <p className="text-red-600/60 text-xs font-bold mt-1 uppercase tracking-widest">Protect your account with a rotating password</p>
                  </div>
                  <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 hover:text-white transition-all">Change Keyphrase</button>
               </div>
            </motion.div>
          )}

          {activeTab === 'Addresses' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Saved Addresses</h2>
                     <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Delivery Locations</p>
                  </div>
                  <button className="bg-[#B70C10] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-105 transition-all flex items-center gap-3">
                     <Plus size={18} /> Add New Address
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[40px] border-2 border-red-100 shadow-2xl shadow-red-500/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-red-600"><Home size={120} /></div>
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200"><Home size={24} /></div>
                        <div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Base</span>
                           <span className="font-black text-slate-800 text-lg tracking-tight block">Home Residence</span>
                        </div>
                        <div className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Default</div>
                     </div>
                     <p className="text-slate-500 font-bold text-sm leading-relaxed mb-10 max-w-xs">{user.address || 'No address provided'}</p>
                     <div className="flex items-center gap-4">
                        <button className="flex-1 bg-slate-50 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Edit Details</button>
                        <button className="w-14 h-14 bg-rose-50 text-rose-500 flex items-center justify-center rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                     </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-all duration-500">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-red-500 transition-all duration-500 mb-6 shadow-sm"><Plus size={40} strokeWidth={3} /></div>
                     <p className="text-lg font-black text-slate-300 group-hover:text-red-600 transition-colors">Add Secondary Address</p>
                     <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-2">Office, Gym, or Event Space</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Notifications</h2>
               <div className="space-y-4">
                  {[
                    { title: 'Order Confirmed!', desc: 'Your catering request #BK-12345 has been confirmed by our kitchen.', time: '2 hours ago', type: 'order' },
                    { title: 'Loyalty Points Earned', desc: 'You earned 250 points from your last order. Keep it up!', time: 'Yesterday', type: 'reward' },
                    { title: 'New Menu Alert!', desc: 'Check out our new Coastal Breeze menu now available for booking.', time: '3 days ago', type: 'offer' }
                  ].map((notif, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-5 hover:border-red-200 transition-all group">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notif.type === 'order' ? 'bg-emerald-50 text-emerald-500' : notif.type === 'reward' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
                          {notif.type === 'order' ? <CheckCircle2 size={24} /> : notif.type === 'reward' ? <Award size={24} /> : <Zap size={24} />}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center justify-between gap-4 mb-1">
                             <h4 className="font-black text-slate-800 tracking-tight">{notif.title}</h4>
                             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{notif.time}</span>
                          </div>
                          <p className="text-slate-500 text-xs font-medium leading-relaxed">{notif.desc}</p>
                       </div>
                       <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'Help' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="bg-[#B70C10] p-12 rounded-[50px] text-white shadow-2xl shadow-red-900/40 relative overflow-hidden group">
                   <div className="absolute -right-16 -bottom-16 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <LifeBuoy size={320} />
                   </div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                      <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[40px] flex items-center justify-center shadow-2xl">
                         <LifeBuoy size={64} className="text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none">Personal Concierge</h3>
                         <p className="text-red-100 font-medium text-lg mb-8 leading-relaxed max-w-xl">Having trouble with an order? Our catering experts are available 24/7 to assist you with everything from menu tweaks to logistics.</p>
                         <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <button className="bg-white text-[#B70C10] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-3 shadow-2xl shadow-red-900/40">
                               <Phone size={18} /> Call Specialist
                            </button>
                            <button className="bg-red-600/40 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all flex items-center gap-3">
                               <Mail size={18} /> Email Support
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { title: 'Order Tracking', icon: Zap, desc: 'Real-time status updates' },
                     { title: 'Refund Policy', icon: Receipt, desc: 'Fair and transparent' },
                     { title: 'Service Areas', icon: MapPin, desc: 'Where we operate' }
                   ].map((item, i) => (
                     <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-red-200 hover:shadow-xl transition-all group cursor-pointer text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 group-hover:text-red-600 transition-all"><item.icon size={28} /></div>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">{item.title}</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'Wallet' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[50px] text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                              <Wallet size={28} className="text-red-500" />
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Credit Balance</p>
                              <p className="text-3xl font-black tracking-tight mt-1">₹450.00</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <button className="w-full bg-[#B70C10] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                              <Plus size={18} /> Add Money to Wallet
                           </button>
                           <button className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">Transaction History</button>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-amber-500"><Award size={140} /></div>
                     <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100"><Award size={32} /></div>
                        <div>
                           <h3 className="text-2xl font-black text-slate-800 tracking-tight">1,240 <span className="text-slate-400 text-sm">Points</span></h3>
                           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Premium Rewards Tier</p>
                        </div>
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-100">
                           <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-sm"></motion.div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-widest">760 Points to Platinum Level</p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center group hover:border-amber-200 transition-all cursor-pointer">
                              <Zap size={24} className="text-amber-500 mx-auto mb-2 group-hover:scale-125 transition-transform" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Redeem</p>
                           </div>
                           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center group hover:border-emerald-200 transition-all cursor-pointer">
                              <Star size={24} className="text-emerald-500 mx-auto mb-2 group-hover:scale-125 transition-transform" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Benefits</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProfilePage;
