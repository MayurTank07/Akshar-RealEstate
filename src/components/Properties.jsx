// components/Properties.jsx
import { Link } from "react-router-dom";
import properties from "../data/properties.json";

export default function Properties() {
  return (
    <div id="properties" className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <p className="text-blue-600 text-xs sm:text-xs font-semibold tracking-wider uppercase">
              Featured Collection
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
              Available Residences
            </h2>
          </div>

          <button className="text-blue-600 text-sm font-medium hover:underline self-start sm:self-auto">
            View all listings →
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((p) => (
            <Link
              key={p.id}
              to={`/property/${p.id}`}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group cursor-pointer"
            >

              {/* Image */}
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-48 sm:h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Tag */}
                <span
                  className={`absolute top-2 sm:top-3 left-2 sm:left-3 text-xs px-2 sm:px-3 py-1 rounded-full text-white ${
                    p.tag === "Featured"
                      ? "bg-blue-500"
                      : p.tag === "New"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {p.tag}
                </span>

                {/* Heart */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white p-1.5 sm:p-2 rounded-full shadow cursor-pointer hover:scale-110 transition-transform">
                  🤍
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">

                <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1">
                  {p.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  📍 <span className="ml-1 line-clamp-1">{p.location}</span>
                </p>

                {/* Info */}
                <div className="flex gap-3 sm:gap-4 text-gray-500 text-sm mt-3">
                  <span className="flex items-center gap-1">🛏 {p.beds}</span>
                  <span className="flex items-center gap-1">🛁 {p.baths}</span>
                  <span className="flex items-center gap-1">📐 {p.area}</span>
                </div>

                <div className="border-t my-3 sm:my-4"></div>

                {/* Price */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-blue-600 font-semibold text-base sm:text-lg">
                      {p.price}
                    </p>
                  </div>

                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    Details →
                  </button>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition w-full sm:w-auto">
            View All Properties
          </button>
        </div>

      </div>
    </div>
  );
}