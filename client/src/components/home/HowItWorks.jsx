import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, UtensilsCrossed, CalendarCheck, Truck } from 'lucide-react';

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose Menu",
    description: "Browse our wide range of menus and select the one that fits your event perfectly."
  },
  {
    icon: CalendarCheck,
    title: "Book Date",
    description: "Select your event date and provide location details for seamless service."
  },
  {
    icon: UtensilsCrossed,
    title: "We Prepare",
    description: "Our expert chefs prepare high-quality food using fresh ingredients."
  },
  {
    icon: Truck,
    title: "Delivered & Served",
    description: "Relax while we deliver and serve delicious meals at your doorstep."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white max-w-[1400px] mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase font-heading">
          How It <span className="text-[#ba1419]">Works</span>
        </h2>
        <div className="w-20 h-1 bg-[#ba1419] mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ba1419] transition-colors duration-300 shadow-md mb-6 relative">
              <step.icon size={32} className="text-[#ba1419] group-hover:text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center border-4 border-white">
                {idx + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
