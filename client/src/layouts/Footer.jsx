import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full mt-10 border-t border-gray-100">

      {/* --- Top White Section --- */}
      <div className="w-full max-w-[1400px] mx-auto px-5 md:px-[6%] py-12 md:py-16 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-8">

        {/* Brand Info (Left Side) */}
        <div className="flex flex-col max-w-[340px] text-center lg:text-left items-center lg:items-start">
          {/* Official Logo Integration */}
          <div className="mb-6 flex items-center h-[100px] lg:h-[130px]">
            <img src="logo.png" alt="MS Caterers Logo" className="h-full w-auto object-contain mix-blend-multiply scale-[1.2] lg:scale-[1.3] origin-center lg:origin-left" />
          </div>
          <p className="text-[#555] text-[14px] leading-[2.2] font-medium">
            MS Caterers is India's largest digital catering brand, catering to customers' needs, for small or large groups, at home or at office.
          </p>
        </div>

        {/* Links Matrix (Right Side) */}
        <div className="flex flex-wrap justify-center lg:justify-end gap-10 md:gap-16 xl:gap-[80px]">

          {/* Column 1: Explore */}
          <div className="flex flex-col items-center text-center w-[120px]">
            <h4 className="text-[#a41010] font-[800] text-[16px] mb-5 font-heading">Explore</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/checkprice" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">Menu & Prices</Link></li>
              <li><Link to="/mscaterersbox" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">MSCATERERSBox</Link></li>
              <li><Link to="/selectedPackage?service=MSCATERERSBuffet" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">MSCATERERSBuffet</Link></li>
              <li><Link to="/admin" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col items-center text-center w-[120px]">
            <h4 className="text-[#a41010] font-[800] text-[16px] mb-5 font-heading">Resources</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">Blogs</a></li>
              <li><a href="#" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">Videos</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col items-center text-center w-[150px]">
            <h4 className="text-[#a41010] font-[800] text-[16px] mb-5 font-heading">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">About Us</a></li>
              <li><a href="#" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">Modification Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="flex flex-col items-center text-center w-[180px]">
            <h4 className="text-[#a41010] font-[800] text-[16px] mb-5 font-heading">Get in Touch</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="mailto:support@mscaterers.com" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">support@mscaterers.com</a></li>
              <li><a href="tel:08047176666" className="text-[#333] hover:text-[#a41010] text-[14px] font-semibold transition-colors">08047176666</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- Bottom Red Section --- */}
      <div className="w-full bg-[#af1111] py-8 px-5 md:px-[6%] relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">

        {/* Left: Social Icons Container */}
        <div className="flex gap-4 z-10 w-full justify-center md:justify-start md:w-auto">
          {/* Instagram Block */}
          <a href="#" className="w-[38px] h-[38px] rounded-[8px] bg-gradient-to-tr from-[#fbee56] via-[#f13a5b] to-[#b329ad] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Facebook Block */}
          <a href="#" className="w-[38px] h-[38px] rounded-[8px] bg-[#1877F2] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>

          {/* YouTube Block */}
          <a href="#" className="w-[38px] h-[38px] rounded-[8px] bg-[#FF0000] flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[-1px]">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>

        {/* Center: Legal & Address Info */}
        <div className="flex flex-col items-center text-center z-10 w-full md:absolute md:left-1/2 md:-translate-x-1/2">
          <p className="text-white font-[800] text-[15px] md:text-[17px] tracking-wide mb-1 font-heading">
            MS Caterers Ventures Pvt Ltd.
          </p>
          <p className="text-white font-[800] text-[15px] md:text-[17px] tracking-wide font-heading">
            Bangalore, Mumbai, Pune, Hyderabad, Chennai and Delhi NCR
          </p>
        </div>

        {/* Right: Copyright Block */}
        <div className="z-10 w-full text-center md:w-auto md:text-right mt-2 md:mt-0 md:absolute md:right-[6%] md:bottom-[15px]">
          <p className="text-white text-[12px] md:text-[13px] font-semibold tracking-wide">
            Copyright © 2026 MS Caterers | All rights reserved
          </p>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
