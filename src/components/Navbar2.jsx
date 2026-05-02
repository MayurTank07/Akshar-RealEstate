import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl mt-4">
        
        {/* Logo */}
        <h1 className="text-white text-2xl font-semibold">Westfield</h1>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-white text-sm">
          <span>For Buyers ▾</span>
          <span>For Sellers ▾</span>
          <span>For Rentals ▾</span>
          <span>Services</span>
          <span>News and Guide</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Register → black box, white text */}
          <button className="bg-black text-white px-4 py-1.5 rounded-md text-sm">
            Register
          </button>

          {/* Login → white box, black text */}
          <button className="bg-white text-black px-4 py-1.5 rounded-md text-sm">
            Login
          </button>
        </div>

      </div>
    </div>
  );
}