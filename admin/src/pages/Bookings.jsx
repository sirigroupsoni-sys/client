import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/bookings', { withCredentials: true });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/bookings/${id}/status`, { status }, { withCredentials: true });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-600';
      case 'Pending': return 'bg-orange-100 text-orange-600';
      case 'In Progress': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-slate-900 text-white';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (loading) return <div className="p-12 text-slate-400 font-black text-xl animate-pulse">Loading Bookings...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-slate-500 font-medium mt-2">Oversee all customer bookings and event statuses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:border-red-100 transition-all group">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between lg:justify-start lg:gap-6">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </div>
                  <span className="text-slate-400 font-bold text-sm tracking-tight">ID: {booking.booking_id}</span>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 font-black text-2xl">
                    {booking.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{booking.customer_name}</h3>
                    <p className="text-slate-500 font-bold mt-1">{booking.menu_name || 'Custom Menu'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  <div className="flex items-center gap-3 text-slate-600 font-bold">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Calendar size={18} /></div>
                    {new Date(booking.event_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Users size={18} /></div>
                    {booking.guest_count} Guests
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold col-span-2">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><MapPin size={18} /></div>
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-72 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-8">
                <div className="text-right">
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total Value</p>
                  <h4 className="text-3xl font-black text-slate-900 mt-1">₹{parseFloat(booking.total_price).toLocaleString()}</h4>
                </div>

                <div className="flex gap-3 w-full lg:w-auto mt-6">
                  {booking.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(booking.id, 'Confirmed')}
                        className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/10"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button 
                        onClick={() => updateStatus(booking.id, 'Cancelled')}
                        className="flex-1 lg:flex-none bg-red-100 hover:bg-red-200 text-red-600 p-4 rounded-2xl transition-all"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  <button className="flex-1 lg:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all">
                    Details
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
