import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Utensils,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
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

const data = [
  { name: 'Mon', bookings: 40, revenue: 2400 },
  { name: 'Tue', bookings: 30, revenue: 1398 },
  { name: 'Wed', bookings: 60, revenue: 9800 },
  { name: 'Thu', bookings: 45, revenue: 3908 },
  { name: 'Fri', bookings: 80, revenue: 4800 },
  { name: 'Sat', bookings: 95, revenue: 7800 },
  { name: 'Sun', bookings: 70, revenue: 6800 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} shadow-lg text-white`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
          <ArrowUpRight size={14} /> {trend}%
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring your business performance in real-time.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm">Real-time</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50">Last 7 Days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Bookings" value="1,234" icon={CalendarCheck} color="bg-blue-600" trend="12" />
        <StatCard title="Revenue" value="₹45.2L" icon={DollarSign} color="bg-emerald-600" trend="8" />
        <StatCard title="Customers" value="850" icon={Users} color="bg-purple-600" trend="15" />
        <StatCard title="Active Menus" value="12" icon={Utensils} color="bg-orange-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Growth Overview
            </h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600">
              <option>Revenue</option>
              <option>Bookings</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <Clock size={20} className="text-orange-600" />
            Recent Activity
          </h3>
          <div className="space-y-6">
            {[
              { id: 1, text: 'New booking from Rahul', time: '2 mins ago', type: 'booking' },
              { id: 2, text: 'Payment received: ₹12,500', time: '15 mins ago', type: 'payment' },
              { id: 3, text: 'Menu "Desi Darbar" updated', time: '1 hour ago', type: 'menu' },
              { id: 4, text: 'New customer registration', time: '3 hours ago', type: 'user' },
            ].map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-1.5 h-10 rounded-full bg-slate-100 relative overflow-hidden">
                  <div className={`absolute inset-0 ${
                    activity.type === 'booking' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-emerald-500' :
                    activity.type === 'menu' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}></div>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{activity.text}</p>
                  <p className="text-xs text-slate-400 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
            View All Activity
          </button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black tracking-tight">Recent Orders</h3>
          <button className="text-blue-600 font-black text-sm hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: '#BK-001', name: 'Rahul Sharma', date: 'Oct 24, 2024', status: 'Confirmed', amount: '₹12,500' },
                { id: '#BK-002', name: 'Priya Verma', date: 'Oct 28, 2024', status: 'Pending', amount: '₹8,900' },
                { id: '#BK-003', name: 'Amit Singh', date: 'Nov 02, 2024', status: 'Completed', amount: '₹15,200' },
                { id: '#BK-004', name: 'Sneha Kapur', date: 'Nov 05, 2024', status: 'Confirmed', amount: '₹22,100' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-black text-slate-900 tracking-tight">{row.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{row.name.split(' ').map(n => n[0]).join('')}</div>
                      <span className="font-bold text-slate-700">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium">{row.date}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-tight ${
                      row.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' : 
                      row.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-right">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
