import React from "react";
import {
  Building2, Hotel, Store, LayoutGrid, Building, Leaf
} from "lucide-react";

const propertyTypes = [
  {
    name: "Apartments",
    count: "12,500+",
    icon: Building2,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
  {
    name: "Villas",
    count: "8,200+",
    icon: Hotel,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    name: "Commercial",
    count: "5,400+",
    icon: Store,
    iconColor: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    name: "Plots",
    count: "3,800+",
    icon: LayoutGrid,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    name: "PG/Hostel",
    count: "2,100+",
    icon: Building,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-100",
  },
  {
    name: "Farmhouse",
    count: "1,500+",
    icon: Leaf,
    iconColor: "text-teal-500",
    bgColor: "bg-teal-100",
  },
];

const PropertyTypeCard = ({ name, count, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white rounded-4xl w-[120px] h-[110px] flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
    
    <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={1.8} />
    </div>

    <p className="text-[13px] font-semibold text-gray-800 leading-none">
      {name}
    </p>

    <p className="text-[11px] text-gray-400 leading-none">
      {count}
    </p>
  </div>
);

const ExplorePropertyTypes = () => {
  return (
    <div className="bg-[#FFFFFF] py-12">
      
      <h2 className="text-[22px] font-semibold text-center text-gray-900">
        Explore Property Types
      </h2>

      <p className="text-[13px] text-gray-400 text-center mt-2 mb-8">
        Find the perfect property that matches your needs
      </p>

      <div className="grid grid-cols-3 gap-5 justify-center max-w-[420px] mx-auto">
        {propertyTypes.map((type) => (
          <PropertyTypeCard key={type.name} {...type} />
        ))}
      </div>

    </div>
  );
};

export default ExplorePropertyTypes;