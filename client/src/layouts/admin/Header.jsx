import React from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const name = user.name || 'Admin';
  const role = user.role || 'Super Admin';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="w-full bg-slate-100/50 border border-transparent focus:border-blue-500/20 focus:bg-white rounded-xl py-2.5 pl-12 pr-4 outline-none text-sm transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 bg-slate-100/50 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-white transition-all border border-transparent hover:border-slate-100 group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
        </button>

        <div className="w-[1px] h-6 bg-slate-200"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1.5 pl-4 pr-2 bg-slate-100/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <User size={20} />
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Header;
