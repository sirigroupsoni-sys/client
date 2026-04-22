import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Users,
  Calendar,
  Clock,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuPopup = ({ isOpen, onClose, menuData }) => {
  if (!isOpen) return null;

  const starters = [
    { name: 'Bhutteyan De Kebab', img: 'https://images.unsplash.com/photo-1601050633647-81a35137d286?q=80&w=200' },
    { name: 'Paneer Chilgoza', img: 'https://images.unsplash.com/photo-1567184109411-b28f1173b1e5?q=80&w=200' },
    { name: 'Hara mutter ki tikki', img: 'https://images.unsplash.com/photo-1626777553732-48995bc3d186?q=80&w=200' },
    { name: 'Lasooni Khumb Peshawari', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200' }
  ];

  const mains = [
    { name: 'Dal Makhani Special', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200' },
    { name: 'Paneer Butter Masala', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[450px] rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute right-8 top-8 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all z-10"
          >
            <X size={20} />
          </button>
          <h2 className="text-3xl font-black text-[#B70C10] mb-1 tracking-tight">{menuData?.name || 'Indian DeGustibus'}</h2>
          <p className="text-gray-500 text-sm font-bold tracking-tight">4 Starters + 2 Mains + 1 Rice + 1 Breads + 1 Dessert</p>
        </div>

        {/* Price Bar */}
        <div className="bg-[#FEF2F2] px-8 py-4 flex justify-between items-center mb-4 border-y border-red-50/50">
          <span className="text-gray-600 font-bold text-base">Starting Price</span>
          <span className="text-[#B70C10] font-black text-2xl tracking-tighter">₹{menuData?.price || '689'}/-</span>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 pb-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {/* Section: Starters */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#B70C10] rounded-full"></div>
              <h3 className="font-black text-base text-[#333] tracking-widest">STARTERS</h3>
            </div>
            <div className="space-y-4">
              {starters.map((item, i) => (
                <div key={i} className="flex items-center gap-5 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-red-100 hover:shadow-md transition-all group cursor-default">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col gap-1 flex-grow">
                    <span className="font-bold text-base text-[#333] leading-tight">{item.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium Selection</span>
                  </div>
                  <div className="mr-2 text-gray-200 group-hover:text-red-100 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Mains */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#B70C10] rounded-full"></div>
              <h3 className="font-black text-base text-[#333] tracking-widest">MAINS</h3>
            </div>
            <div className="space-y-4">
              {mains.map((item, i) => (
                <div key={i} className="flex items-center gap-5 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-red-100 hover:shadow-md transition-all group cursor-default">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col gap-1 flex-grow">
                    <span className="font-bold text-base text-[#333] leading-tight">{item.name}</span>
                  </div>
                  <div className="mr-2 text-gray-200 group-hover:text-red-100 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-white border-t border-gray-50">
          <button className="w-full bg-[#B70C10] text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-red-500/30 hover:bg-[#960a0d] hover:scale-[1.02] active:scale-[0.98] transition-all">
            Customize & Check Price <Plus size={24} className="bg-white text-[#B70C10] rounded-md p-1" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MealBoxPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [formData, setFormData] = useState({
    city: 'Ghaziabad',
    guests: '',
    date: 'April 23, 2026',
    time: ''
  });

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

  const menus = [
    { name: 'Cocktail Menu', price: '699', img: 'https://images.unsplash.com/photo-1574071318508-1cdbcd80ad00?q=80&w=800' },
    { name: 'Indian DeGustibus', price: '689', img: 'https://images.unsplash.com/photo-1545231027-63b6f0a05bce?q=80&w=800' },
    { name: 'B-Day Party', price: '679', img: 'https://images.unsplash.com/photo-1530103578275-0712e93b5ee0?q=80&w=800' },
    { name: 'Alpha Pack', price: '669', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', special: true },
    { name: 'Pan Asian II', price: '669', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      <MenuPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} menuData={selectedMenu} />

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
            {menus.slice(0, 4).map((menu, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm hover:scale-[1.05] transition-transform bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => openMenu(menu)}>
                <img
                  src={menu.img}
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
            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <MapPin size={16} className="text-[#B70C10]" />
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-400 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-red-100 transition-all appearance-none"
              >
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            {/* Guest Count */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Users size={16} className="text-[#B70C10]" />
                Guest Count
              </label>
              <select
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-400 text-base shadow-sm focus:outline-none appearance-none"
              >
                <option>Select guest count</option>
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
                className="w-full bg-white border border-gray-100 rounded-md px-4 py-3 text-gray-400 text-base shadow-sm focus:outline-none appearance-none"
              >
                <option>Select a Time</option>
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
            <button className="bg-[#B70C10] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1 shadow-md hover:bg-[#960a0d] transition-all">
              Check price <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Menu Cards Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {menus.map((menu, i) => (
              <div key={i} className="group flex flex-col bg-[#1A1C1E] rounded-[30px] overflow-hidden shadow-lg hover:translate-y-[-8px] transition-all duration-300 cursor-pointer" onClick={() => openMenu(menu)}>
                {/* Image Header - CLICKABLE */}
                <div className="relative h-48 overflow-hidden">
                  <img src={menu.img} alt={menu.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

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
                        <span className="text-white text-3xl font-black italic tracking-tighter">₹{menu.price}</span>
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
