import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Smooth exponential-like loading curve for realism
      const remaining = 100 - currentProgress;
      currentProgress += Math.max(0.5, remaining * 0.1 * Math.random());
      
      if (currentProgress >= 99) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        
        // Wait a bit at 100% before triggering exit
        setTimeout(() => {
          setIsVisible(false);
          // Notify complete just as the exit animation finishes
          setTimeout(onComplete, 800); 
        }, 800);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
        >
          <motion.div 
            className="flex flex-col items-center w-full max-w-xs px-8"
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            {/* Elegant Logo Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
              className="mb-14"
            >
              <img 
                src="logo.png" 
                alt="MS Caterers" 
                className="w-[200px] md:w-[260px] object-contain"
              />
            </motion.div>

            {/* Ultra-Minimalist Progress UI */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full flex flex-col gap-5"
            >
              {/* Sleek track */}
              <div className="relative h-[1px] w-full bg-gray-200 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                  className="absolute top-0 left-0 h-full bg-[#ba1419]"
                />
              </div>

              <div className="flex justify-between items-center w-full">
                <motion.span 
                  className="text-[#2b3137] font-medium text-[8px] tracking-[0.3em] uppercase opacity-70"
                >
                  Authentic Culinary
                </motion.span>
                <div className="flex items-baseline font-mono">
                  <span className="text-[#2b3137] text-xs font-semibold tracking-wider">
                    {progress < 10 ? `0${progress}` : progress}
                  </span>
                  <span className="text-[#ba1419] text-[9px] font-bold ml-[2px] opacity-90">%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
