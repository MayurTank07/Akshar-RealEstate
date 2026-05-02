export default function Hero() {
  return (
    <div className="relative h-screen w-full">

      {/* Background Image */}
      <img
        src="/house.jpg"
        alt="home"
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-500/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-44 text-white">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight max-w-2xl">
          We Turn Spaces into Places You call Home
        </h1>

        {/* Subtext */}
        <p className="mt-5 text-lg max-w-md text-gray-200">
          Discover the perfect property from our wide selection of homes,
          apartments, and commercial spaces
        </p>

        {/* Search Box */}
        <div className="mt-12 bg-[#f5f5f5] rounded-xl px-6 py-5 shadow-lg max-w-4xl">

  {/* Tabs */}
  <div className="flex gap-6 text-sm mb-3 border-b border-gray-300 pb-2">
    <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
      Buy
    </button>
    <button className="text-gray-500">Rent</button>
    <button className="text-gray-500">Sell</button>
  </div>

  {/* Input + Button */}
  <div className="flex items-center gap-3 mt-4">

    <input
      type="text"
      placeholder="Enter City, Locality, Project"
      className="flex-1 h-11 bg-white border border-gray-200 rounded-md px-4 text-sm outline-none focus:ring-1 focus:ring-blue-500"
    />

    <button className="h-11 px-6 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition">
      🔍 Search
    </button>

  </div>

  {/* Popular Localities */}
  <div className="flex items-center gap-3 mt-4 flex-wrap text-sm">
    
    <span className="text-gray-500">Popular Localities:</span>

    {["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Indore"].map(
      (city) => (
        <span
          key={city}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs"
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