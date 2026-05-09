import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Heart, Play, CheckCircle2, 
  Phone, Mail, Calendar, ChevronRight, Info,
  Loader2, Unlock, ShieldCheck
} from 'lucide-react';

import Navbar from '../components/PricingNavbar';

const PropertyDetails = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600607687940-477a43bd3955?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
              <span>Home</span> <ChevronRight size={12} />
              <span>Apartments</span> <ChevronRight size={12} />
              <span>Mumbai</span> <ChevronRight size={12} />
              <span className="text-gray-400">Nathani Heavens</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-800">Nathani Heavens</h1>
            <p className="text-blue-600 text-sm font-medium mt-1">By Nathani Builders</p>
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <MapPin size={14} className="mr-1" />
              Near Vikhroli Court, Vikhroli East, Mumbai - 400083
            </div>
          </div>

          <div className="mt-4 md:mt-0 text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <span className="text-2xl font-bold text-green-700">₹3.0 Cr - 3.81 Cr</span>
            </div>
            {/* Contact Button */}
            <button 
              onClick={() => window.location.href = "tel:+911234567890"}
              className="mt-3 px-8 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition ml-auto shadow-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Phone size={18} /> Call Now
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-4 mb-10">
          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-sm relative">
            <img src={images[selectedImage]} alt="Main View" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600"/> Verified Listing
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {images.slice(1).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(idx + 1)}
                className={`h-24 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${selectedImage === idx + 1 ? 'border-blue-500 scale-95' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Status Info */}
            <div className="grid grid-cols-4 border-y border-gray-100 py-8 text-center">
              <div className="border-r">
                <p className="text-lg font-bold">Plots</p>
                <p className="text-gray-500 text-sm">Type</p>
              </div>
              <div className="border-r">
                <p className="text-lg font-bold">Ready</p>
                <p className="text-gray-500 text-sm">Status</p>
              </div>
              <div className="border-r">
                <p className="text-lg font-bold">₹12.5 K</p>
                <p className="text-gray-500 text-sm">Price/sq.ft</p>
              </div>
              <div>
                <p className="text-lg font-bold">3 BHK</p>
                <p className="text-gray-500 text-sm">Sizes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;