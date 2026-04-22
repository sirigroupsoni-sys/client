import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomPackageBanner = () => {
  return (
    <section className="w-full mt-4 mb-4">
      
      {/* Banner Container: True Edge-to-Edge Full width */}
      <div className="relative w-full min-h-[160px] md:min-h-[220px] overflow-hidden bg-[#2b1f1a]">
        
        {/* Background Food Image Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://caterninja.com/NEWUI/create-your-own-pkg-bg.webp')" 
          }}
        />
        
        {/* Gradient Overlay for Text Readability - Darker on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#201511]/90 via-[#201511]/60 to-transparent" />
        
        {/* Banner Content - The content remains constrained so text isn't flush against screen edges on ultrawides */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 md:px-12 py-8 md:py-12">
          
          {/* Left Side: Typography & Button */}
          <div className="flex flex-col max-w-[800px] w-full">
            <h2 className="text-white text-[24px] md:text-[38px] font-bold font-heading leading-tight mb-2.5 tracking-tight">
              Not satisfied with our packages?
            </h2>
            <p className="text-gray-100 text-[15px] md:text-[19px] leading-snug mb-6 max-w-sm md:max-w-[550px]">
              Create your own custom food packages to your specific need and preferences
            </p>
            
            <button className="flex items-center gap-3 bg-white text-[#ba1419] font-bold text-[15px] md:text-[16px] px-5 py-2.5 rounded-sm shadow-md hover:bg-gray-50 transition w-fit group">
              Create your own Package
              <ArrowRight strokeWidth={2.5} size={18} className="text-[#ba1419] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Right Side: Ninja & Phone Graphic */}
          {/* Using a placeholder div. The user will provide the exact transparent PNG URL later */}
          <div className="hidden lg:flex absolute bottom-[-10px] right-10 lg:right-[5%] h-[120%] pointer-events-none items-end justify-end">
            <img 
              src="https://siridemo.co.in/ms/final-1/assets/images/ninja-phone-placeholder.png" 
              alt="Ninja ordering from phone"
              className="h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                // Failsafe for placeholder
                e.target.style.display = 'none';
              }}
            />
          </div>

        </div>
      </div>

    </section>
  );
};

export default CustomPackageBanner;
