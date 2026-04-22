import React from 'react';
import { motion } from 'framer-motion';

const newsLogos = [
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/n18.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/toi.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/yourstory.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/snackfax.webp',
  'https://images.slurrp.com/prod/static_img/slurrp-header-logo.svg',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/ndtv.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/bbc.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/zeen.webp',
  'https://d3t167u6bqq6i3.cloudfront.net/frontend/NEWUI/news/nbc.webp'
];

const reviews = [
  {
    name: 'Ananya Rai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    text: 'I ordered MS buffet service for the third time. This time food was best out of all 3 times. All my guests liked the food. There was no extra oil and masala. The food was like a home cooked meal. Dahi vadas we\'re too good...'
  },
  {
    name: 'Robin Max Almeida',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
    text: 'Ordered food at the last moment for them and turned out be the best decision. Fistly punctuality and then is the quality of food. No regrets to hold people enjoyed every bit of it. Would definetely recommend them.'
  },
  {
    name: 'Sowmya Ravindranath',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    text: 'Myself and my guests enjoyed the food. The packaging was excellent and it was hassle free on my side. I could enjoy the party without any stress. 🤩 Thank you very much for your wonderful service.'
  },
  {
    name: 'uma krrishna',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&q=80',
    text: 'I thoroughly enjoyed the meal, it was really tasty! However, the veg seekh kababs were slightly mashed, making it difficult to serve them properly. Nonetheless, I appreciate that the food was delivered in well-packed...'
  },
  {
    name: 'Naresh Thawal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    text: 'Overall good experience with your team and cooperation. Food quality arrangements are superb. Very punctual about timing Would like to work in future best of luck ✌️'
  }
];

const NewsAndReviews = () => {
  return (
    <section className="w-full bg-[#f8e9e8] pt-12 pb-10 mt-10">
      
      {/* Container to maintain max-width alignment with rest of site */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* --- PART 1: CATERINGNINJA IN NEWS --- */}
        <div className="mb-14">
          
          {/* Header Divider Line */}
          <div className="relative flex justify-center items-center mb-10 w-full pt-2">
            <div className="absolute w-full h-[1px] bg-[#dcb6b6] z-0"></div>
            <div className="relative z-10 bg-[#f8e9e8] px-5 md:px-10 text-center flex flex-col items-center">
              <h2 className="text-[20px] md:text-[24px] font-[800] text-[#1f2937] uppercase tracking-[0.08em] leading-tight font-heading">
                MS Caterers In
              </h2>
              <h2 className="text-[20px] md:text-[24px] font-[800] text-[#ba1419] uppercase tracking-[0.08em] leading-tight font-heading">
                News
              </h2>
            </div>
          </div>

          {/* Logos Grid */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-80 mix-blend-multiply max-w-4xl mx-auto px-4">
             {newsLogos.map((logo, idx) => (
                <img key={idx} src={logo} alt={`News Spotlight ${idx+1}`} className="h-6 md:h-8 object-contain" />
             ))}
          </div>
        </div>

        {/* --- PART 2: WHAT OUR CUSTOMER SAY ABOUT US --- */}
        <div className="mb-6">
          
          {/* Header Divider Line */}
          <div className="relative flex justify-center items-center mb-12 w-full pt-2">
            <div className="absolute w-full h-[1px] bg-[#dcb6b6] z-0"></div>
            <div className="relative z-10 bg-[#f8e9e8] px-5 md:px-10 text-center flex flex-col items-center">
              <h2 className="text-[20px] md:text-[24px] font-[800] text-[#1f2937] uppercase tracking-[0.08em] leading-tight font-heading">
                What Our Customer Say
              </h2>
              <h2 className="text-[20px] md:text-[24px] font-[800] text-[#ba1419] uppercase tracking-[0.08em] leading-tight font-heading">
                About Us
              </h2>
            </div>
          </div>

          {/* Real Stories Heading Box */}
          <div className="relative flex flex-col items-start px-2 mb-8 pointer-events-none">
            {/* The giant faint background quotation mark exactly like the screenshot */}
            <span className="absolute -top-[45px] -left-2 text-[#f0cfcf] text-[150px] leading-none font-serif z-0 font-bold">
              “
            </span>
            <div className="relative z-10">
              <h3 className="text-[34px] md:text-[46px] font-[900] text-[#2c3138] font-heading leading-[1.1] tracking-tight">
                Real Stories from <span className="text-[#ba1419]">Real<br />Customers</span>
              </h3>
              <p className="text-[18px] md:text-[20px] text-[#444] mt-2 font-medium">Get inspired by these stories.</p>
            </div>
          </div>

          {/* Horizontal Swiper For Reviews */}
          {/* The screenshot shows perfectly sharp rectangles with no background spacing, utilizing exact snap alignment */}
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-4 pb-6 pt-2 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
                className="w-[280px] md:w-[310px] bg-white rounded-sm p-4 md:p-5 flex flex-col shrink-0 snap-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] h-[320px] md:h-[340px] border border-gray-100 relative"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <img src={review.avatar} alt={review.name} className="w-[42px] h-[42px] rounded-full object-cover shadow-sm bg-gray-100" />
                  <span className="font-[800] text-[14.5px] text-[#222] font-heading">{review.name}</span>
                </div>
                
                {/* Text Content */}
                <p className="text-[#4b5563] text-[13.5px] md:text-[14px] leading-relaxed flex-grow relative z-10">
                  <span className="text-[#e7c7c7] font-serif text-[28px] leading-none absolute -left-1 -top-1">“</span>
                  <span className="relative z-10 ml-2">{review.text}</span>
                </p>
                
                {/* Google Logo Bottom Indicator */}
                <div className="mt-auto flex justify-end items-end relative z-10">
                  <div className="flex items-center gap-1.5">
                    {/* Hand-built Google Logo replication */}
                    <div className="relative flex items-center justify-center w-[30px] h-[30px] bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.1)] border border-gray-100">
                       <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[9px] text-[#666] font-semibold leading-[1.2]">Google<br/>Customer Reviews</span>
                      <div className="flex mt-[2px]">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className="w-[10px] h-[10px]" viewBox="0 0 20 20" fill="#f59e0b"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

        {/* Global CTA Button */}
        <div className="flex justify-center mt-2 pb-6">
          <button className="bg-[#568cec] text-white text-[14px] md:text-[15px] font-semibold px-8 py-2.5 rounded hover:bg-[#467bda] transition shadow-md">
            See All Reviews
          </button>
        </div>

      </div>
    </section>
  );
};

export default NewsAndReviews;
