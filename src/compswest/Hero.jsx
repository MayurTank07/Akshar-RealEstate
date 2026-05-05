import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';

import propertyData from "../data/pricingProperties.json";
import Navbar from "../components/PricingNavbar"; // ✅ added

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

  const handlePropertyClick = (item) => {
    navigate(`/property/${item.id}`, { state: { property: item } });
  };

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ✅ Navbar Component */}
      <Navbar searchType={searchType} city={city} />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {propertyData.propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                activeType === type
                  ? "bg-[#2563eb] text-white border-[#2563eb]"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyData.listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-44"> 
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover" 
                  alt={item.title} 
                />

                <div className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tight`}>
                  {item.badge}
                </div>

                <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm">
                  <Heart className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-md font-bold text-gray-900 mb-0.5">{item.title}</h3>

                <div className="flex items-center text-gray-400 text-[11px] mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {item.location}
                </div>

                <div className="flex justify-start gap-5 text-[11px] text-gray-500 mb-6">
                  <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {item.beds}</div>
                  <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {item.baths}</div>
                  <div className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {item.sqft} sq.ft</div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Price</div>
                    <div className="text-lg font-extrabold text-blue-600">
                      ₹{item.price}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePropertyClick(item)}
                    className="text-blue-600 text-[12px] font-bold flex items-center gap-1 hover:underline"
                  >
                    Details <span className="text-[14px]">→</span>
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