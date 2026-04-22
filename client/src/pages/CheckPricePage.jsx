import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const CheckPricePage = () => {
  const [formData, setFormData] = useState({
    city: '',
    occasion: '',
    date: '',
    time: '',
    vegGuests: '0',
    nonVegGuests: '0'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const cities = [
    "Bangalore", "Gurgaon", "Delhi", "Noida", "Mumbai", "Thane", 
    "Navi-Mumbai", "Ghaziabad", "Pune", "Chennai", "Hyderabad", "Chandigarh"
  ];

  const occasions = [
    "Birthday", "House Party", "Pooja @ Home", "Pre-Wedding", "Office Party",
    "House Warming", "Kitty Party", "Kids Party", "Baby Shower", "Anniversary",
    "Inviting Guests", "Festivals", "Others"
  ];

  const timeSlots = [
    "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM", "12:00 PM - 12:30 PM",
    "12:30 PM - 1:00 PM", "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM",
    "2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM", "3:00 PM - 3:30 PM",
    "3:30 PM - 4:00 PM", "4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM",
    "5:00 PM - 5:30 PM", "5:30 PM - 6:00 PM", "6:00 PM - 6:30 PM",
    "6:30 PM - 7:00 PM", "7:00 PM - 7:30 PM", "7:30 PM - 8:00 PM",
    "8:00 PM - 8:30 PM", "8:30 PM - 9:00 PM", "9:00 PM - 9:30 PM",
    "9:30 PM - 10:00 PM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#F9E5E5]">
      <main className="max-w-md mx-auto mt-3 pb-24 min-h-screen">
        {/* Stepper Section */}
        <div className="flex justify-center gap-3 items-center mb-1">
          <div className="flex cursor-pointer gap-3 items-center">
            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#F1BFBC]">
              <img src="https://caterninja.com/NEWUI/icons/menu.svg" width="25px" height="25px" alt="menu" />
            </div>
            <div className="text-center">
              <div className="tracking-wider text-black text-2xl">⇢</div>
            </div>
          </div>
          <div className="flex cursor-pointer gap-3 items-center">
            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#DCDCDC]">
              <img src="https://caterninja.com/NEWUI/icons/event.svg" width="25px" height="25px" alt="event" />
            </div>
            <div className="text-center">
              <div className="tracking-wider text-black text-2xl">⇢</div>
            </div>
          </div>
          <div className="flex cursor-pointer gap-3 items-center">
            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#DCDCDC]">
              <img src="https://caterninja.com/NEWUI/icons/getprice.svg" width="25px" height="25px" alt="get price" />
            </div>
            <div className="text-center">
              <div className="tracking-wider text-black text-2xl">⇢</div>
            </div>
          </div>
          <div className="flex cursor-pointer gap-3 items-center">
            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#DCDCDC]">
              <img src="https://caterninja.com/NEWUI/icons/payment.svg" width="25px" height="25px" alt="payment" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <div className="text-center w-20"><p className="text-xs font-semibold text-black">Select Event</p></div>
          <div className="text-center w-20"><p className="text-xs font-semibold text-gray-500">Select Menu</p></div>
          <div className="text-center w-20"><p className="text-xs font-semibold text-gray-500">Get Price</p></div>
          <div className="text-center w-20"><p className="text-xs font-semibold text-gray-500">Payment</p></div>
        </div>

        <hr className="mt-0" />

        <div className="border-t border-gray-200">
          <div className="mb-6 pt-4">
            <h2 className="text-2xl font-semibold text-[#B70C10] mb-5 ms-3 md:ps-5">Event Details</h2>
            
            <div className="grid grid-cols-2 gap-y-6 place-items-center mx-3">
              {/* City */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/city.svg" className="w-[16px] h-[16px] md:w-[28px] md:h-[28px]" alt="city" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">City</span>
                </label>
                <div className="relative">
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/occasion.svg" className="w-[14px] h-[14px]" alt="occasion" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">Occasion</span>
                </label>
                <div className="relative">
                  <select 
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select Occasion</option>
                    {occasions.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                  </select>
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/date.svg" className="w-[16px] h-[16px]" alt="date" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">Event Date</span>
                </label>
                <div className="relative">
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/time.svg" className="w-[13px] h-[13px]" alt="time" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">Delivery Time</span>
                </label>
                <div className="relative">
                  <select 
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 pr-8 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none appearance-none"
                  >
                    <option value="">🕐 Select a Time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>✓ {slot}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Veg Guest */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/veg.svg" className="w-[16px] h-[16px]" alt="veg" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">Veg Guest</span>
                </label>
                <div className="relative">
                  <select 
                    name="vegGuests"
                    value={formData.vegGuests}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none appearance-none"
                  >
                    {[...Array(201)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              {/* Non Veg Guest */}
              <div>
                <label className="flex items-center ms-2 mb-1">
                  <img src="https://caterninja.com/NEWUI/icons/nonveg.svg" className="w-[13px] h-[13px]" alt="nonveg" />
                  <span className="text-[#4C4C4C] text-base md:text-xl font-semibold ms-1">Non Veg Guest</span>
                </label>
                <div className="relative">
                  <select 
                    name="nonVegGuests"
                    value={formData.nonVegGuests}
                    onChange={handleInputChange}
                    className="bg-[#FAFAFA] w-[159.38px] md:w-[200px] font-normal text-xs md:text-xl py-2 ps-3 color-[#7F7F80] rounded-md border border-[#E56159] text-gray-500 focus:outline-none appearance-none"
                  >
                    {[...Array(201)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button Section */}
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end px-4 py-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] max-w-md mx-auto">
            <button className="bg-gradient-to-r from-[#B70C10] to-[#E31B23] px-6 text-white rounded-xl min-w-[140px] h-[45px] flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
              <span className="flex text-xs items-center font-extrabold gap-1">
                Create Menu 
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          <div className="h-[20px]"></div>
          <div className="mt-8">
            <img src="https://caterninja.com/NEWUI/diy/bimg.webp" width="100%" height="273" alt="footer" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckPricePage;
