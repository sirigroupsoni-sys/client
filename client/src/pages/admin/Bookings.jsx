import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Search, 
  Calendar,
  MapPin,
  Users as UsersIcon,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  X,
  Printer,
  FileText,
  Filter
} from 'lucide-react';

const Bookings = () => {
  console.log("Bookings Rendering - CLIENT_ADMIN_V3.0");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError('FORBIDDEN');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Syncing logistics queue...</div>;

  if (error === 'FORBIDDEN') {
    return (
      <div className="p-12 bg-rose-50 border border-rose-100 rounded-3xl text-center">
        <h2 className="text-xl font-bold text-rose-800 mb-2">Admin Access Required</h2>
        <p className="text-rose-600 font-medium text-sm mb-8">
          Your current session is a Customer account. Please login with an Administrator account to view bookings.
        </p>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Logistics</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track all catering event schedules.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
             <Printer size={16} />
             Export Manifest
           </button>
        </div>
      </div>

      {/* Bookings Table-style Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Filter by ID or Name..." className="bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs font-medium outline-none focus:border-blue-500 transition-all w-64" />
               </div>
               <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 bg-white"><Filter size={16} /></button>
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{bookings.length} Records found</span>
         </div>

         <div className="divide-y divide-slate-100">
           {bookings.map((booking) => (
             <div 
               key={booking._id || booking.id} 
               onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}
               className="p-6 flex items-center justify-between group cursor-pointer transition-all hover:bg-slate-50/80"
             >
               <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-lg uppercase shadow-inner border border-slate-200/50">
                    {(booking?.user?.name || booking?.customer_name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                       {booking?.user?.name || booking?.customer_name || 'Unknown Customer'}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                          #{booking?.bookingId || booking?.booking_id || 'N/A'}
                       </span>
                       <span className="text-slate-400 text-xs">•</span>
                       <span className="text-blue-500 font-bold text-xs">{booking?.menu?.name || booking?.menu_name || 'Signature Experience'}</span>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-16 flex-1 justify-end">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs">
                     <Calendar size={14} className="text-slate-400" />
                     {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs">
                     <UsersIcon size={14} className="text-slate-400" />
                     {booking.guestCount || booking.guest_count || 0} Pax
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </div>
                  <div className="text-right w-24">
                     <span className="text-sm font-bold text-slate-900">
                        ₹{(booking?.pricingBreakdown?.total || booking?.total_price || 0).toLocaleString()}
                     </span>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                     <ChevronRight size={20} />
                  </button>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
             {/* Header */}
             <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                <div>
                   <div className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border mb-3 ${getStatusStyle(selectedBooking.status)}`}>
                      {selectedBooking.status}
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedBooking?.user?.name || selectedBooking?.customer_name || 'Unknown'}</h2>
                   <p className="text-xs text-slate-400 font-medium mt-1">Transaction ID: {selectedBooking?.bookingId || selectedBooking?.booking_id || 'N/A'}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X size={20} /></button>
             </div>

             <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={14} className="text-blue-500" /> {selectedBooking?.user?.phone || selectedBooking?.phone || 'N/A'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={14} className="text-blue-500" /> {selectedBooking?.user?.email || selectedBooking?.email || 'N/A'}</p>
                   </div>
                   <div className="space-y-1 col-span-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> {selectedBooking?.location || 'N/A'}</p>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Valuation</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                         ₹{(selectedBooking?.pricingBreakdown?.total || selectedBooking?.total_price || 0).toLocaleString()}
                      </p>
                   </div>
                   <div className="flex gap-3">
                      {selectedBooking.status === 'Pending' && (
                         <>
                            <button 
                               onClick={() => updateStatus(selectedBooking._id || selectedBooking.id, 'Cancelled')}
                               className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                            >
                               Reject
                            </button>
                            <button 
                               onClick={() => updateStatus(selectedBooking._id || selectedBooking.id, 'Confirmed')}
                               className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all"
                            >
                               Confirm Order
                            </button>
                         </>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
