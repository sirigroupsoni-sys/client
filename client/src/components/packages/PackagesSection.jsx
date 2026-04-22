import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const packages = [
  {
    title: 'Cocktail Menu',
    price: 699,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b' // dark navy/black
  },
  {
    title: 'Indian DeGustibus',
    price: 689,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'B-Day Party',
    price: 679,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'Alpha Pack',
    price: 669,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#540808' // dark red
  },
  {
    title: 'Pan Asian II',
    price: 669,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'Italian Fiesta',
    price: 799,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'Chinese Combo',
    price: 549,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80',
    type: 'non-veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'Corporate Pro',
    price: 499,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#540808'
  },
  {
    title: 'Premium Buffet',
    price: 899,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
    type: 'non-veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  },
  {
    title: 'Party Snacks',
    price: 349,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
    type: 'veg',
    delivery: 'Tom. 12:30 PM',
    theme: '#13151b'
  }
];

const PackagesSection = () => {
  const [dietFilter, setDietFilter] = useState('veg'); // 'veg' or 'non-veg'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under300', '300-450', '450plus'

  const filteredPackages = packages.filter(pkg => {
    // Diet filter
    if (pkg.type !== dietFilter) return false;

    // Price filter
    if (priceFilter === 'under400' && pkg.price >= 400) return false;
    if (priceFilter === '400-550' && (pkg.price < 400 || pkg.price > 550)) return false;
    if (priceFilter === '550plus' && pkg.price <= 550) return false;

    return true;
  });

  return (
    <section className="py-8 w-full max-w-[1400px] mx-auto px-5 md:px-8">

      {/* Header and Filters Area */}
      <div className="flex flex-col gap-4 mb-8">

        {/* Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-2xl md:text-3xl font-[800] font-heading text-[#1c1c1c] tracking-tight leading-8">
            Ms Caterers Packages <span className="text-[#555] font-normal mx-1 md:mx-2">-</span>
          </h1>
          <span className="text-[16px] md:text-[20px] text-[#555] mt-1 md:mt-2">{filteredPackages.length} Items</span>
        </div>

        {/* Toggles and Price Filters Row */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">

          {/* Veg Toggle */}
          <div
            onClick={() => setDietFilter('veg')}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg cursor-pointer transition-all shadow-sm ${dietFilter === 'veg' ? 'bg-[#f4f6f8] ring-1 ring-gray-200' : 'bg-[#f4f6f8] opacity-80'}`}
          >
            <span className="text-[13px] md:text-[14px] font-bold text-[#4b5563]">Veg</span>
            <div className={`w-[36px] h-[18px] rounded-full relative transition-colors ${dietFilter === 'veg' ? 'bg-[#1b853a]' : 'bg-[#ced4da]'}`}>
              <motion.div
                animate={{ x: dietFilter === 'veg' ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-[14px] h-[14px] bg-white rounded-full absolute left-[2px] top-[2px] shadow-sm"
              ></motion.div>
            </div>
          </div>

          {/* Non-Veg Toggle */}
          <div
            onClick={() => setDietFilter('non-veg')}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg cursor-pointer transition-all shadow-sm ${dietFilter === 'non-veg' ? 'bg-[#f4f6f8] ring-1 ring-gray-200' : 'bg-[#f4f6f8] opacity-80'}`}
          >
            <span className="text-[13px] md:text-[14px] font-bold text-[#4b5563]">Non-Veg</span>
            <div className={`w-[36px] h-[18px] rounded-full relative transition-colors ${dietFilter === 'non-veg' ? 'bg-[#bd0000]' : 'bg-[#ced4da]'}`}>
              <motion.div
                animate={{ x: dietFilter === 'non-veg' ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-[14px] h-[14px] bg-white rounded-full absolute left-[2px] top-[2px] shadow-sm"
              ></motion.div>
            </div>
          </div>

          {/* Price Filters */}
          {[
            { id: 'under400', label: 'Under ₹400' },
            { id: '400-550', label: '₹400 - ₹550' },
            { id: '550plus', label: '₹550+' }
          ].map((filter) => (
            <div
              key={filter.id}
              onClick={() => setPriceFilter(priceFilter === filter.id ? 'all' : filter.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-sm ${priceFilter === filter.id ? 'bg-[#f4f6f8] ring-1 ring-gray-200' : 'bg-[#f4f6f8]'}`}
            >
              {/* Gold Coin Icon */}
              <div className="w-[16px] h-[16px] rounded-full bg-gradient-to-tr from-[#fdbd41] to-[#fde18a] flex items-center justify-center border border-[#e5a52a] shadow-inner">
                <div className="w-[10px] h-[10px] rounded-full border border-[#e5a52a]/40 flex items-center justify-center">
                  <span className="text-[7px] font-black text-[#856404]">₹</span>
                </div>
              </div>
              <span className="text-[13.5px] md:text-[14.5px] font-bold text-[#374151]">{filter.label}</span>
            </div>
          ))}

        </div>

        {/* Sort Filter Below */}
        <div className="flex mt-2">
          <div className="flex items-center gap-2 bg-[#f6f6f6] px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#eaeaea] transition-colors text-[#444] shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-transparent active:border-gray-200">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" /></svg>
            <span className="text-[13.5px] font-medium">Sort by Price</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>

      {/* Grid of Packages */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-[18px]"
      >
        <AnimatePresence mode='popLayout'>
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col rounded-[1.25rem] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-white cursor-pointer group hover:-translate-y-1 transition-transform"
            >
              {/* Top Image Section */}
              <div className="h-[200px] md:h-[220px] w-full relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />

                {/* Premium Options Ribbon */}
                <div
                  className="absolute top-0 left-[18px] bg-[#d9af64] w-[65px] flex flex-col items-center pt-2 pb-3 shadow-md"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                >
                  <span className="text-[8.5px] font-bold text-[#111] leading-[1.2] text-center tracking-wide">
                    PREMIUM<br />OPTIONS
                  </span>
                </div>

                {/* Veg/Non-Veg Icon */}
                <div className="absolute top-3 right-3 bg-white p-[3px] rounded shadow-sm flex items-center justify-center">
                  <div className={`w-[14px] h-[14px] border ${pkg.type === 'veg' ? 'border-[#008a00]' : 'border-[#bd0000]'} flex items-center justify-center rounded-sm`}>
                    <div className={`w-[6px] h-[6px] ${pkg.type === 'veg' ? 'bg-[#008a00]' : 'bg-[#bd0000]'} rounded-full`}></div>
                  </div>
                </div>
              </div>

              {/* Bottom Content Section */}
              <div className="p-3.5 pb-4 flex flex-col justify-between flex-grow" style={{ backgroundColor: pkg.theme }}>
                {/* Package Title */}
                <h3 className="text-white font-bold text-[17px] mb-3">{pkg.title}</h3>

                {/* Price & Action Row */}
                <div className="flex justify-between items-end mt-auto">
                  {/* Left Side: Price */}
                  <div className="flex flex-col">
                    <span className="text-[#a5a5a5] text-[10.5px] font-medium leading-none mb-1">Starting from</span>
                    <div className="flex items-baseline">
                      <span className="text-white font-bold text-[22px] leading-none">₹{pkg.price}</span>
                    </div>
                    <span className="text-[#a5a5a5] text-[10px] font-medium mt-1 leading-none">per person</span>
                  </div>

                  {/* Right Side: Delivery & Button */}
                  <div className="flex flex-col items-end">
                    <div className="text-right mb-1.5 flex flex-col items-end">
                      <span className="text-[#fdbd41] text-[10px] font-medium leading-tight">Next Available</span>
                      <span className="text-white text-[10.5px] font-semibold leading-tight">{pkg.delivery}</span>
                    </div>

                    {/* Dynamic Button coloring based on Theme */}
                    <button
                      className={`flex items-center text-[11.5px] font-bold px-[10px] py-[5px] rounded-lg shadow-sm transition-opacity hover:opacity-90 max-h-[28px] ${pkg.theme === '#540808' ? 'bg-[#b6151b] text-white border border-[#d62828]' : 'bg-[#eed794] text-[#111]'}`}
                    >
                      <span className="border border-current rounded-[2px] w-[13px] h-[13px] flex items-center justify-center mr-1.5 text-[11px] leading-none pt-[1px]">
                        +
                      </span>
                      View Menu
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
          {filteredPackages.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg">No packages found matching these filters.</p>
              <button
                onClick={() => { setDietFilter('veg'); setPriceFilter('all'); }}
                className="mt-4 text-ninja-red font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

    </section>
  );
};

export default PackagesSection;
