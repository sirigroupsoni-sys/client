import React, { useRef, useEffect } from 'react';

const ServiceTypes = ({ activeService }) => {
  const serviceTypes = [
    { id: 'MSCATERERSBox', name: 'Delivery Only', image: 'https://caterninja.com/_next/image?url=https%3A%2F%2Fd3t167u6bqq6i3.cloudfront.net%2Ffrontend%2FNEWUI%2Fcategory%2Fdelivery-only.webp&w=1920&q=75' },
    { id: 'DeliveryServices', name: 'Delivery + Services', image: 'https://siridemo.co.in/ms/final-1/assets/images/tabs/2.png' },
    { id: 'LiveServices', name: 'Live Service', image: 'https://siridemo.co.in/ms/final-1/assets/images/tabs/3.png' },
    { id: 'SnackBox', name: 'Snack Box', image: 'https://siridemo.co.in/ms/final-1/assets/images/tabs/4.png' },
    { id: 'MealBox', name: 'Meal Box', image: 'https://siridemo.co.in/ms/final-1/assets/images/tabs/5.png' }
  ];
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-4 w-full overflow-hidden mb-6 mt-2 bg-white">

      <div 
        ref={scrollRef}
        className="flex justify-start md:justify-around items-center gap-6 md:gap-0 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 hide-scrollbar pb-4" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {serviceTypes.map((type, index) => (
          <div
            key={index}
            className="flex flex-col items-center shrink-0 snap-center cursor-pointer group"
          >
            {/* The Circle Wrapper */}
            {/* Notice the active state has a very distinct red border matching the screenshot */}
            <div className={`rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-300 mb-2 ${type.id === activeService ? 'p-[3px] border-[1.5px] border-[#ba1419]' : 'p-[3px] border-[1.5px] border-transparent'}`}>

              <div
                className="w-[110px] h-[110px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden shadow-md relative flex items-center justify-center bg-gradient-to-r from-gray-50 to-[#f5b8b8]"
              >
                {/* Image */}
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover mix-blend-multiply opacity-95 transition-opacity group-hover:opacity-100 scale-110"
                />
              </div>

            </div>

            {/* Item Title */}
            <span
              className={`text-[15px] md:text-[18px] font-sans whitespace-nowrap ${type.id === activeService ? 'text-[#ba1419] font-black' : 'text-[#2a2a2a] font-bold'} group-hover:text-[#ba1419] transition-colors`}
            >
              {type.name}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default ServiceTypes;
