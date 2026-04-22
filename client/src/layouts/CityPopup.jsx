import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Castle, 
  Landmark, 
  Building, 
  Hotel,
  MapPin,
  Trees,
  Church,
  FerrisWheel,
  Store,
  Factory,
  X
} from 'lucide-react';

const cities = [
  { name: 'Bangalore', icon: Landmark },
  { name: 'Gurgaon', icon: Building2 },
  { name: 'Delhi', icon: Castle },
  { name: 'Noida', icon: Building },
  { name: 'Mumbai', icon: Store },
  { name: 'Thane', icon: Factory },
  { name: 'Navi-Mumbai', icon: Hotel },
  { name: 'Ghaziabad', icon: Church },
  { name: 'Pune', icon: Castle },
  { name: 'Chennai', icon: Landmark },
  { name: 'Hyderabad', icon: Landmark },
  { name: 'Chandigarh', icon: Trees },
];

const CityPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup 1.5 seconds after component mounts (page reload)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const handleClose = (cityName = null) => {
    setIsVisible(false);
    if (onClose) onClose(cityName);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
        
        {/* Outer Red Frame - using the exact CaterNinja red color */}
        <div className="bg-[#ba1419] p-3 md:p-4 rounded-[2.5rem] shadow-2xl relative">
          
          {/* Close Button - Positioned exactly as seen in professional apps */}
          <button 
            onClick={() => handleClose()}
            className="absolute -top-1 -right-1 md:-top-3 md:-right-3 bg-white text-[#ba1419] w-8 h-8 md:w-10 md:h-10 rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-100 transition-all z-[20] border-2 border-[#ba1419]"
          >
            <X size={20} className="stroke-[3]" />
          </button>

          {/* Inner White Container */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 relative">
            
            <h2 className="text-center text-[#ba1419] text-2xl font-bold mb-8">
              Choose City
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
              {cities.map((city) => {
                const IconComponent = city.icon;
                return (
                  <button 
                    key={city.name}
                    onClick={() => handleClose(city.name)}
                    className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
                  >
                    <div className="bg-[#f2f2f2] w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center p-3 sm:p-4 group-hover:bg-[#e6e6e6] transition-colors border border-transparent group-hover:border-gray-200">
                      {/* Using Lucide icons as clean thick SVGs matching the style */}
                      <IconComponent strokeWidth={1.5} className="w-full h-full text-gray-800" />
                    </div>
                    <span className="text-[#ba1419] font-medium text-xs sm:text-sm text-center leading-tight">
                      {city.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default CityPopup;
