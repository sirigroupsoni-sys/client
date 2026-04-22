import React from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { name: '4 Hr Delivery', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-1.jpg' },
  { name: '8 Hr Delivery', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-2.jpg' },
  { name: 'Bulk Food', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-3.jpg' },
  { name: 'Buffet Services', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-4.jpg' },
  { name: 'Live Experiences', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-2.jpg' },
  { name: 'Customize', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-6.jpg' },
  { name: 'Live Bread', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-7.jpg' },
  { name: 'Snack Box', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-8.webp' },
  { name: 'MealBox', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/2-9.jpg' }
];

const ServicesScroll = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceName) => {
    const routeMap = {
      '4 Hr Delivery': '/selectedPackage?service=Express',
      '8 Hr Delivery': '/mscaterersbox',
      'Buffet Services': '/selectedPackage?service=MSCATERERSBox',
      'Live Experiences': '/selectedPackage?service=LiveServices',
      'Bulk Food': '/selectedPackage?service=MSCATERERSBox',
      'Customize': '/selectedPackage?service=MSCATERERSBox',
      'Live Bread': '/selectedPackage?service=LiveServices',
      'Snack Box': '/selectedPackage?service=SnackBox',
      'MealBox': '/selectedPackage?service=MealBox'
    };

    const route = routeMap[serviceName];
    if (route) {
      navigate(route);
    }
  };

  return (
    <section className="py-6 md:py-8 w-full overflow-hidden mt-2 mb-2">
      
      {/* Section Title */}
      <div className="px-5 md:px-8 max-w-[1400px] mx-auto mb-4 md:mb-6">
        <h2 className="text-[#ba1419] text-[22px] md:text-[28px] font-semibold font-heading tracking-wide">
          Choose Your Services
        </h2>
      </div>
      
      {/* Scrollable Container */}
      <div className="flex justify-start gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 category-scrollbar px-5 md:px-8 max-w-[1400px] mx-auto">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center shrink-0 snap-start cursor-pointer group"
            onClick={() => handleServiceClick(service.name)}
          >
            {/* Wide Aspect Ratio Images */}
            <div className="w-[260px] h-[140px] md:w-[340px] md:h-[180px] rounded-xl overflow-hidden mb-3 md:mb-4 bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>
            {/* Title Below */}
            <span className="text-[17px] md:text-[19px] text-[#1c1c24] font-medium leading-relaxed">
              {service.name}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default ServicesScroll;
