import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

const properties = [
  {
    id: 1,
    title: "Azure Heights Villa",
    location: "Malibu, CA",
    price: "$4,250,000",
    beds: 5,
    baths: 4,
    sqft: "4,200",
    tag: "VERIFIED",
    tagColor: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "The Pine Retreat",
    location: "Aspen, CO",
    price: "$2,890,000",
    beds: 3,
    baths: 3,
    sqft: "2,500",
    tag: "FEATURED",
    tagColor: "bg-indigo-700",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Skyloft Penthouse",
    location: "New York, NY",
    price: "$8,120,000",
    beds: 4,
    baths: 5,
    sqft: "5,100",
    tag: null,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
  }
];

const PropertyGrid = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Available Residences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Image Section */}
              <div className="relative h-64">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge/Tag */}
                {property.tag && (
                  <div className={`absolute top-4 left-4 ${property.tagColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm`}>
                    {property.tag}
                  </div>
                )}

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-1.5 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-white fill-white/20" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
                  <span className="text-indigo-600 font-bold">{property.price}</span>
                </div>

                <div className="flex items-center text-gray-400 text-sm mb-6">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}
                </div>

                {/* Amenities */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-xs font-medium">
                    <Bed className="w-4 h-4 mr-1.5 text-indigo-500" />
                    {property.beds} Beds
                  </div>
                  <div className="flex items-center text-gray-500 text-xs font-medium">
                    <Bath className="w-4 h-4 mr-1.5 text-indigo-500" />
                    {property.baths} Baths
                  </div>
                  <div className="flex items-center text-gray-500 text-xs font-medium">
                    <Square className="w-4 h-4 mr-1.5 text-indigo-500" />
                    {property.sqft} sqft
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyGrid;