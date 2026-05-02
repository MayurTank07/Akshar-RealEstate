import React from "react";
import { Heart, MapPin, BedDouble, Bath, Maximize } from "lucide-react";

const properties = [
  {
    title: "Luxury Modern Villa",
    location: "Palm Jumeirah, Dubai",
    beds: 4,
    baths: 3,
    area: "3200 sq ft",
    price: "₹8.5 Cr",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    tag: "Featured",
    tagColor: "bg-blue-600",
  },
  {
    title: "Contemporary Apartment",
    location: "Bandra West, Mumbai",
    beds: 3,
    baths: 2,
    area: "1850 sq ft",
    price: "₹2.8 Cr",
    tag: "New",
    tagColor: "bg-green-500",
  },
  {
    title: "Luxury Villa with Pool",
    location: "Whitefield, Bangalore",
    beds: 5,
    baths: 4,
    area: "4500 sq ft",
    price: "₹5.2 Cr",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    tag: "Hot",
    tagColor: "bg-red-500",
  },
  {
    title: "Modern Penthouse",
    location: "Cyber City, Gurgaon",
    beds: 4,
    baths: 3,
    area: "3800 sq ft",
    price: "₹6.5 Cr",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    tag: "Featured",
    tagColor: "bg-blue-600",
  },
  {
    title: "Residential Tower",
    location: "Andheri East, Mumbai",
    beds: 2,
    baths: 2,
    area: "1200 sq ft",
    price: "₹1.8 Cr",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
    tag: "New",
    tagColor: "bg-green-500",
  },
  {
    title: "Cozy Family Home",
    location: "Koramangala, Bangalore",
    beds: 3,
    baths: 2,
    area: "2100 sq ft",
    price: "₹3.2 Cr",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    tag: "Hot",
    tagColor: "bg-red-500",
  },
];

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden w-full max-w-[400px] border border-gray-100">
      
      {/* Image Container */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-[200px] w-full object-cover"
        />

        {/* Dynamic Tag */}
        <span
          className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${property.tagColor}`}
        >
          {property.tag}
        </span>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <Heart size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[17px] font-bold text-gray-800">
          {property.title}
        </h3>

        <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-1.5">
          <MapPin size={13} className="text-gray-400" /> {property.location}
        </p>

        {/* Amenities Info */}
        <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-4">
          <span className="flex items-center gap-1">
            <BedDouble size={15} /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={15} /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={15} /> {property.area}
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
          <p className="text-blue-600 font-bold text-[18px]">
            {property.price}
          </p>
          <button className="text-[13px] text-blue-600 font-semibold hover:underline flex items-center gap-1">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  return (
    <div className="bg-[#fcfcfc] py-16 px-6">
      
      {/* Header Section as per image_e36597.png */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Featured Properties
        </h2>
        <p className="text-[14px] text-gray-500">
          Handpicked properties for you
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>

      {/* Primary Action Button */}
      <div className="flex justify-center mt-12">
        <button className="bg-blue-600 text-white text-[14px] font-bold px-10 py-3 rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          View All Properties
        </button>
      </div>
    </div>
  );
};

export default FeaturedProperties;