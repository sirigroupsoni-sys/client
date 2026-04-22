import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, User, Phone, MapPin, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) {
      setShowOtp(true);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-red-600 animate-pulse">Loading MSCATERERS Portal...</div>;

  // If NOT logged in, show the "Enter Your Email" screen (Same as Caterninja)
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col relative overflow-hidden bg-white">
        {/* Background Gradient & Curves */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-red-700 to-red-500 rounded-t-[100px] md:rounded-t-[200px] z-0"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg text-center"
          >
            {/* Illustration */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
              <img 
                src="https://caterninja.com/_next/image?url=%2FNEWUI%2Flogin%2Fimage.png&w=640&q=75" 
                alt="Login Illustration" 
                className="w-64 md:w-80 mx-auto relative z-10"
              />
            </div>

            {!showOtp ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-800 md:text-white">Enter Your Email</h1>
                  <p className="text-gray-500 md:text-red-100 font-medium">Mobile: +91 9845554820 | Name: MS Caterers</p>
                </div>

                <div className="relative max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full bg-white text-gray-900 px-8 py-5 rounded-2xl shadow-xl border-none outline-none text-lg font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full max-w-md bg-red-800 hover:bg-red-900 text-white py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 group"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black text-white">Enter OTP</h1>
                  <p className="text-red-100 font-medium">Verification code sent to {email}</p>
                </div>

                <div className="flex justify-center gap-2 md:gap-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-16 md:w-16 md:h-20 bg-white text-gray-900 text-center text-2xl font-black rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-white/20 transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                    />
                  ))}
                </div>

                <button
                  className="w-full max-w-md bg-white text-red-700 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:bg-red-50 active:scale-95"
                >
                  Verify & Login
                </button>
                
                <button 
                  onClick={() => setShowOtp(false)}
                  className="text-white/80 hover:text-white font-bold text-sm block mx-auto underline underline-offset-4"
                >
                  Change Email
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // If LOGGED in, show actual profile dashboard
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center text-red-600">
            <User size={64} />
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 opacity-90">
              <div className="flex items-center gap-2 font-bold"><Mail size={18} /> {user.email}</div>
              {user.phone && <div className="flex items-center gap-2 font-bold"><Phone size={18} /> {user.phone}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation / Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-6">Menu</h3>
            <div className="space-y-2">
              {['Order History', 'My Addresses', 'Settings', 'Support'].map((item) => (
                <button key={item} className="w-full text-left px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-between group">
                  {item}
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-800">Recent Bookings</h2>
              <button className="text-red-600 font-bold hover:underline">View All</button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Package size={64} className="opacity-20" />
              <p className="font-bold text-lg text-center">No recent bookings found.<br/><span className="text-sm font-medium opacity-60">Your amazing catering journey starts here!</span></p>
              <button className="mt-4 bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-red-600/20 hover:scale-105 transition-all">
                Browse Menus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
