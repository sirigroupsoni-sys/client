import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  UtensilsCrossed, 
  Settings, 
  LogOut,
  TrendingUp,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
    { icon: UtensilsCrossed, label: 'Menu Mgmt', path: '/menus' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: TrendingUp, label: 'Reports', path: '/reports' },
    { icon: FileText, label: 'CMS', path: '/cms' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 text-2xl font-black tracking-tighter border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-sm">MS</div>
        ADMIN
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={22} />
            <span className="font-bold tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all duration-300"
        >
          <LogOut size={22} />
          <span className="font-bold tracking-tight">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
