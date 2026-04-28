import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Mail,
  Phone,
  Shield,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  ChevronRight,
  ShieldCheck,
  Zap,
  MoreHorizontal
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'manager': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Syncing identity database...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team & Access</h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform users, roles, and security protocols.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-3">
          <UserPlus size={18} />
          Invite User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs font-medium outline-none focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 bg-white flex items-center gap-2 text-xs font-bold px-4">
                <Filter size={14} />
                Filter
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50">
                <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">User Identity</th>
                <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Contact Vector</th>
                <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Access Role</th>
                <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Joined</th>
                <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all uppercase text-sm border border-slate-200/50">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-tight">{user.name || 'Anonymous User'}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">ID: {String(user?._id || user?.id || '......').slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Mail size={12} className="text-slate-300" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Phone size={12} className="text-slate-300" />
                        {user.phone || '+91 98XXX XXXXX'}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <select 
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer transition-all ${getRoleBadgeStyle(user.role)}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                    >
                      <option value="Customer">Customer</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">System Admin</option>
                    </select>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-xs font-bold text-slate-500">{new Date(user.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
             <div className="py-20 text-center space-y-3">
                <UserX size={48} className="mx-auto text-slate-100" />
                <p className="text-slate-400 font-semibold text-sm">No users found matching your search.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
