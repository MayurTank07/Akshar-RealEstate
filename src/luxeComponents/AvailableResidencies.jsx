import React from "react";
import { Heart, MapPin, BedDouble, Bath, Maximize } from "lucide-react";

const properties = [
  {
    title: "Luxury Modern Villa",
    location: "Palm Jumeirah, Dubai",
    beds: 6,
    baths: 3,
    area: "3200 sq ft",
    price: "₹8.5 Cr",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    tag: "Featured",
    tagColor: "bg-purple-500",
  },
  {
    title: "Contemporary Apartment",
    location: "Bandra West, Mumbai",
    beds: 3,
    baths: 2,
    area: "1850 sq ft",
    price: "₹2.8 Cr",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    tag: "New",
    tagColor: "bg-teal-500",
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
    tagColor: "bg-orange-500",
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
    tagColor: "bg-purple-500",
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
    tagColor: "bg-teal-500",
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
    tagColor: "bg-orange-500",
  },
];

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden w-[330px]">
      
      {/* Image */}
      <div className="relative">
        <img
          src={property.image}
          alt=""
          className="h-[190px] w-full object-cover"
        />

        {/* Tag */}
        <span
          className={`absolute top-3 left-3 text-white text-xs px-2.5 py-1 rounded-full ${property.tagColor}`}
        >
          {property.tag}
        </span>

        {/* Heart */}
        <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow">
          <Heart size={16} className="text-gray-500" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-gray-800">
          {property.title}
        </h3>

        <p className="text-[12px] text-gray-400 flex items-center gap-1 mt-1">
          <MapPin size={13} /> {property.location}
        </p>

        {/* Info */}
        <div className="flex items-center gap-4 text-[12px] text-gray-500 mt-3">
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={14} /> {property.area}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t my-3"></div>

        {/* Price + Details */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400">Price</p>
            <p className="text-purple-600 font-semibold text-[15px]">
              {property.price}
            </p>
          </div>

          <button className="text-[12px] text-purple-600 font-medium">
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};

const AvailableResidences = () => {
  return (
    <div className="bg-gray-100 py-10 px-6">
      
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <div>
          <p className="text-[11px] text-purple-500 font-semibold uppercase">
            Featured Collection
          </p>
          <h2 className="text-[22px] font-semibold text-gray-900">
            Available Residences
          </h2>
        </div>

        <button className="text-[12px] text-purple-600">
          View all listings →
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-purple-600 text-white text-[13px] px-6 py-2.5 rounded-lg shadow hover:bg-purple-700">
          View All Properties
        </button>
      </div>
    </div>
  );
};

export default AvailableResidences;