import React from 'react';

const HeroCard = ({ title, description, buttonText, image, isYellow, isDark, buttonColor }) => {
  return (
    <div
      className={`relative h-[340px] md:h-[380px] rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-500 ease-out 
        ${isYellow ? 'bg-gradient-to-br from-[#FBB03B] to-[#F7931E]' : ''}
        ${isDark ? 'bg-gradient-to-br from-[#111827] to-[#1F2937]' : ''}
        ${!isYellow && !isDark ? 'bg-white shadow-xl shadow-gray-100' : 'shadow-lg'}
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01]`}
    >
      {/* Background Image for Light Card (like Corporate) */}
      {!isYellow && !isDark && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
        <h2 className={`text-3xl md:text-4xl font-heading font-extrabold mb-4 leading-[1.1] transition-transform duration-500 group-hover:translate-x-1
          ${isDark || (!isYellow && !isDark) ? 'text-white' : 'text-[#222222]'} max-w-[200px]`}>
          {title}
        </h2>
        <p className={`text-sm md:text-base mb-8 font-sans font-medium leading-relaxed transition-opacity duration-500
          ${isDark || (!isYellow && !isDark) ? 'text-gray-200' : 'text-[#444444]'} 
          ${isYellow || isDark ? 'max-w-[180px] md:max-w-[200px]' : 'max-w-[260px]'}`}>
          {description}
        </p>

        <div className="mt-auto relative z-20">
          <button className={`
            ${buttonColor === 'dark' ? 'bg-[#3E2723] text-white' : 'bg-ninja-red text-white'} 
            px-8 py-3.5 rounded-full font-heading font-bold text-sm tracking-wide transition-all duration-300 
            hover:shadow-lg hover:shadow-ninja-red/30 active:scale-95 flex items-center gap-2 group/btn`}>
            {buttonText}
            <span className="text-xl transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
          </button>
        </div>

        {/* Floating Side Image for Yellow Card (Why Choose Us) */}
        {isYellow && (
          <div className="absolute bottom-0 right-0 w-[45%] h-[75%] flex items-end justify-end overflow-hidden pointer-events-none">
            <img
              src={image}
              alt="Catering staff"
              className="h-full object-contain object-bottom translate-y-8 transition-transform duration-700 group-hover:translate-y-2 group-hover:scale-110"
            />
          </div>
        )}

        {/* Small thumbnail for Dark Card (Live Catering) */}
        {isDark && (
          <div className="absolute bottom-12 right-6 w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:-rotate-3 group-hover:scale-105 pointer-events-none">
            <img src={image} alt="Live Food" className="w-full h-full object-cover" />
          </div>
        )}
      </div>


      {/* Glassy overlay for corporate card */}
      {!isYellow && !isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-white/5 backdrop-blur-[1px]"></div>
      )}

      {/* Subtle patterns for color cards */}
      {(isYellow || isDark) && (
        <>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}
    </div>
  );
};

export default HeroCard;



