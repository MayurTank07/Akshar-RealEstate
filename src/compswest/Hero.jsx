import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Maximize, Heart, 
  ChevronDown, Menu, SlidersHorizontal, Bookmark 
} from 'lucide-react';

import propertydata from '../data/pricingproperties.json'; 

export default function PricingPage() {
  const { category, slug } = useParams();
  const navigate = useNavigate();

  const [activeType, setActiveType] = useState("Apartments");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (slug) {
      const parts = slug.split('-');
      const rawCity = parts[parts.length - 1];
      setCity(rawCity.charAt(0).toUpperCase() + rawCity.slice(1));
    }
  }, [slug]);

  const searchType = category === "rentals" ? "Rent" : "Buy";

  // ✅ NAVIGATION FUNCTION
  const handlePropertyClick = (item) => {
    navigate("/we", { state: { property: item } });
  };

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* Header */}
      <header className="bg-[#2563eb] py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div 
          className="text-2xl font-bold text-white cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Westfield
        </div>
        
        <div className="flex-1 max-w-2xl mx-10 flex bg-white rounded-lg p-1 shadow-lg">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-bold border border-blue-100 whitespace-nowrap">
            {searchType} in {city} <ChevronDown className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center px-4 gap-2">
            <input 
              className="w-full outline-none text-sm" 
              type="text" 
              placeholder={`Search ${category} in ${city}...`} 
            />
            <SlidersHorizontal className="w-4 h-4 text-gray-400 rotate-90" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
            <Bookmark className="w-4 h-4" /> Saved
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-3">
            <Menu className="w-5 h-5 text-gray-600" />
            <img 
              src="https://ui-avatars.com/api/?name=User" 
              className="w-7 h-7 rounded-full" 
              alt="Profile" 
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
            {category} Plans: {city}
          </h2>
          <p className="text-gray-500 text-md mt-2 italic">
            Showing results for {city}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {propertyData.propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold border ${
                activeType === type
                  ? "bg-[#2563eb] text-white border-[#2563eb]"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyData.listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-60">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover" 
                  alt={item.title} 
                />

                <div className={`absolute top-4 left-4 ${item.badgeColor} text-white text-[10px] px-3 py-1 rounded-full`}>
                  {item.badge}
                </div>

                <button className="absolute top-4 right-4 bg-white p-2 rounded-full">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">{item.title}</h3>

                <div className="flex items-center text-gray-400 text-xs mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {item.location}
                </div>

                <div className="flex justify-between text-xs mb-6">
                  <div><Bed className="w-4 h-4 inline" /> {item.beds}</div>
                  <div><Bath className="w-4 h-4 inline" /> {item.baths}</div>
                  <div><Maximize className="w-4 h-4 inline" /> {item.sqft}</div>
                </div>

                <div className="flex justify-between pt-5 border-t">
                  <div>
                    <div className="text-xs text-gray-400">Start From</div>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* ✅ CLICK BUTTON */}
                  <button
                    onClick={() => handlePropertyClick(item)}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white"
                  >
                    Details
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}