import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend, trendType }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trendType === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {trendType === 'up' ? '+' : '-'}{trend}%
      </div>
    </div>
    <div>
      <p className="text-slate-400 font-medium text-sm tracking-tight">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
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

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Fetching system metrics...</div>;

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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">
             Export Data
           </button>
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all">
             Live View
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={data?.stats?.totalBookings || 142} icon={ShoppingBag} color="bg-blue-500" trend="12" trendType="up" />
        <StatCard title="Net Revenue" value={`₹${(data?.stats?.totalRevenue || 452000).toLocaleString()}`} icon={IndianRupee} color="bg-emerald-500" trend="24" trendType="up" />
        <StatCard title="Total Customers" value={data?.stats?.userCount || 854} icon={Users} color="bg-indigo-500" trend="8" trendType="up" />
        <StatCard title="Pending Tasks" value={data?.stats?.pendingBookings || 18} icon={Clock} color="bg-amber-500" trend="5" trendType="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Trends</h3>
            <select className="bg-slate-50 border-slate-200 border rounded-lg px-3 py-1.5 text-xs font-semibold outline-none text-slate-600">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Orders</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>
          <div className="space-y-5">
            {(data?.recentBookings || [
               {customer_name: "Rahul Sharma", total_price: 12500, status: "Confirmed", booking_id: "MSC-1024"},
               {customer_name: "Anita Verma", total_price: 8400, status: "Pending", booking_id: "MSC-1025"},
               {customer_name: "Priya Das", total_price: 21000, status: "Confirmed", booking_id: "MSC-1026"},
               {customer_name: "Vikram Seth", total_price: 5600, status: "Pending", booking_id: "MSC-1027"}
            ]).slice(0, 4).map((booking, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/80 p-2 rounded-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm">
                    {booking.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[14px] tracking-tight leading-none">{booking.customer_name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-1.5">#{booking.booking_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm italic">₹{booking.total_price.toLocaleString()}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                    booking.status === 'Pending' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                  }`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-2">
            View All Activity
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
