import React from 'react';
import { Bookmark, Menu, Phone, Info, ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function PropertyDetail() {
  const thumbnails = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1600607687940-47a000be3976?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300"
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Blue Header */}
      <header className="bg-[#2563eb] py-4 px-6 flex items-center justify-between shadow-md">
        <div className="text-2xl font-bold text-white tracking-tight">Westfield</div>
        
        <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-lg w-full max-w-xl mx-8">
          <button className="flex items-center gap-2 bg-white text-[#2563eb] text-sm font-semibold px-4 py-1.5 rounded-md whitespace-nowrap">
            Buy In Mumbai <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center gap-2 px-2 border-l border-white/20">
             <span className="bg-blue-50 text-[#2563eb] text-[11px] font-bold px-2 py-0.5 rounded">Vikhroli</span>
             <input type="text" className="bg-transparent border-none outline-none text-white placeholder-white/70 text-sm w-full" />
             <SlidersHorizontal className="w-4 h-4 text-white/70 rotate-90" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-white text-sm font-medium">
            <Bookmark className="w-4 h-4" /> Saved
          </button>
          <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-3">
             <Menu className="w-5 h-5 text-gray-600" />
             <img src="https://ui-avatars.com/api/?name=User&background=random" className="w-7 h-7 rounded-full" alt="Profile" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {/* Breadcrumbs and Last Updated */}
        <div className="flex justify-between items-center text-[12px] text-gray-400 mb-4">
          <nav className="flex gap-1.5">
            <span>Home</span> / <span>Apartments</span> / <span>Mumbai</span> / <span>Vikhroli</span> / <span className="text-gray-600">Nathani Heavens</span>
          </nav>
          <div className="flex items-center gap-1">
            Last Updated : April 22, 2026 <Info className="w-3 h-3" />
          </div>
        </div>

        {/* Title and Price Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Nathani Heavens</h1>
            <p className="text-sm text-gray-500">
              By <span className="text-blue-600 underline cursor-pointer">Nathani Builders</span>
            </p>
            <p className="text-[13px] text-gray-500 mt-1">
              Near Vikhroli Court, Kannamwar Nagar, Vikhroli East, Mumbai - 400083
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-2xl font-bold">
              <span className="text-[#16a34a]">3.0 Cr - 3.81 Cr</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-900 text-lg">₹12.5 K/sq.ft</span>
            </div>
            <p className="text-blue-600 text-[13px] font-semibold mt-1 mb-3">EMI Starts at ₹1.49 Lacs</p>
            <button className="bg-[#2563eb] text-white flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
              <Phone className="w-4 h-4 fill-current" /> Enquire Now
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="mb-4">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-[450px] object-cover rounded-3xl"
            alt="Main Property"
          />
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-6 gap-4 mb-10">
          {thumbnails.map((src, i) => (
            <img key={i} src={src} className="w-full h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition" alt={`View ${i}`} />
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-4 border-t border-gray-100 pt-8 text-center">
          <div className="border-r border-gray-100">
            <div className="text-xl font-bold text-gray-800">Residential Plots</div>
            <div className="text-gray-400 text-sm">Configuration</div>
          </div>
          <div className="border-r border-gray-100">
            <div className="text-xl font-bold text-gray-800">Ready to move</div>
            <div className="text-gray-400 text-sm">Possession Status</div>
          </div>
          <div className="border-r border-gray-100">
            <div className="text-xl font-bold text-gray-800">₹12.5 K/sq.ft</div>
            <div className="text-gray-400 text-sm">Average Price</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-800">3 BHK</div>
            <div className="text-gray-400 text-sm">Sizes</div>
          </div>
        </div>
      </main>
    </div>
  );
}