import React from 'react';
import HeroCard from '../packages/HeroCard';
import banner2 from '../../assets/banner2.png';
import banner3 from '../../assets/banner3.png';
import banner4 from '../../assets/banner4.png';

const HeroSection = () => {
  const cards = [
    {
      title: "Why Choose Us?",
      description: "Verified caterers, transparent pricing, on-time delivery, and end-to-end event support you can rely on.",
      buttonText: "Why Our Service?",
      image: banner2,
      isYellow: true,
      buttonColor: 'dark'
    },
    {
      title: "Live Catering & Great Food",
      description: "Add live pizza, chaat, pasta stations and more to make your event truly memorable.",
      buttonText: "Explore Options",
      image: banner3,
      isYellow: false,
      isDark: true,
      buttonColor: 'red'
    },
    {
      title: "Premium Corporate Lunches",
      description: "Impress your clients and treat your employees with our top-tier corporate catering packages and buffet setups.",
      buttonText: "See Corporate Menus",
      image: banner4,
      isYellow: false,
      buttonColor: 'red'
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {cards.map((card, index) => (
            <div key={index} className="w-full">
              <HeroCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



