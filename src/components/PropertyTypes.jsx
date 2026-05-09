import { useState } from "react";

const types = [
  {
    title: "Apartments",
    count: "12,500+",
    desc: "Modern, aesthetically and well furnished design for new generation",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Villas",
    count: "8,200+",
    desc: "Luxury living in the most serene locations.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Commercials",
    count: "5,400+",
    desc: "Premium office spaces in the heart of the city.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Plots",
    count: "3,800+",
    desc: "Residential and industrial plots for your next big project.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PropertyTypes() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (dir) => {
    if (dir === "left") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      setActiveIndex((prev) => (prev < types.length - 1 ? prev + 1 : prev));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Explore Property Types
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Find the perfect property that matches your needs
          </p>
        </div>

        {/* Mobile Carousel - Show only on small screens */}
        <div className="md:hidden mb-8">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              {types.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <div
                    key={i}
                    className={`transition-transform duration-500 ease-in-out ${
                      isActive ? "translate-x-0" : "translate-x-full absolute inset-0"
                    }`}
                  >
                    {/* Mobile Property Card */}
                    <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Content */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-200 mb-2 line-clamp-2">{item.desc}</p>
                        <p className="text-lg font-semibold text-blue-400">{item.count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => scroll("left")}
                disabled={activeIndex === 0}
                className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all
                  ${activeIndex === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-400 text-gray-600 hover:bg-white shadow-sm"}`}
              >
                ←
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={activeIndex === types.length - 1}
                className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all
                  ${activeIndex === types.length - 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-md shadow-blue-100"}`}
              >
                →
              </button>
            </div>

            {/* Mobile Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {types.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === i ? "bg-blue-600 w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Interactive Container - Show only on medium screens and up */}
        <div className="hidden md:flex lg:flex-row gap-2 sm:gap-4 h-96 lg:h-[500px] transition-all duration-500 ease-in-out">
          {types.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative cursor-pointer rounded-xl lg:rounded-[2rem] overflow-hidden transition-all duration-700 ease-in-out 
                  ${isActive ? "flex-[3.5]" : "flex-1"} 
                  group h-full`}
              >
                {/* Background Image with Zoom */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 
                    ${isActive ? "scale-110" : "scale-100"}`}
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                  ${isActive ? "opacity-100" : "opacity-60"}`}>
                </div>

                {/* Content */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white pointer-events-none">
                  <div className="overflow-hidden">
                    <h3 className={`font-bold transition-all duration-500 whitespace-nowrap ${isActive ? "text-xl sm:text-2xl lg:text-3xl mb-2" : "text-sm sm:text-base lg:text-lg"}`}>
                      {item.title}
                    </h3>
                    
                    {/* Description logic */}
                    <div className={`transition-all duration-500 ease-in-out
                      ${isActive ? "max-h-16 sm:max-h-20 lg:max-h-24 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
                      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-xs sm:max-w-md lg:max-w-lg line-clamp-2 sm:line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    <p className={`font-semibold transition-all duration-500 ${isActive ? "text-base sm:text-lg lg:text-xl text-blue-400" : "text-xs sm:text-sm text-gray-300"}`}>
                      {item.count}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Navigation Arrows - Hidden on mobile */}
        <div className="hidden md:flex justify-center gap-4 mt-8">
          <button
            onClick={() => scroll("left")}
            disabled={activeIndex === 0}
            className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all
              ${activeIndex === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-400 text-gray-600 hover:bg-white shadow-sm"}`}
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={activeIndex === types.length - 1}
            className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-all
              ${activeIndex === types.length - 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-md shadow-blue-100"}`}
          >
            →
          </button>
        </div>

      </div>
    </div>
  );
}