import React, { useState } from "react";

const Card = ({ dotClass, defaultIndex = -1 }) => {
  // Added state to allow user selection
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const items = [
    "Residential Property for Sale in Gandhinagar",
    "Residential Property for Sale in Gandhinagar",
    "Residential Property for Sale in Gandhinagar",
    "Residential Property for Sale in Gandhinagar",
    "Residential Property for Sale in Gandhinagar",
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-xl sm:rounded-[24px] w-full overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 ${dotClass}`} />
        <h3 className="font-bold text-[#111827] text-sm sm:text-[15px]">
          Popular Residential Searches
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 p-4 sm:p-6">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)} // Updates selection on click
            className={`text-xs sm:text-[14px] px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 leading-snug w-full sm:max-w-[240px]
              ${
                index === activeIndex
                  ? "border border-blue-400 bg-blue-50 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50 border border-transparent"
              }`}
          >
            <span className="line-clamp-2 sm:line-clamp-none">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickPropertySearch = () => {
  return (
    <div className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12">
      {/* Title Section */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#0F172A] tracking-tight">
          Quick Property Searches
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Find properties by popular searches
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card dotClass="bg-[#16a34a]" defaultIndex={1} />
        <Card dotClass="bg-[#a1a111]" defaultIndex={-1} />
        <Card dotClass="bg-[#0ea5e9]" defaultIndex={-1} />
      </div>
    </div>
  );
};

export default QuickPropertySearch;