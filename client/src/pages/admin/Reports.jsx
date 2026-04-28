import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  Users, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';
import api from '../../api/axios';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Generating analytical insights...</div>;

  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  const packagePerformance = [
    { name: 'Premium Buffet', value: 45 },
    { name: 'Executive Meal', value: 30 },
    { name: 'Snack Box Plus', value: 15 },
    { name: 'Budget Mini', value: 10 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1">Deep-dive analytics and performance metrics for MS Caterers.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
             <Download size={16} />
             Export PDF
           </button>
           <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-2">
             <Filter size={16} />
             Time Range
           </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                 <IndianRupee size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                 <ArrowUpRight size={12} /> +12.5%
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">Monthly Revenue</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1 italic">₹{(data?.stats?.totalRevenue || 452000).toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                 <Calendar size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                 <ArrowUpRight size={12} /> +8.2%
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">Conversion Rate</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1 italic">64.2%</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                 <Users size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                 <ArrowDownRight size={12} /> -2.1%
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">User Engagement</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1 italic">{(data?.stats?.userCount || 854).toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <BarChart3 size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                 <ArrowUpRight size={12} /> +18%
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">Average Order Value</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1 italic">₹12,450</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Projection */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Revenue Growth
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Transaction volume over the last 6 months.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Packages */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <PieChartIcon size={20} className="text-emerald-500" />
                Package Popularity
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Order distribution across catering categories.</p>
            </div>
          </div>
          <div className="flex items-center justify-between h-[300px]">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packagePerformance}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {packagePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-48 space-y-4">
               {packagePerformance.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                       <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900">Resource Performance</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Breakdown of efficiency and logistics metrics.</p>
         </div>
         <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Service Speed</span>
                     <span className="text-xs font-black text-emerald-600 uppercase">Elite</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[92%] rounded-full"></div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Customer Satisfaction</span>
                     <span className="text-xs font-black text-blue-600 uppercase">High</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[88%] rounded-full"></div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Logistics Optimization</span>
                     <span className="text-xs font-black text-amber-600 uppercase">Stable</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-[74%] rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Reports;
