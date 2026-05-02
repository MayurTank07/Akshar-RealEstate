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
    <div className="bg-white border border-gray-300 rounded-[24px] w-full overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <span className={`w-5 h-5 rounded-full flex-shrink-0 ${dotClass}`} />
        <h3 className="font-bold text-[#111827] text-[15px]">
          Popular Residential Searches
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 p-6">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)} // Updates selection on click
            className={`text-[14px] px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 leading-snug max-w-[240px]
              ${
                index === activeIndex
                  ? "border border-blue-400 bg-blue-50 text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50 border border-transparent"
              }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickPropertySearch = () => {
  return (
    <div className="bg-white px-6 md:px-20 py-12">
      {/* Title Section */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-[36px] font-bold text-[#0F172A] tracking-tight">
          Quick Property Searches
        </h2>
        <p className="text-gray-500 text-base mt-2">
          Find properties by popular searches
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card dotClass="bg-[#16a34a]" defaultIndex={1} />
        <Card dotClass="bg-[#a1a111]" defaultIndex={-1} />
        <Card dotClass="bg-[#0ea5e9]" defaultIndex={-1} />
      </div>
    </div>
  );
};

export default QuickPropertySearch;