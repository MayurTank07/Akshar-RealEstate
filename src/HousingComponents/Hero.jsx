import { useState } from "react";

const tabs = ["Buy", "Rent", "Sell", "Pg"];
const popularCities = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad"];

export default function HousingHero() {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div className="font-[Inter,sans-serif]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold">
            <span className="text-[#1a56db]">Housing</span>
            <span className="text-gray-800">.com</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-700">
            {["Buy", "Rent", "Sell"].map((item) => (
              <span key={item} className="flex items-center gap-1 cursor-pointer hover:text-[#1a56db]">
                {item}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            ))}
            <span className="cursor-pointer hover:text-[#1a56db]">Home Loans</span>
            <span className="cursor-pointer hover:text-[#1a56db]">Agent Finder</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 cursor-pointer hover:text-[#1a56db]">Login</span>
          <button className="bg-[#1a56db] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1648c0] transition">
            Post Property Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="py-16 px-8"
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #f8faff 60%, #eef6ff 100%)",
        }}
      >
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-[42px] font-extrabold text-gray-900 leading-tight mb-3">
            Find Your Dream Home
          </h1>
          <p className="text-gray-500 text-base">
            Discover the perfect property from our wide selection of homes,
            <br />
            apartments, and commercial spaces
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          {/* Tabs */}
          <div className="flex gap-6 mb-5 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#1a56db] text-[#1a56db]"
                    : "border-b-2 border-transparent text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex gap-3">
            <div className="flex items-center flex-1 border border-gray-200 rounded-lg px-3 py-2 gap-2 bg-white">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                className="flex-1 text-sm text-gray-400 outline-none placeholder-gray-400"
                placeholder="Enter City, Locality, Project"
              />
            </div>
            <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <input className="w-full text-sm text-gray-400 outline-none" />
            </div>
            <button className="bg-[#1a56db] text-white text-sm font-semibold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1648c0] transition whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Popular Cities */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">Popular:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                className="text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:border-[#1a56db] hover:text-[#1a56db] transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}