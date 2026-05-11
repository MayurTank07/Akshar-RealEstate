import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, ChevronRight, ShieldCheck
} from 'lucide-react';

import Navbar from '../components/PricingNavbar';
import useAuth from '../contexts/useAuth';

const PropertyDetails = ({ property }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  // Handle automatic call trigger after registration
  useEffect(() => {
    if (isAuthenticated && location.state?.triggerCall) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        const phoneNumber = "+911234567890";
        window.location.href = `tel:${phoneNumber}`;
      }, 500);
    }
  }, [isAuthenticated, location.state?.triggerCall]);

  const images = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
  ];

  const handleCall = () => {
    if (isAuthenticated) {
      const phoneNumber = "+911234567890";
      window.location.href = `tel:${phoneNumber}`;
    } else {
      navigate("/register", {
        state: { 
          fromCall: true,
          redirectTo: "/property-detail",
          property: property 
        }
      });
    }
  };

  const title = property?.title || "Nathani Heavens";
  const propertyLocation = property?.location || "Bodakdev, Ahmedabad";
  const price = property?.price ? `₹${String(property.price).replace(/^₹/, "")}` : "₹3.0 Cr - 3.81 Cr";
  const area = property?.area || (property?.sqft ? `${property.sqft} sq.ft` : "3 BHK");
  const propertyType = property?.beds ? `${property.beds} BHK` : "Premium Home";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <main className="wf-container py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-5 md:flex-row">
          <div>
            <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
              <span>Home</span> <ChevronRight size={12} />
              <span>Properties</span> <ChevronRight size={12} />
              <span className="text-gray-400">{title}</span>
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
            <p className="mt-1 text-sm font-semibold text-blue-600">Verified Akshar Estate The Property HUB Listing</p>
            <div className="mt-2 flex items-center text-sm text-slate-500">
              <MapPin size={14} className="mr-1" />
              {propertyLocation}
            </div>
          </div>

          <div className="w-full md:w-auto md:text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <span className="text-2xl font-extrabold text-emerald-700">{price}</span>
            </div>
            <button 
              onClick={handleCall}
              className={`wf-btn mt-3 w-full md:w-auto ${
                isAuthenticated ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'wf-btn-primary'
              }`}
            >
              {isAuthenticated ? <><Phone size={18} /> Call Now</> : <><Mail size={18} /> Enquire Now</>}
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="relative h-[320px] w-full overflow-hidden rounded-2xl shadow-sm sm:h-[500px]">
            <img src={images[selectedImage]} alt="Main View" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600"/> Verified Listing
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
            {images.slice(1).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(idx + 1)}
                className={`h-20 cursor-pointer overflow-hidden rounded-xl border-2 transition-all sm:h-24 ${selectedImage === idx + 1 ? 'scale-95 border-blue-500' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-2 gap-y-6 border-y border-gray-100 py-8 text-center sm:grid-cols-4">
              <div className="sm:border-r">
                <p className="text-lg font-bold">{propertyType}</p>
                <p className="text-gray-500 text-sm">Type</p>
              </div>
              <div className="sm:border-r">
                <p className="text-lg font-bold">Ready</p>
                <p className="text-gray-500 text-sm">Status</p>
              </div>
              <div className="sm:border-r">
                <p className="text-lg font-bold">₹12.5 K</p>
                <p className="text-gray-500 text-sm">Price/sq.ft</p>
              </div>
              <div>
                <p className="text-lg font-bold">{area}</p>
                <p className="text-gray-500 text-sm">Area</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
