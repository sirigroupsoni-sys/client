import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, MapPin, Phone, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!trackingId) return;

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/bookings/track/${trackingId}`);
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your ID.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      handleTrack();
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'Confirmed': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'In Progress': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case 'Completed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Cancelled': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-12 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Track Your Order</h1>
          <p className="text-gray-500 text-sm">Enter your unique tracking ID to see real-time updates.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrack} className="mb-12 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-all group-focus-within:text-[#B70C10]">
            <Search size={20} className="text-gray-400 group-focus-within:text-inherit" />
          </div>
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g., BK-123456789)"
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-14 pr-32 font-bold text-gray-800 outline-none focus:border-[#B70C10] shadow-sm transition-all"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-[#B70C10] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-xl font-bold text-sm text-center animate-in shake duration-500">
            {error}
          </div>
        )}

        {booking && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Package size={120} />
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-50 pb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                  <p className="text-lg font-black text-gray-900">{booking.bookingId}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border font-black text-xs uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-bold text-gray-800">{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                      <p className="text-sm font-bold text-gray-800">{booking.customerPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Date</p>
                      <p className="text-sm font-bold text-gray-800">{new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{booking.location || booking.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                Live Timeline
                <div className="w-2 h-2 bg-[#B70C10] rounded-full animate-ping"></div>
              </h3>
              
              <div className="relative space-y-12 ml-4">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100"></div>

                {booking.statusUpdates?.slice().reverse().map((update, idx) => (
                  <div key={idx} className="relative pl-10 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    {/* Circle */}
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-500 ${idx === 0 ? 'bg-[#B70C10] ring-4 ring-red-100' : 'bg-gray-200'}`}></div>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <p className={`text-sm font-black uppercase tracking-widest ${idx === 0 ? 'text-[#B70C10]' : 'text-gray-500'}`}>
                          {update.status}
                        </p>
                        <span className="text-[10px] font-bold text-gray-300">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${idx === 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        {update.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!booking && !loading && !error && (
          <div className="text-center py-20 opacity-20">
            <Package size={80} className="mx-auto mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Enter ID to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
