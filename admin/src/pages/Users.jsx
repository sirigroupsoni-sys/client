import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Mail,
  Phone,
  Shield,
  Trash2,
  Edit
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
      const res = await axios.get('http://localhost:5000/api/v1/admin/users', { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-slate-400 font-black text-xl animate-pulse">Loading Users...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-2">Manage all system users and their access levels.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-3">
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-red-500/20 outline-none font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-6 font-black text-slate-400 uppercase text-xs tracking-widest px-4">User</th>
                <th className="pb-6 font-black text-slate-400 uppercase text-xs tracking-widest px-4">Contact</th>
                <th className="pb-6 font-black text-slate-400 uppercase text-xs tracking-widest px-4">Role</th>
                <th className="pb-6 font-black text-slate-400 uppercase text-xs tracking-widest px-4">Joined</th>
                <th className="pb-6 font-black text-slate-400 uppercase text-xs tracking-widest px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-white transition-colors uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500 font-medium">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Phone size={14} className="text-slate-400" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <select 
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-none outline-none appearance-none cursor-pointer ${
                        user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                        user.role === 'manager' ? 'bg-blue-100 text-blue-600' :
                        user.role === 'employee' ? 'bg-purple-100 text-purple-600' :
                        'bg-slate-100 text-slate-600'
                      }`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-6 px-4 font-medium text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-6 px-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Edit size={18} />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
