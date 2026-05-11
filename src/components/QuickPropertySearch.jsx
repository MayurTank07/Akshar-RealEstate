import { useState } from "react";

const Card = ({ dotClass, defaultIndex = -1 }) => {
  // Added state to allow user selection
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const items = [
    "Residential Property for Sale in Ahmedabad",
    "Apartments for Sale in Surat",
    "Villas for Sale in Vadodara",
    "Plots for Sale in Gandhinagar",
    "Commercial Property in Rajkot",
  ];

  return (
    <div className="wf-card w-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 ${dotClass}`} />
        <h3 className="font-bold text-[#111827] text-sm sm:text-[15px]">
          Popular Residential Searches
        </h3>
      </div>

      <div className="flex flex-col gap-2 p-4 sm:p-6">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)} // Updates selection on click
            className={`w-full cursor-pointer rounded-xl border px-3 py-2.5 text-xs leading-snug transition-all duration-200 sm:max-w-[260px] sm:px-4 sm:py-3.5 sm:text-sm
              ${
                index === activeIndex
                  ? "border-blue-400 bg-blue-50 font-semibold text-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
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
    <section className="bg-white py-14 sm:py-16">
      <div className="wf-container">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl md:text-[36px]">
          Quick Property Searches
        </h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Find properties by popular searches
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card dotClass="bg-[#16a34a]" defaultIndex={1} />
        <Card dotClass="bg-[#a1a111]" defaultIndex={-1} />
        <Card dotClass="bg-[#0ea5e9]" defaultIndex={-1} />
      </div>
      </div>
    </section>
  );
};

export default QuickPropertySearch;
