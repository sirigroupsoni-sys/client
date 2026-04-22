import React from 'react';
import { Timer, Zap, Users, ShieldCheck } from 'lucide-react';

const highlights = [
  { icon: Timer, label: "4 Hr Delivery", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Zap, label: "8 Hr Delivery", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Users, label: "Bulk Food", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: ShieldCheck, label: "Buffet Services", color: "text-emerald-500", bg: "bg-emerald-50" }
];

const Highlights = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 min-w-[120px] md:min-w-[150px] group cursor-pointer">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${item.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border border-transparent group-hover:border-gray-100`}>
              <item.icon size={32} className={`${item.color}`} />
            </div>
            <span className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider text-center group-hover:text-[#ba1419] transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
