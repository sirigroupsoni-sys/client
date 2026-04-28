import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertBar = () => {
  const message = "Due to the ongoing gas supply limitations across India, certain menu items may not be available till 28th April 2026";

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-yellow-200/40 
      bg-gradient-to-r from-[#FFF9E5] via-[#FFEBB2] to-[#FFF9E5] 
      bg-[length:200%_auto] animate-[gradient_10s_ease_infinite] shadow-inner">
      
      <div className="animate-marquee hover:pause-marquee cursor-default whitespace-nowrap flex items-center relative z-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-12 text-[14px] md:text-[15px] font-bold text-yellow-950 font-sans tracking-tight">
            <div className="p-1 bg-white/40 rounded-full shadow-sm">
              <AlertTriangle size={16} className="shrink-0 text-red-600 animate-pulse" />
            </div>
            <span className="drop-shadow-sm">{message}</span>
          </div>
        ))}
      </div>
      
      {/* Decorative glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default AlertBar;
