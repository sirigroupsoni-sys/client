import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServiceTypes from '../components/home/ServiceTypes';
import PackagesSection from '../components/packages/PackagesSection';
import TestimonialsScroll from '../components/home/TestimonialsScroll';
import NewsAndReviews from '../components/home/NewsAndReviews';
import CateringOfferings from '../components/packages/CateringOfferings';
import ServicesScroll from '../components/home/ServicesScroll';
import WhatsAppCTA from '../components/common/WhatsAppCTA';

const PackagePage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const occasion = queryParams.get('ocassion');
  const [activeService, setActiveService] = React.useState('Delivery Only');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-2">
      <ServicesScroll />
      {/* Circular icons */}
      <ServiceTypes activeService={activeService} setActiveService={setActiveService} />
      
      {/* Packages Grid */}
      <div className="mt-4">
        <PackagesSection activeService={activeService} />
      </div>

      {/* Videos Section */}
      <TestimonialsScroll />

      {/* Offerings and News */}
      <CateringOfferings />
      <NewsAndReviews />
      <WhatsAppCTA />
    </div>
  );
};

export default PackagePage;
