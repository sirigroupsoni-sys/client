import React from 'react';
import food1 from '../../assets/food_1.png';
import food2 from '../../assets/food_2.png';
import food3 from '../../assets/food_3.png';
import food4 from '../../assets/food_4.png';
import food5 from '../../assets/food_5.png';

const FoodMarquee = () => {
  const images = [food1, food2, food3, food4, food5];
  
  // Duplicate for seamless looping
  const allImages = [...images, ...images];

  return (
    <section className="relative w-full py-8 md:py-12 bg-gradient-to-b from-white via-white to-gray-50/50 overflow-hidden">
      {/* Subtle decorative background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="text-[12rem] font-heading font-black whitespace-nowrap -rotate-6 uppercase tracking-[2rem]">
          Gourmet Gallery
        </span>
      </div>

      <div className="relative z-10">
        <div className="animate-marquee hover:pause-marquee flex items-center">
          {allImages.map((img, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 mx-4 md:mx-8 w-[280px] md:w-[480px] aspect-[16/10] rounded-[2.5rem] overflow-hidden 
                shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-white/40
                transition-all duration-700 ease-in-out hover:scale-[1.04] hover:-rotate-1 hover:shadow-[0_30px_70px_-12px_rgba(190,46,62,0.15)] group"
            >
              <img 
                src={img} 
                alt={`Premium Food ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              {/* Subtle glass overlay on hover */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[1px]"></div>
            </div>
          ))}
        </div>

        {/* Improved gradient overlays matching the theme */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-80 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 md:w-80 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default FoodMarquee;

