import React from 'react';
import { MapPin, Pencil } from 'lucide-react';

const LocationBar = ({ selectedCity }) => {
  return (
    <div className="bg-[#F9E9E9] h-[45px] flex items-center justify-between px-5 border-b border-[#e5d5d5]/50">
      <div className="flex items-center gap-2 text-[#1c1c1c] font-medium">
        <MapPin size={16} className="text-[#ba1419]" />
        <span className="text-[14px]">{selectedCity}</span>
      </div>
      <button className="text-[#ba1419] hover:opacity-80 transition-opacity">
        <Pencil size={16} />
      </button>
    </div>
  );
};

export default LocationBar;
