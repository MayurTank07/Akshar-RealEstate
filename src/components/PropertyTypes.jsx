import { useState, useRef } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0); // Track which card is expanded
  const scrollRef = useRef();

  const scroll = (dir) => {
    if (dir === "left") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      setActiveIndex((prev) => (prev < types.length - 1 ? prev + 1 : prev));
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Explore Property Types
        </h2>
        <p className="text-gray-500 mt-2">
          Find the perfect property that matches your needs
        </p>

        {/* Interactive Container */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 h-[500px] w-full transition-all duration-500 ease-in-out">
          {types.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-700 ease-in-out 
                  ${isActive ? "flex-[3]" : "flex-1"} 
                  group h-full`}
              >
                {/* Background Image with Zoom */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-700 
                    ${isActive ? "scale-110" : "scale-100"}`}
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                  ${isActive ? "opacity-100" : "opacity-70"}`}>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className={`${isActive ? "flex items-end justify-between gap-4" : "block"}`}>
                    <div>
                      <h3 className={`font-bold transition-all duration-500 ${isActive ? "text-3xl" : "text-xl"}`}>
                        {item.title}
                      </h3>
                      
                      {/* Description only shows when active */}
                      <p className={`text-gray-200 mt-2 text-sm leading-relaxed transition-all duration-500 overflow-hidden
                        ${isActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
                        {item.desc}
                      </p>

                      <p className={`font-semibold mt-2 transition-all ${isActive ? "text-xl" : "text-sm text-gray-300"}`}>
                        {item.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => scroll("left")}
            disabled={activeIndex === 0}
            className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all
              ${activeIndex === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-400 text-gray-600 hover:bg-gray-100"}`}
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={activeIndex === types.length - 1}
            className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-all
              ${activeIndex === types.length - 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
          >
            →
          </button>
        </div>

      </div>
    </div>
  );
}