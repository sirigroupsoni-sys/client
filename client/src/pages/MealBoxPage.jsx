import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Users,
  Calendar,
  Clock,
  ChevronDown,
  X,
  Plus,
  Cake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MenuPopup from '../components/common/MenuPopup';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

// Local MenuPopup removed to use shared component

const MealBoxPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [formData, setFormData] = useState({
    occasion: '',
    guests: '10',
    date: 'April 28, 2026',
    time: ''
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/menus/category-name/MealBox');
      if (data.success) {
        setMenus(data.menus);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openMenu = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const cities = [
    "Ghaziabad", "Bangalore", "Gurgaon", "Delhi", "Noida", "Mumbai", "Thane",
    "Navi-Mumbai", "Pune", "Hyderabad", "Chennai"
  ];

  // Menus are now fetched from the API and stored in state
  const demoImages = [
    'https://images.unsplash.com/photo-1574071318508-1cdbcd80ad00?q=80&w=800',
    'https://images.unsplash.com/photo-1545231027-63b6f0a05bce?q=80&w=800',
    'https://images.unsplash.com/photo-1530103578275-0712e93b5ee0?q=80&w=800',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800'
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      <MenuPopup 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        menuData={selectedMenu} 
        initialEventDetails={formData}
      />

      {/* Upper Section matching Screenshot */}
      <section className="relative flex flex-col items-center pt-8 bg-[#FAF7F7]">

        {/* Hero Container */}
        <div className="relative w-full max-w-[550px] mx-auto overflow-hidden">
          {/* Main Hero Image */}
          <div className="relative h-[380px] w-full rounded-t-[30px] overflow-hidden shadow-sm bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop"
              alt="Meal Box"
              className="w-full h-full object-cover"
            />
            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Hero Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-[25px] p-8 py-10 shadow-xl text-center w-[85%] border border-white/50">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-1 flex items-center justify-center">
                    <span className="text-[#B70C10]">MS</span>
                    <span className="text-[#333]">CATERERS</span>
                  </h2>
                  <h1 className="text-6xl font-black italic tracking-tighter leading-none">
                    <span className="text-[#333]">Meal</span>
                    <span className="text-[#B70C10]">Box</span>
                  </h1>
                </div>

                <button
                  onClick={() => openMenu(menus[1])}
                  className="bg-[#B70C10] text-white px-12 py-3 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
                >
                  Create Package
                </button>
              </div>
            </div>
          </div>

          {/* Slogan Banner */}
          <div className="relative -mt-10 h-28 w-full z-20">
            <div
              className="bg-[#2D3436] text-white pt-10 pb-6 px-4 flex items-center justify-center"
              style={{
                clipPath: 'path("M 0 40 Q 275 0 550 40 L 550 120 L 0 120 Z")',
                background: '#2D3436'
              }}
            >
              <p className="text-xl font-bold italic tracking-wide text-center">"Savor Every Bite, Ninja Style!"</p>
            </div>
          </div>
        </div>

        {/* 4 Gallery Images Section */}
        <div className="max-w-[1200px] w-full px-4 -mt-4 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
               [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl h-40 bg-gray-200 animate-pulse"></div>
               ))
            ) : menus.slice(0, 4).map((menu, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm hover:scale-[1.05] transition-transform bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => openMenu(menu)}>
                <img
                  src={menu.image || demoImages[i % demoImages.length]}
                  className="w-full h-full object-cover aspect-[1.4/1]"
                  alt={menu.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 bg-[#FAF7F7]">
        <div className="max-w-4xl mx-auto">
          {/* Title with lines */}
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[1px] bg-gray-300 flex-grow"></div>
            <h2 className="text-2xl md:text-3xl font-black text-[#333] whitespace-nowrap">
              Fill the <span className="text-[#B70C10]">details</span> below
            </h2>
            <div className="h-[1px] bg-gray-300 flex-grow"></div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 px-4 mb-10">
            {/* Occasion */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Cake size={16} className="text-[#B70C10]" />
                Occasion
              </label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-800 font-bold text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-red-100 transition-all appearance-none"
              >
                <option value="">Select Occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="House Party">House Party</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* Guest Count */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Users size={16} className="text-[#B70C10]" />
                Guest Count
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-800 font-bold text-base shadow-sm focus:outline-none appearance-none"
              >
                {[10, 20, 30, 40, 50, 75, 100, 150, 200].map(num => (
                  <option key={num} value={num}>{num} Guests</option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Calendar size={16} className="text-[#B70C10]" />
                Event Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-400 text-base shadow-sm focus:outline-none"
              />
            </div>

            {/* Delivery Time */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Clock size={16} className="text-[#B70C10]" />
                Delivery Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-800 font-bold text-base shadow-sm focus:outline-none appearance-none"
              >
                <option value="">Select a Time</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>
          </div>

          {/* View Menu Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => openMenu(menus[1])}
              className="bg-[#F8E9C1] hover:bg-[#F2DCA5] text-[#333] px-6 py-2.5 rounded-xl font-black text-lg flex items-center gap-3 shadow-md transition-all border border-[#F2DCA5]/30 hover:scale-105 active:scale-95"
            >
              <div className="w-6 h-6 border-2 border-[#333] rounded-md flex items-center justify-center">
                <Plus size={16} strokeWidth={4} />
              </div>
              View Menu
            </button>
          </div>

          {/* Submit Button Section */}
          <div className="flex justify-end mt-10 px-4">
            <button 
              onClick={() => {
                const element = document.getElementById('menu-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#B70C10] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1 shadow-md hover:bg-[#960a0d] transition-all"
            >
              Check price <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Menu Cards Section */}
      <section id="menu-section" className="py-16 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
             <div className="flex flex-col items-center py-20">
                <Loader2 className="animate-spin text-[#B70C10] mb-4" size={48} />
                <p className="font-bold text-gray-500">Loading Meal Boxes...</p>
             </div>
          ) : menus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {menus.map((menu, i) => (
                <div key={i} className="group flex flex-col bg-[#1A1C1E] rounded-[30px] overflow-hidden shadow-lg hover:translate-y-[-8px] transition-all duration-300 cursor-pointer" onClick={() => openMenu(menu)}>
                  {/* Image Header - CLICKABLE */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={menu.image || demoImages[i % demoImages.length]} alt={menu.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                    {/* Premium Badge */}
                    <div className="absolute top-0 left-0">
                      <div className="bg-[#D4AF37] text-white text-[10px] font-black px-3 py-1 rounded-br-lg shadow-sm">
                        PREMIUM OPTIONS
                      </div>
                    </div>

                    {/* Veg Icon */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-md flex items-center justify-center p-1">
                      <div className="w-full h-full border-2 border-green-600 rounded-[2px] flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content Area - CLICKABLE */}
                  <div className={`p-5 flex flex-col gap-4 ${menu.special ? 'bg-[#400505]' : ''}`}>
                    <h3 className="text-white font-black text-xl tracking-tight leading-tight min-h-[3rem]">{menu.name}</h3>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Starting from</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-white text-3xl font-black italic tracking-tighter">₹{menu.base_price_per_plate}</span>
                          <span className="text-gray-400 text-[10px] font-bold">per person</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FF9F43] text-[10px] font-black uppercase tracking-tighter">Next Available</p>
                        <p className="text-white text-xs font-black">Tom. 12:30 PM</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMenu(menu);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all ${menu.special ? 'bg-[#B70C10] text-white hover:bg-white hover:text-[#B70C10]' : 'bg-[#F8E9C1] text-[#333] hover:bg-[#F2DCA5]'}`}
                    >
                      <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${menu.special ? 'border-white' : 'border-[#333]'}`}>
                        <Plus size={12} strokeWidth={4} />
                      </div>
                      View Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-gray-500 font-bold">
                No Meal Boxes found. Please seed the database.
             </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-10 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              <span className="text-[#B70C10]">MS</span><span className="text-[#333]">CATERERS</span>
            </h2>
            <p className="text-gray-400 font-medium max-w-sm text-sm">
              MS CATERERS is India's largest digital catering brand, catering to customers' needs, for small or large groups, at home or at office.
            </p>
          </div>

          <div>
            <h3 className="text-[#B70C10] font-black text-lg mb-4">Explore</h3>
            <ul className="space-y-3 text-gray-600 font-bold text-sm">
              <li>Menu & Prices</li>
              <li>Ninja Box</li>
              <li>Ninja Buffet</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#B70C10] font-black text-lg mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-600 font-bold text-sm">
              <li>Blogs</li>
              <li>Videos</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#B70C10] font-black text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-gray-600 font-bold text-sm">
              <li>About Us</li>
              <li>Modification Policy</li>
            </ul>
          </div>
        </div>

        <div className="w-full bg-[#B70C10] py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center text-white gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"></div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"></div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"></div>
            </div>
            <div className="space-y-1">
              <p className="font-black text-xl">MS CATERERS GraveyTech Catering Ventures Pvt Ltd.</p>
              <p className="font-bold text-white/70 text-sm">Bangalore, Mumbai, Pune, Hyderabad, Chennai and Delhi NCR</p>
            </div>
            <p className="text-[10px] font-bold text-white/30">
              Copyright © 2026 MS CATERERS | All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MealBoxPage;
