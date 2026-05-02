import React from "react";

const LuxeEstateHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="font-semibold text-lg text-gray-900">
            LuxeEstate
          </span>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-1 cursor-pointer">
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </div>
      </nav>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-[70%] px-6">

        <h1 className="text-white text-5xl md:text-6xl font-semibold leading-tight max-w-4xl">
          We Turn Spaces into Places <br />
          You Call Home.
        </h1>

        <p className="mt-4 text-white/80 max-w-2xl text-lg">
          From your first consultation to the final key in hand, we're here to
          make your journey to finding the perfect home simple.
        </p>

        {/* Search Box */}
        <div className="mt-10 w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">

          <div className="grid md:grid-cols-4 gap-4">

            {["Looking for", "Price", "Location", "Style"].map((label) => (
              <div key={label}>
                <label className="text-sm text-gray-600 mb-1 block">
                  {label}
                </label>

                <div className="relative">
                  <select className="w-full border border-gray-200 rounded-lg py-3 px-3 text-sm text-gray-500 focus:outline-none focus:border-gray-400">
                    <option></option>
                  </select>

                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-end mt-6">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Search Properties
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center items-start pt-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LuxeEstateHero;