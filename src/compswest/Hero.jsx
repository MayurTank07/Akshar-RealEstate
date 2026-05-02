import React, { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  ChevronDown, 
  Menu, 
  SlidersHorizontal,
  Bookmark   // ✅ FIXED: added this import
} from 'lucide-react';

const propertyTypes = ["Apartments", "Commercials", "Farmhouse", "Plots", "Villas", "PG / Hostel"];

const listings = [
  {
    id: 1,
    title: "Anant Skies",
    location: "Worli, Mumbai",
    price: "₹8.5 Cr",
    beds: 4,
    baths: 3,
    sqft: 3200,
    badge: "Featured",
    badgeColor: "bg-blue-600",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Contemporary Apartment",
    location: "Lower Parel, Mumbai",
    price: "₹2.8 Cr",
    beds: 3,
    baths: 2,
    sqft: 1850,
    badge: "New",
    badgeColor: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Gorbs & Pele Towers",
    location: "Worli, Mumbai",
    price: "₹5.2 Cr",
    beds: 3,
    baths: 4,
    sqft: 4500,
    badge: "Hot",
    badgeColor: "bg-orange-600",
    image: "https://images.unsplash.com/photo-1600607687940-47a000be3976?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Gurukrupa Heights",
    location: "Worli, Mumbai",
    price: "₹6.5 Cr",
    beds: 4,
    baths: 3,
    sqft: 3800,
    badge: "Featured",
    badgeColor: "bg-blue-600",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Residential Tower",
    location: "Worli, Mumbai",
    price: "₹1.8 Cr",
    beds: 2,
    baths: 2,
    sqft: 1200,
    badge: "New",
    badgeColor: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Cozy Family Home",
    location: "Worli, Mumbai",
    price: "₹3.2 Cr",
    beds: 3,
    baths: 2,
    sqft: 2100,
    badge: "Hot",
    badgeColor: "bg-orange-600",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  }
];

export default function ListingPage() {
  const [activeType, setActiveType] = useState("Apartments");

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Header */}
      <header className="bg-[#2563eb] py-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="text-2xl font-bold text-white">Westfield</div>
        
        <div className="flex-1 max-w-2xl mx-10 flex bg-white rounded-lg p-1">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-bold border border-blue-100">
            Buy In Mumbai <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center px-4 gap-2">
            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded font-bold">Worli</span>
            <input className="w-full outline-none text-sm" type="text" />
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
               src="https://ui-avatars.com/api/?name=User&background=random" 
               className="w-7 h-7 rounded-full" 
               alt="Profile" 
             />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-5 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                activeType === type 
                ? "bg-[#2563eb] text-white border-[#2563eb] shadow-md shadow-blue-100" 
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <div key={item.id} className="bg-white rounded-[24px] overflow-hidden border border-gray-50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] group hover:shadow-xl transition-all duration-300">
              
              {/* Image */}
              <div className="relative h-60">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                <div className={`absolute top-4 left-4 ${item.badgeColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                  {item.badge}
                </div>
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <div className="flex items-center text-gray-400 text-xs mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {item.location}
                </div>

                <div className="flex items-center justify-between text-gray-500 text-[11px] font-medium mb-6">
                  <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {item.beds}</div>
                  <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {item.baths}</div>
                  <div className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /> {item.sqft} sq.ft</div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Price</span>
                    <div className="text-xl font-bold text-blue-600">{item.price}</div>
                  </div>
                  <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Details →
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