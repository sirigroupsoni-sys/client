import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  'VqC0b3USKME',
  'VqC0b3USKME',
  'VqC0b3USKME',
  'VqC0b3USKME',
  'VqC0b3USKME',
  'VqC0b3USKME',
];

const TestimonialsScroll = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }0.
  };

  return (
    <section className="w-full max-w-[1500px] mx-auto px-5 md:px-10 mt-16 mb-20 relative group">

      {/* Title */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-[24px] md:text-[32px] font-[900] font-heading text-[#2d3138] tracking-tight">
            What Our <span className="text-[#ba1419]">Customers Say</span>
          </h2>
          <p className="text-gray-500 font-medium mt-1">Real stories from our happy clients.</p>
        </div>

        {/* Desktop Arrows */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll('left')}
            className={`p-2.5 rounded-full border border-gray-200 transition-all ${showLeftArrow ? 'bg-white text-gray-800 shadow-md hover:border-mscaterers-red' : 'bg-gray-50 text-gray-300 pointer-events-none'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`p-2.5 rounded-full border border-gray-200 transition-all ${showRightArrow ? 'bg-white text-gray-800 shadow-md hover:border-mscaterers-red' : 'bg-gray-50 text-gray-300 pointer-events-none'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Layout */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 hide-scrollbar"
      >
        {testimonials.map((videoId, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="relative shrink-0 snap-start w-[180px] md:w-[240px] aspect-[9/16] rounded-[24px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 bg-black"
          >
            {playingVideoIndex === index ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&si=6WMy59xzfBHRb0eN`}
                title={`Customer Testimonial ${index + 1}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div 
                className="w-full h-full cursor-pointer relative"
                onClick={() => setPlayingVideoIndex(index)}
              >
                {/* Thumbnail Image */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Customer Testimonial"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-mscaterers-red group-hover:border-mscaterers-red transition-all duration-300 group-hover:scale-110 shadow-xl">
                    <Play className="text-white w-6 h-6 md:w-7 md:h-7 fill-white ml-1" />
                  </div>
                </div>

                {/* Bottom Info Placeholder */}
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <p className="font-bold text-sm drop-shadow-md">Customer Story {index + 1}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default TestimonialsScroll;


