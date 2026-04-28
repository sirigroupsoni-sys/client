import React from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api/axios';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  UtensilsCrossed, 
  Package,
  Settings, 
  LogOut,
  TrendingUp,
  FileText,
  ChevronLeft,
  Menu as MenuIcon
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
    { icon: UtensilsCrossed, label: 'Menu Mgmt', path: '/menus' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: TrendingUp, label: 'Reports', path: '/reports' },
    { icon: FileText, label: 'CMS', path: '/cms' },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.error('Server logout failed');
    }
    localStorage.removeItem('adminUser');
    window.location.reload();
  };

  return (
    <div className={`h-screen bg-[#0F172A] text-slate-300 flex flex-col fixed left-0 top-0 z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}>
      {/* Brand Header */}
      <div className={`p-8 mb-4 flex items-center justify-between overflow-hidden whitespace-nowrap`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">MS</div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight tracking-tight">CaterAdmin</span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">SaaS Edition</span>
             </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <MenuIcon size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-blue-600/10 text-blue-500 font-semibold' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`
            }
          >
            <div className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
               <item.icon size={22} strokeWidth={2.2} />
            </div>
            {!isCollapsed && <span className="tracking-tight text-sm">{item.label}</span>}
            
            <div 
              className={`absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full transition-opacity ${
                window.location.pathname === item.path || (item.path !== '/' && window.location.pathname.startsWith(item.path)) 
                ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </NavLink>
        ))}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <button className={`flex items-center gap-4 px-4 py-3.5 w-full text-slate-400 hover:bg-slate-800 rounded-xl transition-all group overflow-hidden whitespace-nowrap`}>
          <div className={isCollapsed ? 'mx-auto' : ''}>
             <Settings size={22} strokeWidth={2.2} />
          </div>
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-4 px-4 py-3.5 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all overflow-hidden whitespace-nowrap`}
        >
          <div className={isCollapsed ? 'mx-auto' : ''}>
             <LogOut size={22} strokeWidth={2.2} />
          </div>
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
