export default function Hero() {
  return (
    <div className="relative h-screen w-full min-h-[600px]">

      {/* Background Image */}
      <img
        src="/house.jpg"
        alt="home"
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-500/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-44 pb-8 text-white h-full flex flex-col justify-center">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-2xl lg:max-w-3xl">
          We Turn Spaces into Places You call Home
        </h1>

        {/* Subtext */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg max-w-md lg:max-w-lg text-gray-200">
          Discover the perfect property from our wide selection of homes,
          apartments, and commercial spaces
        </p>

        {/* Search Box */}
        <div className="mt-8 sm:mt-10 lg:mt-12 bg-[#f5f5f5] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-lg w-full max-w-4xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm mb-3 border-b border-gray-300 pb-2 overflow-x-auto">
            <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 whitespace-nowrap">
              Buy
            </button>
            <button className="text-gray-500 whitespace-nowrap">Rent</button>
            <button className="text-gray-500 whitespace-nowrap">Sell</button>
          </div>

          {/* Input + Button */}
          <div className="flex items-center gap-2 sm:gap-3 mt-4 flex-col sm:flex-row">

            <input
              type="text"
              placeholder="Enter City, Locality, Project"
              className="flex-1 w-full h-10 sm:h-11 bg-white border border-gray-200 rounded-md px-3 sm:px-4 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button className="h-10 sm:h-11 px-4 sm:px-6 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap w-full sm:w-auto">
              🔍 Search
            </button>

          </div>

          {/* Popular Localities */}
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 flex-wrap text-xs sm:text-sm">
            
            <span className="text-gray-500 whitespace-nowrap">Popular Localities:</span>

            {["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Indore"].map(
              (city) => (
                <span
                  key={city}
                  className="bg-gray-200 text-gray-600 px-2 sm:px-3 py-1 rounded-full text-xs whitespace-nowrap"
                >
                  {city}
                </span>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
}