import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, MessageCircle, Phone, ChevronRight, ShieldCheck
} from 'lucide-react';

import Navbar from '../components/PricingNavbar';
import { formatINR } from '../utils/currency';
import { supportsRooms } from '../utils/propertyTypeRules';
import useAuth from '../contexts/useAuth';

function telHref(phoneNumber = "") {
  const normalized = String(phoneNumber || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

function propertyImageAlt(property, index = 0) {
  const savedAlt = property?.imageAltTexts?.[index];
  const repeatedAlt = savedAlt && property?.imageAltTexts?.filter((item) => item === savedAlt).length > 1;
  if (savedAlt && !repeatedAlt) return savedAlt;
  const location = [property?.location, property?.city].filter(Boolean).join(" ");
  const type = property?.bhk ? `${property.bhk} BHK ${property?.type || property?.propertyType || "property"}` : property?.type || property?.propertyType || "property";
  const views = ["Exterior view", "Living room", "Bedroom", "Kitchen", "Balcony", "Interior view"];
  return `${views[index % views.length]} of ${type} in ${location || "Gujarat"}`;
}

const PropertyDetails = ({ property, whatsappAvailable, onWhatsAppEnquiry }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const images = Array.from(new Set([property?.image, ...(property?.gallery || [])].filter(Boolean)));
  const galleryImages = images.length ? images : ["https://placehold.co/1200x800/f8fafc/475569?text=No+Property+Image"];
  const activeImage = galleryImages[selectedImage] || galleryImages[0];

  const handleCall = () => {
    if (!isAuthenticated) {
      navigate("/register", {
        state: { redirectTo: `${location.pathname}${location.search}`, fromCall: true, property },
      });
      return;
    }
    const link = telHref(property?.broker?.phone);
    if (!link) return;
    window.location.href = link;
  };

  const handleWhatsApp = () => {
    onWhatsAppEnquiry?.();
  };

  const title = property?.title || "Property";
  const propertyLocation = property?.location || property?.city || "";
  const price = property?.priceAmount || property?.price ? formatINR(property.priceAmount || property.price) : "Price on request";
  const measurement = property?.measurement;
  const unit = measurement?.unit;
  const area = property?.area || (measurement?.value ? `${measurement.value} ${unit || "sqft"}` : property?.sqft ? `${property.sqft} sq.ft` : "");
  const propertyType = supportsRooms(property) && property?.beds ? `${property.beds} BHK` : property?.type || property?.category || "Property";
  const propertyStatus = property?.propertyStatus || (property?.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : "Ready");
  const investmentMetric = property?.roi || (property?.isPreLeased ? "Pre-Leased" : "Verified");
  const callAvailable = Boolean(telHref(property?.broker?.phone));

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
            <div className="mt-3 grid w-full grid-cols-2 gap-3 md:flex md:w-auto md:justify-end">
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={!whatsappAvailable}
                title={whatsappAvailable ? "Enquire on WhatsApp" : "WhatsApp number is not available for this property"}
                className="wf-btn w-full bg-[#25D366] text-white hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 md:w-auto"
              >
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button 
                onClick={handleCall}
                disabled={!callAvailable}
                title={callAvailable ? "Call assigned supervisor" : "Calling number is not available for this property"}
                className="wf-btn w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 md:w-auto"
              >
                <Phone size={18} /> Call Now
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="relative h-[320px] w-full overflow-hidden rounded-2xl shadow-sm sm:h-[500px]">
            <img src={activeImage} alt={propertyImageAlt(property, selectedImage)} className="w-full h-full object-cover" />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600"/> Verified Listing
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
            {galleryImages.slice(0, 6).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(idx)}
                className={`h-20 cursor-pointer overflow-hidden rounded-xl border-2 transition-all sm:h-24 ${selectedImage === idx ? 'scale-95 border-blue-500' : 'border-transparent'}`}
              >
                <img src={img} alt={propertyImageAlt(property, idx)} className="w-full h-full object-cover" />
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
                <p className="text-lg font-bold">{propertyStatus}</p>
                <p className="text-gray-500 text-sm">Status</p>
              </div>
              <div className="sm:border-r">
                <p className="text-lg font-bold">{investmentMetric}</p>
                <p className="text-gray-500 text-sm">{property?.roi ? "ROI" : "Listing"}</p>
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
