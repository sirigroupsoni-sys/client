import React from 'react';
import { motion } from 'framer-motion';

const offerings = [
  'https://siridemo.co.in/ms/final-1/assets/images/cusi/1.png',
  'https://siridemo.co.in/ms/final-1/assets/images/cusi/2.png',
  'https://siridemo.co.in/ms/final-1/assets/images/cusi/3.png',
  'https://siridemo.co.in/ms/final-1/assets/images/cusi/4.png',
  'https://siridemo.co.in/ms/final-1/assets/images/cusi/5.png'
];

const CateringOfferings = () => {
  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 mt-12 md:mt-14 mb-16">
      
      {/* Section Divider & Title */}
      <div className="relative flex justify-center items-center mb-10 w-full pt-2">
        {/* Background Grey Line */}
        <div className="absolute w-full h-[1px] bg-[#d5d5d5] z-0"></div>
        
        {/* Foreground Title with solid white background to cut the line */}
        <div className="relative z-10 bg-white px-5 md:px-10 text-center flex flex-col items-center">
          <h2 className="text-[24px] md:text-[30px] font-[800] text-[#0f172a] uppercase tracking-[0.08em] leading-[1.1] font-heading">
            Catering
          </h2>
          <h2 className="text-[24px] md:text-[30px] font-[800] text-[#6b1414] uppercase tracking-[0.08em] leading-[1.1] font-heading">
            Offerings
          </h2>
        </div>
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
        {offerings.map((imgUrl, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.1 }}
            className="rounded-[1.25rem] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-white border border-[#eaeaea]"
          >
            <img 
              src={imgUrl} 
              alt={`Catering Offering ${index + 1}`}
              className="w-full h-auto object-contain" // The banners are perfectly pre-designed
            />
          </motion.div>
        ))}
      </div>
      
    </section>
  );
};

export default CateringOfferings;
