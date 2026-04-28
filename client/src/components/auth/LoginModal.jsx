import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
        setIsLogin(true); // Switch to login after registration
        return;
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Red Gradient Header with Illustration */}
        <div className="bg-gradient-to-b from-[#B70C10] to-[#8a0f12] p-8 pb-12 relative overflow-hidden text-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-30"
          >
            <X size={24} />
          </button>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-40 h-40 mx-auto mb-4 drop-shadow-2xl">
              <img 
                src="/login_illustration.png" 
                alt="Login Illustration" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 font-heading tracking-tight">
              {isLogin ? 'Welcome Back!' : 'Join MS Caterers'}
            </h2>
            <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest">
              {isLogin ? 'Login to manage your bookings' : 'Create an account to start booking'}
            </p>
          </div>
        </div>

        {/* Form Section (White Background) */}
        <div className="bg-white p-8 -mt-6 rounded-t-[32px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold text-center animate-in shake-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B70C10]/5 transition-all font-medium text-sm focus:border-[#B70C10]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B70C10]/5 transition-all font-medium text-sm focus:border-[#B70C10]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B70C10]/5 transition-all font-medium text-sm focus:border-[#B70C10]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {!isLogin && (
              <>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B70C10]/5 transition-all font-medium text-sm focus:border-[#B70C10]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#B70C10] transition-colors" size={18} />
                  <textarea
                    placeholder="Delivery Address"
                    required
                    rows="2"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B70C10]/5 transition-all font-medium text-sm resize-none focus:border-[#B70C10]"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#B70C10] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#B70C10]/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
              {isLogin ? 'Login Now' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#B70C10] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
