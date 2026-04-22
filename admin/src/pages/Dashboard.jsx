import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
        <ArrowUpRight size={14} />
        {trend}%
      </div>
    </div>
    <div>
      <p className="text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/admin/analytics', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-12 text-slate-400 font-black text-xl animate-pulse">Loading Analytics...</div>;

  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-2">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Download Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Bookings" 
          value={data?.stats?.totalBookings || 0} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
          trend="12"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${data?.stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={IndianRupee} 
          color="bg-emerald-500" 
          trend="24"
        />
        <StatCard 
          title="Total Customers" 
          value={data?.stats?.userCount || 0} 
          icon={Users} 
          color="bg-purple-500" 
          trend="8"
        />
        <StatCard 
          title="Pending Orders" 
          value={data?.stats?.pendingBookings || 0} 
          icon={Clock} 
          color="bg-orange-500" 
          trend="5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Revenue Trends</h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-8">Recent Bookings</h3>
          <div className="space-y-6">
            {data?.recentBookings?.map((booking, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                    {booking.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{booking.customer_name}</h4>
                    <p className="text-sm text-slate-500 font-medium">Booking ID: {booking.booking_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">₹{booking.total_price.toLocaleString()}</div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full mt-1 inline-block ${
                    booking.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors">View All Bookings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
