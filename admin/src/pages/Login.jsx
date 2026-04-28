import React, { useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const userRole = res.data.user.role.toLowerCase();
        if (userRole === 'admin' || userRole === 'manager') {
          localStorage.setItem('adminUser', JSON.stringify(res.data.user));
          setAuth(true);
        } else {
          setError('Unauthorized Access: Admin privileges required.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-['Inter']">
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white shadow-2xl mb-6">
             <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CaterAdmin</h1>
          <p className="text-slate-500 font-medium mt-2">Secure access to MS Caterers Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="admin@mscaterers.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none text-sm font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Secret Protocol</label>
                 <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Reset?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-12 outline-none text-sm font-medium transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authenticate Access
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support Footer */}
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          Authorized Personnel Only. System activity is logged. <br />
          <span className="text-slate-300">© 2026 MS Caterers Intel.</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
