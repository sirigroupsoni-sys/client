import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PackagesSection from '../components/packages/PackagesSection';
import TestimonialsScroll from '../components/home/TestimonialsScroll';
import NewsAndReviews from '../components/home/NewsAndReviews';
import CateringOfferings from '../components/packages/CateringOfferings';
import ServiceTypes from '../components/home/ServiceTypes';
import WhatsAppCTA from '../components/common/WhatsAppCTA';

const SelectedPackagePage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const serviceParam = queryParams.get('service') || 'MSCATERERSBox';
  const [activeService, setActiveService] = React.useState(serviceParam === 'Express' ? 'MSCATERERSBox' : serviceParam);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-6 pb-12">
      {/* Service Header - Matches Screenshot */}
      {activeService === 'MSCATERERSBox' ? (
        <div className="flex flex-col items-center mb-10">
          <div className="p-[3px] border-[1.5px] border-[#ba1419] rounded-full mb-2">
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden shadow-md bg-gradient-to-r from-gray-50 to-[#f5b8b8] flex items-center justify-center">
              <img 
                src="https://caterninja.com/_next/image?url=https%3A%2F%2Fd3t167u6bqq6i3.cloudfront.net%2Ffrontend%2FNEWUI%2Fcategory%2Fdelivery-only.webp&w=1920&q=75" 
                alt="Delivery Only" 
                className="w-full h-full object-cover mix-blend-multiply scale-110"
              />
            </div>
          </div>
          <span className="text-[#ba1419] font-black text-lg md:text-xl uppercase tracking-wider">
            Delivery Only
          </span>
        </div>
      ) : (
        <div className="mb-8">
          <ServiceTypes activeService={activeService} setActiveService={setActiveService} />
        </div>
      )}

      {/* Packages Grid */}
      <PackagesSection activeService={activeService} />

      {/* Testimonials */}
      <TestimonialsScroll />

      {/* Catering Offerings */}
      <CateringOfferings />

      {/* News and Reviews */}
      <NewsAndReviews />
      <WhatsAppCTA />
    </div>
  );
};

export default SelectedPackagePage;
