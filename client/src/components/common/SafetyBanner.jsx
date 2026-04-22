import React from 'react';
import { ShieldCheck, HeartPulse, Droplets, Thermometer } from 'lucide-react';

const guidelines = [
  { icon: ShieldCheck, title: "Hygienic Preparation", desc: "100% clean kitchen standards" },
  { icon: HeartPulse, title: "Fresh Ingredients", desc: "Sourced daily for quality" },
  { icon: Droplets, title: "Food Safety", desc: "Rigorous quality checks" },
  { icon: Thermometer, title: "Proper Storage", desc: "Temperature controlled delivery" }
];

const SafetyBanner = () => {
  return (
    <section className="bg-gradient-to-r from-[#ba1419] to-[#8a0f12] py-4 text-white">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Your Safety, Our Priority</h3>
          <p className="text-sm opacity-80">Following strict hygiene protocols for every order.</p>
        </div>
        <div className="flex flex-wrap gap-8">
          {guidelines.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <item.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold">{item.title}</span>
                <span className="text-[12px] opacity-70">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetyBanner;
