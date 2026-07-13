import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Mail, MessageCircle, Phone } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { displayPropertyCode } from '../utils/propertyCode';
import { compactSpecs } from '../utils/propertyTypeRules';
import useAuth from '../contexts/useAuth';

export default function PropertyAmenities({ property, whatsappAvailable, onWhatsAppEnquiry }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const autoActioned = useRef(false);
  const amenities = property?.amenities || [];
  const features = property?.features || [];
  const facilities = property?.facilities || [];
  const phone = property?.broker?.phone || "+9118001234567";

  const triggerCall = location.state?.triggerCall || false;

  useEffect(() => {
    if (autoActioned.current || !isAuthenticated) return;
    if (!triggerCall) return;
    autoActioned.current = true;
    if (triggerCall) {
      setTimeout(() => { window.location.href = `tel:${phone.replace(/\s/g, "")}`; }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleCallClick = () => {
    if (!isAuthenticated) {
      navigate("/register", {
        state: { redirectTo: `${location.pathname}${location.search}`, fromCall: true, property },
      });
      return;
    }
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const handleWhatsAppClick = () => {
    onWhatsAppEnquiry?.();
  };
  const price = property?.priceAmount || property?.price ? formatINR(property.priceAmount || property.price) : "Price on request";
  const details = compactSpecs({ ...property, propertyCode: displayPropertyCode(property?.propertyCode) });

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      
      {amenities.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
          <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
              {amenities.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-[#ecfdf5] rounded-full p-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <span className="text-[13px] text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {features.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Property Features</h2>
          <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-blue-50 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[13px] text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {facilities.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Facilities</h2>
          <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {facilities.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-slate-100 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <span className="text-[13px] text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pricing & Actions Card */}
      <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-gray-400 text-sm font-medium">Price</span>
          <div className="text-3xl font-bold text-[#2563eb] mt-1">{price}</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-10">
          <a href="#contact-form" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-50">
            <Mail className="w-5 h-5 fill-current" />
            Send Enquiry
          </a>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            disabled={!whatsappAvailable}
            title={whatsappAvailable ? "Enquire on WhatsApp" : "WhatsApp number is not available for this property"}
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            {whatsappAvailable ? "Enquire on WhatsApp" : "WhatsApp unavailable"}
          </button>

          <button type="button" onClick={handleCallClick} className="w-full bg-[#059669] hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-50">
            <Phone className="w-5 h-5 fill-current" />
            Call Now
          </button>
        </div>

        {/* Property Details List */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Property Details</h3>
          <div className="space-y-3">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between items-center gap-5 text-sm">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-right text-gray-700 font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
