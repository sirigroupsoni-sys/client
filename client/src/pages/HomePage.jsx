import React from 'react';
import FoodMarquee from '../components/home/FoodMarquee';
import CategoryScroll from '../components/home/CategoryScroll';
import ServicesScroll from '../components/home/ServicesScroll';
import ServiceTypes from '../components/home/ServiceTypes';
import PackagesSection from '../components/packages/PackagesSection';
import CustomPackageBanner from '../components/packages/CustomPackageBanner';
import CateringOfferings from '../components/packages/CateringOfferings';
import TestimonialsScroll from '../components/home/TestimonialsScroll';
import NewsAndReviews from '../components/home/NewsAndReviews';
import SafetyBanner from '../components/common/SafetyBanner';
import WhatsAppCTA from '../components/common/WhatsAppCTA';

const HomePage = () => {
  return (
    <>
      <FoodMarquee />
      <CategoryScroll />
      <ServicesScroll />
      <ServiceTypes />
      <PackagesSection />
      <CustomPackageBanner />
      <CateringOfferings />
      <TestimonialsScroll />
      <NewsAndReviews />
      <SafetyBanner />
      <WhatsAppCTA />
    </>
  );
};

export default HomePage;
