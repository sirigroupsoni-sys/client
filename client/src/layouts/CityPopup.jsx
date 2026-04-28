import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const cities = [
  { name: 'Bangalore', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/bangloreNew.webp' },
  { name: 'Gurgaon', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/gurgaon.webp' },
  { name: 'Delhi', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/delhi.webp' },
  { name: 'Noida', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/noida.webp' },
  { name: 'Mumbai', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/mumbai.webp' },
  { name: 'Thane', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/thane.webp' },
  { name: 'Navi-Mumbai', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/navi-mumbai.webp' },
  { name: 'Ghaziabad', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/ghaziabad.webp' },
  { name: 'Pune', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/fort.webp' },
  { name: 'Chennai', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/chennai.webp' },
  { name: 'Hyderabad', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/hyderabad.webp' },
  { name: 'Chandigarh', img: 'https://d3t167u6bqq6i3.cloudfront.net/frontend/cities_webp/chandigarh.webp' },
];

const CityPopup = ({ onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check if city is already selected in localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (!savedCity && !isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = (cityName = null) => {
    setIsVisible(false);
    if (onClose) onClose(cityName);
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-300">
        
        {/* Outer Red Frame */}
        <div className="bg-[#B70C10] p-4 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          {/* Inner White Container */}
          <div className="bg-white rounded-[2.5rem] p-8 relative overflow-hidden">
            
            {/* Close Button */}
            <button 
              onClick={() => handleClose()}
              className="absolute top-6 right-6 bg-gray-50 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-all z-10 border border-gray-100"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-[#B70C10] text-2xl font-black mb-1 uppercase tracking-tighter">
                Choose Your City
              </h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">To serve you better, please select your location</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B70C10] transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search for your city..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-[#B70C10] focus:ring-4 focus:ring-[#B70C10]/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-6 max-h-[400px] overflow-y-auto custom-scrollbar px-2">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button 
                    key={city.name}
                    onClick={() => handleClose(city.name)}
                    className="flex flex-col items-center gap-3 group transition-all"
                  >
                    <div className="w-20 h-20 rounded-2xl border-2 border-gray-50 flex items-center justify-center p-3 shadow-sm group-hover:shadow-xl group-hover:border-[#B70C10]/20 bg-white transition-all overflow-hidden relative">
                      <img 
                        src={city.img} 
                        alt={city.name} 
                        className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                      />
                      {/* Active indicator */}
                      <div className="absolute inset-0 bg-[#B70C10]/0 group-hover:bg-[#B70C10]/5 transition-colors"></div>
                    </div>
                    <span className="text-gray-900 font-black text-[11px] uppercase text-center leading-tight tracking-wide group-hover:text-[#B70C10] transition-colors">
                      {city.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="col-span-4 py-10 text-center">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No cities found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPopup;
