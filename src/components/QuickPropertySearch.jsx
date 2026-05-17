import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pricingPathFor, pricingStateFromLabel } from "../utils/propertyRouting";

const searchGroups = [
  {
    title: "Popular Sale Searches",
    dotClass: "bg-[#16a34a]",
    items: [
      "Residential Property for Sale in Ahmedabad",
      "Apartments for Sale in Surat",
      "Villas for Sale in Vadodara",
      "Plots for Sale in Gandhinagar",
      "Commercial Property in Rajkot",
    ],
    navKey: "buyers",
    defaultIndex: 0,
  },
  {
    title: "Popular Rental Searches",
    dotClass: "bg-[#a1a111]",
    items: [
      "Properties for Rent in Ahmedabad",
      "Apartments for Rent in Surat",
      "Villas for Rent in Vadodara",
      "Commercial Property for Rent in Rajkot",
      "Properties for Rent in Gandhinagar",
    ],
    navKey: "rentals",
    defaultIndex: -1,
  },
  {
    title: "High Intent Searches",
    dotClass: "bg-[#0ea5e9]",
    items: [
      "Pre-Leased Properties in Ahmedabad",
      "Property Acquisition in Surat",
      "Commercial Property in Ahmedabad",
      "Property Listings in Vadodara",
      "Residential Property for Sale in Anand",
    ],
    navKey: "buyers",
    defaultIndex: -1,
  },
];

const Card = ({ group }) => {
  const navigate = useNavigate();
  const { dotClass, title, items, navKey, defaultIndex = -1 } = group;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const goToSearch = (item, index) => {
    setActiveIndex(index);
    navigate(pricingPathFor(item, navKey), { state: pricingStateFromLabel(item, navKey) });
  };

  return (
    <div className="wf-card wf-card-hover w-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0 ${dotClass}`} />
        <h3 className="font-bold text-[#111827] text-sm sm:text-[15px]">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-2 p-4 sm:p-6">
        {items.map((item, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToSearch(item, index)}
            className={`w-full cursor-pointer rounded-xl border px-3 py-2.5 text-left text-xs leading-snug transition-all duration-300 sm:px-4 sm:py-3.5 sm:text-sm
              ${
                index === activeIndex
                  ? "border-blue-400 bg-blue-50 font-semibold text-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
              }`}
          >
            <span className="line-clamp-2 sm:line-clamp-none">{item}</span>
          </button>
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
        {searchGroups.map((group) => (
          <Card key={group.title} group={group} />
        ))}
      </div>
      </div>
    </section>
  );
};

export default QuickPropertySearch;
