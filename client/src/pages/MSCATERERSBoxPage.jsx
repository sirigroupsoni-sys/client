import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Star,
  ShieldCheck,
  Users,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import WhatsAppCTA from '../components/common/WhatsAppCTA';
import MenuPopup from '../components/common/MenuPopup';
import api from '../api/axios';
import food_5 from '../assets/food_5.png';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner5 from '../assets/banner5.png';
import food_1 from '../assets/food_1.png';
import food_2 from '../assets/food_2.png';
import food_3 from '../assets/food_3.png';
import food_4 from '../assets/food_4.png';

const MSCATERERSBoxPage = () => {
  const scrollRef = useRef(null);
  const [selectedOption, setSelectedOption] = React.useState('BulkFood');
  const [isVeg, setIsVeg] = React.useState(true);
  const [priceRange, setPriceRange] = React.useState('300-450');
  const [menus, setMenus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [quoteLoading, setQuoteLoading] = React.useState(null);
  const [showQuote, setShowQuote] = React.useState(null);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedMenuForBooking, setSelectedMenuForBooking] = React.useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      // Assuming Category 1 is for MSCATERERSBox based on seed data
      const { data } = await api.get('/menus/category-name/MSCATERERSBox');
      if (data.success) {
        setMenus(data.menus);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateQuote = async (menuId) => {
    try {
      setQuoteLoading(menuId);
      const { data } = await api.post('/bookings/calculate', {
        menuId,
        guestCount: 50, // Default for quick quote
        addonIds: []
      });
      if (data.success) {
        setShowQuote(data.breakdown);
      }
    } catch (error) {
      console.error('Error calculating quote:', error);
    } finally {
      setQuoteLoading(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const bannerImages = [banner1, banner2, banner3, banner4, banner5];

  const options = [
    { id: 'BulkFood', title: 'BulkFood', subtitle: '(Delivery Only)', img: 'https://siridemo.co.in/ms/final-1/assets/images/cusi/1.png' },
    { id: 'FoodService', title: 'Food + Service', subtitle: '', img: 'https://siridemo.co.in/ms/final-1/assets/images/cusi/2.png' },
    { id: 'LiveServices', title: 'Food + Live Services', subtitle: '', img: 'https://siridemo.co.in/ms/final-1/assets/images/cusi/3.png' }
  ];

  const stats = [
    { value: '100,000 +', label: 'Happy Customers' },
    { value: '10,000 +', label: 'Events Catered' },
    { value: '100 +', label: 'City Presence' },
    { value: '11', label: 'Years of Experience' }
  ];

  const howItWorks = [
    { id: 1, title: 'Choose Your Service', desc: 'Select buffet, live counter, or meal boxes.' },
    { id: 2, title: 'Customize Your Menu', desc: 'Pick from over 100+ delicious dishes.' },
    { id: 3, title: 'We Prepare & Deliver', desc: 'Our chefs cook fresh and deliver on time.' },
    { id: 4, title: 'Enjoy Your Event', desc: 'Sit back and relax — we handle the rest!' }
  ];

  const bestSellers = [
    {
      id: 1,
      name: 'Desi Darbar',
      price: '479',
      image: food_1
    },
    {
      id: 2,
      name: 'Punjabi Tadka',
      price: '509',
      image: food_2
    },
    {
      id: 3,
      name: 'Party Sharty',
      price: '449',
      image: food_3
    },
    {
      id: 4,
      name: 'Biryani n More',
      price: '399',
      image: food_4
    },
    {
      id: 5,
      name: 'Desi Bahar',
      price: '539',
      image: food_1
    },
    {
      id: 6,
      name: 'Desi Dumdar',
      price: '569',
      image: food_2
    }
  ];

  const filteredProducts = bestSellers.filter(product => {
    // Filter by Veg/Non-Veg (for demo, some are veg, some are non-veg)
    const productIsVeg = product.id % 2 !== 0; // Odd IDs are Veg, Even are Non-Veg
    if (isVeg && !productIsVeg) return false;
    if (!isVeg && productIsVeg) return false;

    // Filter by Price Range
    const price = parseInt(product.price);
    if (priceRange === 'under-300') return price < 300;
    if (priceRange === '300-450') return price >= 300 && price <= 450;
    if (priceRange === '450+') return price > 450;

    return true;
  });

  const [isPlaying, setIsPlaying] = React.useState(false);
  const experienceRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const handleScrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const videoId = 'VqC0b3USKME';

  const reviews = [
    {
      name: 'Ananya Rai',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      text: "I ordered MS buffet service for the third time. This time food was best out of all 3 times. All my guests liked the food. There was no extra oil and masala. The food was like a home cooked meal. Dahi vadas we're too good..."
    },
    {
      name: 'Robin Max Almeida',
      img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
      text: 'Ordered food at the last moment for them and turned out be the best decision. Fistly punctuality and then is the quality of food. No regrets to hold people enjoyed every bit of it. Would definetely recommend them.'
    },
    {
      name: 'Sowmya Ravindranath',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      text: 'Myself and my guests enjoyed the food. The packaging was excellent and it was hassle free on my side. I could enjoy the party without any stress. 🤩 Thank you very much for your wonderful service.'
    },
    {
      name: 'uma krrishna',
      img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&q=80',
      text: 'I thoroughly enjoyed the meal, it was really tasty! However, the veg seekh kababs were slightly mashed, making it difficult to serve them properly. Nonetheless, I appreciate that the food was delivered in well-packed...'
    },
    {
      name: 'Naresh Thawal',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      text: 'Overall good experience with your team and cooperation. Food quality arrangements are superb. Very punctual about timing Would like to work in future best of luck ✌️'
    }
  ];

  const reviewScrollRef = useRef(null);

  const scrollReviews = (direction) => {
    if (reviewScrollRef.current) {
      const scrollAmount = 400;
      reviewScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={food_5}
            className="w-full h-full object-cover"
            alt="MSCATERERS Box Background"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-6xl font-black mb-4 tracking-tight font-heading uppercase">
            <span className="text-[#1a202c] drop-shadow-[0_0_15px_rgba(255,255,255,1)]">MSCATERERS</span><span className="text-[#BE2E3E] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Box</span>
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Gourmet catering delivered in sleek, premium boxes. Perfect for 10-100 guests.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => handleScrollTo(experienceRef)}
              className="bg-[#B70C10] text-white px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2"
            >
              Explore Packages <ChevronRight size={18} />
            </button>
            <button
              onClick={() => handleScrollTo(videoRef)}
              className="bg-white text-[#B70C10] px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2"
            >
              <PlayCircle size={18} /> Watch Video
            </button>
          </div>
        </div>
      </section>

      {/* Our Highlights Section */}
      <section className="py-12 bg-white relative group w-full overflow-hidden">
        <div className="w-full">
          <h2 className="text-3xl font-black text-[#B70C10] text-center mb-8 font-heading">Our Highlights</h2>

          <div className="relative">
            {/* Arrows */}
            <button
              onClick={() => scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#FFD700] shadow-lg rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <button
              onClick={() => scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#FFD700] shadow-lg rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4"
            >
              {[...bannerImages, ...bannerImages].map((img, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-[400px] h-[180px] md:h-[250px] rounded-2xl overflow-hidden shadow-md border border-gray-100 snap-start flex-shrink-0"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt={`Highlight ${i}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#B70C10] py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center text-white border-r last:border-0 border-white/20">
              <div className="text-2xl md:text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm font-medium uppercase tracking-widest opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience New Age Section */}
      <section ref={experienceRef} className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#2d3138] font-heading uppercase">
            Experience <span className="text-[#FF4D00]">New Age Of Catering</span>
          </h2>

          <div className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold text-sm mb-12 shadow-lg">
            Prices start from just <span className="text-[#FF4D00]">₹359</span>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-8 uppercase">
              Choose <span className="text-[#B70C10]">Options</span>
            </h3>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`relative w-[200px] h-[150px] rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 border-2 ${selectedOption === option.id ? 'border-[#B70C10] scale-105 shadow-xl' : 'border-transparent opacity-60'}`}
                >
                  <div className="absolute inset-0">
                    <img src={option.img} className="w-full h-full object-cover" alt={option.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white text-center">
                    <p className="font-black text-sm leading-tight">{option.title}</p>
                    {option.subtitle && <p className="text-[10px] font-bold opacity-80">{option.subtitle}</p>}
                  </div>
                  {/* Radio indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id ? 'border-white bg-[#B70C10]' : 'border-white'}`}>
                      {selectedOption === option.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles & Price Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-12">
            {/* Veg Toggle */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-sm font-bold text-gray-600">Veg</span>
              <button
                onClick={() => setIsVeg(true)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isVeg ? 'bg-green-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isVeg ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Non-Veg Toggle */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-sm font-bold text-gray-600">Non-Veg</span>
              <button
                onClick={() => setIsVeg(false)}
                className={`w-12 h-6 rounded-full relative transition-colors ${!isVeg ? 'bg-[#B70C10]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${!isVeg ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Price Filters */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setPriceRange('under-300')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${priceRange === 'under-300' ? 'bg-[#B70C10] text-white border-[#B70C10]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Under ₹300
                </span>
              </button>
              <button
                onClick={() => setPriceRange('300-450')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${priceRange === '300-450' ? 'bg-[#B70C10] text-white border-[#B70C10]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div> ₹300 - ₹450
                </span>
              </button>
              <button
                onClick={() => setPriceRange('450+')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${priceRange === '450+' ? 'bg-[#B70C10] text-white border-[#B70C10]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div> ₹450+
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-8 px-4 bg-gray-50/50">
        <div className="max-w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-center font-heading">
            Premium <span className="text-[#B70C10]">with Server</span>
          </h2>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 pb-8 custom-scrollbar">
              {loading ? (
                <div className="w-full py-20 flex flex-col items-center justify-center text-gray-500">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold">Fetching Premium Menus...</p>
                </div>
              ) : menus.length > 0 ? (
                menus.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[280px] md:min-w-[320px] bg-white rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden snap-start group"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img src={food_1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                      <div className="absolute top-4 right-4 bg-white p-1 rounded-md shadow-sm">
                        <div className="w-3 h-3 border-2 border-green-600 flex items-center justify-center p-0.5">
                          <div className="w-full h-full rounded-full bg-green-600"></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#4a0404] p-5 text-white">
                      <h3 className="font-black text-xl mb-1 tracking-tight">{item.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest opacity-70 mb-3">Starting from</p>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-3xl font-black">₹{item.base_price_per_plate}</span>
                          </div>
                          <p className="text-[10px] opacity-70">per person</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-yellow-400 font-bold mb-2">Next Available<br />Tomorrow 4:00 PM</p>
                          <button 
                            onClick={() => {
                              setSelectedMenuForBooking(item);
                              setIsBookingOpen(true);
                            }}
                            className="bg-[#B70C10] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white hover:text-[#B70C10] transition-all disabled:opacity-50"
                          >
                            <div className="w-4 h-4 rounded border-2 border-current flex items-center justify-center text-[10px]">+</div>
                            View Menu
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full py-10 text-center text-gray-500 font-bold">
                  No products found for this selection.
                </div>
              )}
            </div>
          </div>

          {/* Menu Popup Integration */}
          <MenuPopup 
            isOpen={isBookingOpen} 
            onClose={() => setIsBookingOpen(false)} 
            menuData={selectedMenuForBooking} 
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 px-4 bg-[#FFF5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#B70C10] font-heading">How It Works</h2>
          <p className="text-gray-500 mb-8 text-lg">We make ordering and hosting effortless</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.id} className="relative pt-8">
                {/* Number Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#B70C10] text-white flex items-center justify-center text-xl font-bold shadow-lg z-10">
                  {step.id}
                </div>

                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 pt-10 h-full shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 leading-tight">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section ref={videoRef} className="py-16 px-4 bg-[#FDF6F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Video Player Mockup */}
          <div className="relative rounded-[15px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer bg-black aspect-video">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Experience Our Service"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full relative" onClick={() => setIsPlaying(true)}>
                <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="w-full h-full object-cover" alt="Video Thumbnail" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>

                {/* Top Bar */}
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                      <img src="https://siridemo.co.in/ms/final-1/assets/images/logo-icon.png" className="w-full h-full object-cover" alt="logo" />
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-medium leading-tight">MSCATERERS Box - Bulk Food Delivery</p>
                      <p className="text-[10px] opacity-70">MSCATERERS</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Elements */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M15 10l5 5-5 5m-10-5h15" /></svg>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <div className="bg-[#1e1e1e]/90 px-4 py-1.5 rounded-sm flex items-center gap-2 border border-white/10 shadow-xl">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">Watch on</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" className="h-4 invert" alt="youtube" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img src="https://siridemo.co.in/ms/final-1/assets/images/logo-icon.png" className="w-full h-full object-cover" alt="logo" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-left md:pl-8">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#B70C10] font-heading tracking-tight">Experience Our Service</h2>
            <p className="text-gray-500 mb-10 text-sm md:text-base leading-relaxed max-w-lg">
              See how we make every event unforgettable with our expert catering setup — from vibrant food displays to seamless service experiences that delight every guest.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { icon: '🍴', text: 'Premium Catering Setup' },
                { icon: '🛎️', text: 'Professional Service Team' },
                { icon: '🥂', text: 'Elegant Presentation' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <span className="text-xl group-hover:scale-120 transition-transform">{item.icon}</span>
                  <span className="text-gray-800 font-bold text-lg">{item.text}</span>
                </div>
              ))}
            </div>

            <button className="bg-[#B70C10] text-white px-12 py-4 rounded-full font-black text-lg shadow-[0_15px_30px_rgba(183,12,16,0.3)] hover:bg-[#8e0a0d] hover:-translate-y-1 transition-all">
              Watch More Videos
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 px-4 bg-[#FDFBFB]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose <span className="text-[#B70C10]">MSCATERERS Box?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🍛', title: 'Hygiene & Quality', desc: 'FSSAI certified kitchens and premium ingredients' },
              { icon: '📦', title: 'Innovative Box', desc: 'Sleek, stackable and eco-friendly packaging' },
              { icon: '⏱️', title: 'On Time Delivery', desc: 'Punctual delivery with real-time tracking' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="font-bold text-xl mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order with Confidence Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 uppercase">Order with <span className="text-[#B70C10]">Confidence</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Safe Packaging', desc: 'Tamper-proof sealed boxes', icon: '🔒' },
              { title: 'Quality Ingredients', desc: 'Fresh and premium produce', icon: '🥬' },
              { title: 'Timely Delivery', desc: 'Hot and fresh food', icon: '🚚' },
              { title: 'Hygiene Assured', desc: 'FSSAI compliant kitchens', icon: '🧼' },
              { title: 'Contactless', desc: 'Safety first protocols', icon: '🤝' },
              { title: 'Expert Chefs', desc: 'Years of culinary experience', icon: '👨‍🍳' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#2d3138] font-heading">
            Explore <span className="text-[#B70C10]">More Services</span>
          </h2>
          <p className="text-gray-500 mb-12 text-lg">Discover all that we offer</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'NinjaBuffet',
                img: 'https://caterninja.com/NEWUI/product-description/ninjabuffet.webp',
                icon: '🏢',
                color: '#FFF5E6'
              },
              {
                name: 'NinjaLive',
                img: 'https://caterninja.com/NEWUI/product-description/ninjalive.webp',
                icon: '🥂',
                color: '#F0F9FF'
              },
              {
                name: 'SnackBox',
                img: 'https://caterninja.com/NEWUI/product-description/snackbox.webp',
                icon: '🎂',
                color: '#FDF2F2'
              },
              {
                name: 'MealBox',
                img: 'https://caterninja.com/NEWUI/product-description/mealbox.webp',
                icon: '🚚',
                color: '#F0FFF4'
              }
            ].map((service, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative rounded-[25px] overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {/* Top Image Area */}
                  <div className="h-[200px] relative overflow-hidden">
                    <img
                      src={service.img}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={service.name}
                    />
                    {/* Badge Icon */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-[15px] bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-xl">
                      {service.icon}
                    </div>
                  </div>

                  {/* Bottom Text Bar */}
                  <div className="bg-white py-5 px-4 border-t border-gray-50">
                    <h3 className="font-black text-xl text-gray-800 tracking-tight">{service.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loved by Our Customers Section */}
      <section className="py-20 px-4 bg-[#FDFBFB]/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#2d3138] font-heading">
            Loved by Our <span className="text-[#FF8A00]">Customers</span>
          </h2>
          <p className="text-gray-500 mb-16">What our happy clients say</p>
          
          <div className="relative group px-4 md:px-12">
            {/* Navigation Arrows */}
            <button 
              onClick={() => scrollReviews('left')}
              className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-white shadow-lg z-10 hover:scale-110 transition-transform"
            >
               <ChevronRight className="rotate-180" size={24} />
            </button>
            <button 
              onClick={() => scrollReviews('right')}
              className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-white shadow-lg z-10 hover:scale-110 transition-transform"
            >
               <ChevronRight size={24} />
            </button>

            <div 
              ref={reviewScrollRef}
              className="flex gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-2 pb-8"
            >
              {reviews.map((review, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[380px] bg-white p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative group/card hover:shadow-xl transition-all duration-500 snap-start">
                  {/* User Profile */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src={review.img} className="w-full h-full object-cover" alt={review.name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-lg leading-tight">{review.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-4 h-4 bg-white shadow-sm rounded flex items-center justify-center border border-gray-100">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-2.5" alt="google" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Google Review</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-6">
                     <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={18} className="fill-[#FFD700] text-[#FFD700]" />
                        ))}
                     </div>
                     <span className="text-sm font-black text-gray-800 ml-1">5.0</span>
                  </div>

                  {/* Review Text */}
                  <div className="relative">
                    <span className="text-[#FDF2F2] text-6xl font-serif absolute -top-4 -left-2 opacity-50 select-none">“</span>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 relative z-10">
                      {review.text}
                    </p>
                    <span className="text-[#FDF2F2] text-6xl font-serif absolute -bottom-10 right-2 opacity-50 rotate-180 select-none">“</span>
                  </div>

                  {/* Read More Button */}
                  <button className="w-full bg-[#FFF5E6] text-[#FF8A00] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#FF8A00] hover:text-white transition-all group-hover/card:scale-[1.02]">
                    Read full review <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
               {reviews.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all ${i === 2 ? 'w-4 bg-[#FFD700]' : 'w-1.5 bg-gray-200'}`}></div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[#FDFBFB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center uppercase">Frequently Asked <span className="text-[#B70C10]">Questions</span></h2>
          <div className="space-y-4">
            {[
              { q: 'What is the minimum order size?', a: 'The minimum order size for MSCATERERS Box is 10 guests.' },
              { q: 'Do you provide service staff?', a: 'MSCATERERS Box is a delivery-only service. For service staff, please check our MSCATERERS Buffet service.' },
              { q: 'How is the food packaged?', a: 'Food is packaged in premium, sleek, stackable and eco-friendly boxes that maintain temperature.' },
              { q: 'Can I customize my menu?', a: 'Yes, you can use our "Create Own Menu" feature to select items of your choice.' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-5 flex justify-between items-center cursor-pointer group hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-lg text-gray-800 group-hover:text-[#B70C10] transition-colors">{item.q}</span>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#B70C10]" />
                </div>
                {/* Answer could be hidden/shown with state, but keeping it simple for now as per design */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <WhatsAppCTA />
    </div>
  );
};

export default MSCATERERSBoxPage;
