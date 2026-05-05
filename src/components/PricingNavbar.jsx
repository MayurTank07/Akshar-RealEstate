// components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { ChevronDown, Menu, SlidersHorizontal, Bookmark } from "lucide-react";

export default function Navbar({ searchType, city }) {
  const navigate = useNavigate();

  return (
    <header className="bg-[#2563eb] py-3 px-8 flex items-center justify-between sticky top-0 z-50">
      <div 
        className="text-2xl font-bold text-white cursor-pointer" 
        onClick={() => navigate("/")}
      >
        Westfield
      </div>
      
      <div className="flex-1 max-w-2xl mx-10 flex bg-white rounded-lg p-0.5 shadow-sm">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-l-md text-[13px] font-bold border-r border-gray-100 whitespace-nowrap">
          {searchType} in {city} <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center px-4 gap-2">
          <input 
            className="w-full outline-none text-[13px] text-gray-600" 
            type="text" 
            placeholder="Worli" 
          />
          <SlidersHorizontal className="w-4 h-4 text-blue-600 rotate-90" />
        </div>
      </div>

      <div className="flex items-center gap-6 text-white">
        <div className="flex items-center gap-1.5 text-[13px] font-medium cursor-pointer">
          <Bookmark className="w-4 h-4" /> Saved
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-3">
          <Menu className="w-4 h-4 text-gray-600" />
          <img 
            src="https://ui-avatars.com/api/?name=User" 
            className="w-7 h-7 rounded-full" 
            alt="Profile" 
          />
        </div>
      </div>
    </header>
  );
}