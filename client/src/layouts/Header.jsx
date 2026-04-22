import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Search, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';

const cities = [
  "Bangalore", "Gurgaon", "Delhi", "Noida", "Mumbai", "Thane",
  "Navi-Mumbai", "Ghaziabad", "Pune", "Chennai", "Hyderabad", "Chandigarh"
];

const Header = ({ selectedCity, setSelectedCity }) => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navLinks = [
    {
      name: 'Services',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Menu & Prices', highlight: 'Prices', href: '/checkprice' },
        { label: 'MSCATERERSBox', highlight: 'Box', href: '/mscaterersbox' },
        { label: 'MSCATERERSBuffet', highlight: 'Buffet', href: '/selectedPackage?service=MSCATERERSBuffet' },
        { label: 'MealBox', highlight: 'Box', href: '/selectedPackage?service=MealBox' },
        { label: 'SnackBox', highlight: 'Box', href: '/selectedPackage?service=SnackBox' },
      ]
    },
    { name: 'Dishes', hasDropdown: true },
    { name: 'Corporate', hasDropdown: true },
    { name: 'Blog', hasDropdown: false },
    { name: 'My Profile', hasDropdown: false },
    { name: 'Contact Us', hasDropdown: false },
  ];

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-500 
      ${isScrolled
        ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-1 md:py-1.5'
        : 'bg-white/80 backdrop-blur-xl py-2 md:py-3 border-b border-gray-100/20'}`}>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Left Side: Logo & City Selector */}
        <div className="flex items-center gap-4 md:gap-10">
          {/* Logo */}
          <Link to="/" className={`transition-all duration-500 flex items-center ${isScrolled ? 'h-[45px] md:h-[55px]' : 'h-[60px] md:h-[75px]'}`}>
            <img src="logo.png" alt="MS Caterers Logo" className="h-full w-auto object-contain" />
          </Link>

          {/* City Selector */}
          <div className="relative group flex items-center">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 
                hover:border-mscaterers-red/30 transition-all bg-gray-50/50 hover:bg-white hover:ring-4 hover:ring-mscaterers-red/5 group"
            >
              <div className="p-1.5 bg-mscaterers-red/5 rounded-full group-hover:bg-mscaterers-red/10 transition-colors">
                <MapPin size={15} className="text-mscaterers-red" />
              </div>
              <span className="text-[13px] md:text-[14px] font-bold text-gray-700">{selectedCity}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isCityOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* City Dropdown Menu */}
            {isCityOpen && (
              <>
                <div
                  className="fixed inset-0 z-[110]"
                  onClick={() => setIsCityOpen(false)}
                ></div>
                <div className="absolute top-[calc(100%+12px)] left-0 w-[260px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 z-[120] animate-in fade-in zoom-in-95 duration-300 p-3">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search City..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mscaterers-red/20 focus:border-mscaterers-red/40 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                    {filteredCities.map(city => (
                      <button
                        key={city}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-mscaterers-red/5 rounded-xl transition-all flex items-center justify-between group"
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityOpen(false);
                        }}
                      >
                        <span className={`transition-colors ${selectedCity === city ? 'font-bold text-mscaterers-red' : 'text-gray-600 group-hover:text-mscaterers-red'}`}>
                          {city}
                        </span>
                        {selectedCity === city && <div className="w-2 h-2 rounded-full bg-mscaterers-red shadow-[0_0_10px_rgba(190,46,62,0.4)]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <a
                href="#"
                className="relative text-[14px] xl:text-[15px] font-heading font-bold text-gray-700 transition-all duration-300 py-4
                  hover:text-mscaterers-red flex items-center gap-1.5 group-hover:text-mscaterers-red"
              >
                <span className="group-hover:-translate-y-0.5 transition-transform duration-300">{link.name}</span>
                {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 opacity-60" />}
              </a>

              {/* Dropdown Menu */}
              {link.hasDropdown && link.dropdownItems && (
                <div className="absolute top-full left-0 w-[220px] bg-white rounded-xl shadow-2xl border border-gray-100 py-3 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                  {link.dropdownItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.href}
                      className="block px-6 py-3 text-[16px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {item.label.includes(item.highlight) ? (
                        <>
                          {item.label.split(item.highlight)[0]}
                          <span className="text-mscaterers-red">{item.highlight}</span>
                          {item.label.split(item.highlight)[1]}
                        </>
                      ) : item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-3">
          {/* Login/User Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-bold text-gray-500">Welcome,</span>
                <span className="text-[14px] font-black text-mscaterers-red leading-none">{user.name}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 rounded-full border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-mscaterers-red text-mscaterers-red font-bold hover:bg-mscaterers-red hover:text-white transition-all active:scale-95"
            >
              Login
            </button>
          )}

          <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-mscaterers-red to-[#8a0f12] text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-full text-[13px] md:text-[14px] font-heading font-bold transition-all duration-500 
            shadow-[0_10px_20px_-5px_rgba(190,46,62,0.2)] hover:shadow-[0_15px_30px_-5px_rgba(190,46,62,0.35)] hover:-translate-y-1 active:scale-95 group overflow-hidden relative">

            <span className="relative z-10 flex items-center gap-2">
              Order Now
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-500" />
            </span>

            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2.5 text-gray-700 hover:text-mscaterers-red transition-all active:scale-90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[150] pt-28 px-8 animate-in slide-in-from-right duration-500 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col border-b border-gray-100 pb-5">
                <a
                  href="#"
                  className="text-2xl font-heading font-black text-gray-800 flex items-center justify-between hover:text-mscaterers-red transition-colors"
                  onClick={(e) => {
                    if (!link.hasDropdown) setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={24} />}
                </a>

                {/* Mobile Dropdown Items */}
                {link.hasDropdown && link.dropdownItems && (
                  <div className="flex flex-col gap-4 mt-4 ml-4">
                    {link.dropdownItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="text-lg font-bold text-gray-600 hover:text-mscaterers-red"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-mscaterers-red to-[#8a0f12] text-white py-5 rounded-2xl text-xl font-heading font-black mt-6 shadow-2xl active:scale-95 transition-all">
              Order Now
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;
