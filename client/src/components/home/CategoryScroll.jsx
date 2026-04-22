import { Link } from 'react-router-dom';

const categories = [
  { name: 'House Party', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/1-1.jpg', active: false },
  { name: 'Birthday', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/1-2.jpeg', active: true },
  { name: 'Premium', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80', active: false },
  { name: 'Office', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', active: false },
  { name: 'Anniversary', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80', active: false },
  { name: 'Pooja', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/1-4.png', active: false },
  { name: 'Wedding', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80', active: false },
  { name: 'Festival', image: 'https://siridemo.co.in/ms/final-1/assets/images/cat/1-8.jpg', active: false }
];

const CategoryScroll = () => {
  return (
    <section className="py-10 w-full overflow-hidden mt-4 mb-2 relative group max-w-[1500px] mx-auto">
      
      {/* Title */}
      <div className="px-6 md:px-10 mb-6">
        <h2 className="text-[22px] md:text-[28px] font-[800] text-[#1f2937] font-heading">
          Browse by <span className="text-ninja-red">Occasion</span>
        </h2>
      </div>

      <div className="relative">
        {/* Categories Container */}
        <div 
          className="flex justify-start gap-[1.15rem] md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 category-scrollbar px-6 md:px-10"
        >
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/package?ocassion=${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center shrink-0 snap-start cursor-pointer group/item"
            >
              <div className="w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-[1.8rem] md:rounded-[3rem] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.05)] mb-[16px] border border-gray-100/50 flex items-center justify-center bg-white transition-all duration-500 group-hover/item:shadow-[0_20px_40px_rgba(190,46,62,0.15)] group-hover/item:-translate-y-2">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform group-hover/item:scale-110 duration-700"
                />
              </div>
              <span 
                className={`text-[15px] md:text-[18px] font-bold tracking-tight leading-tight ${category.active ? 'text-ninja-red' : 'text-[#4b5563]'} group-hover/item:text-ninja-red transition-colors duration-200`}
              >
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default CategoryScroll;

