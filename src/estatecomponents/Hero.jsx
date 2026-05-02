import React from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern House" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12 bg-white/90 backdrop-blur-md">
        <div className="text-2xl font-bold text-indigo-700 tracking-tight">
          LuxeEstate
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Buy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Rent</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Sell</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Commercial</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Projects</a>
        </div>

        <div className="flex items-center space-x-5">
          <Search size={20} className="text-gray-600 cursor-pointer" />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md">
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-[0.9] tracking-tight mb-6">
            Find Your <br />
            <span className="text-emerald-400">Masterpiece.</span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
            Moving away from listings toward curated architectural legacies. 
            Discover spaces that define who you are.
          </p>

          {/* Search Pill Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white/20 backdrop-blur-xl p-2 rounded-full border border-white/30 max-w-3xl shadow-2xl">
            {/* Toggle Buttons */}
            <div className="flex items-center bg-white/10 rounded-full p-1 mr-4">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">Buy</button>
              <button className="text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10">Rent</button>
              <button className="text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10">Sell</button>
            </div>

            {/* Input Area */}
            <div className="flex-1 flex items-center px-4 py-2 md:py-0">
              <MapPin size={20} className="text-indigo-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search by neighborhood, city, or address" 
                className="bg-transparent border-none outline-none text-white placeholder:text-white/70 w-full text-sm"
              />
            </div>

            {/* CTA Button */}
            <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg">
              Explore Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;