import { useState } from 'react';
import { Play, MapPin, Bookmark, ChevronDown } from 'lucide-react';
import { publicApi } from '../services/api';
import { buildInternationalPhone, countryCodeOptions, normalizePhoneDigits } from '../utils/countryCodes';

export default function PropertyInformation({ property }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", countryCode: "+91", phone: "", homeLoan: false });
  const [message, setMessage] = useState("");
  const broker = property?.broker || {};
  const contactName = broker.name || "Akshar Estate Expert";
  const contactPhone = broker.phone || "+91 1800-123-4567";
  const companyName = broker.companyName || "";
  const initials = contactName.split(" ").map((item) => item[0]).join("").slice(0, 2).toUpperCase() || "AE";
  const videoThumb = property?.image || property?.gallery?.[0] || "https://placehold.co/1200x700/f8fafc/475569?text=No+Property+Image";
  const mapImage = "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=1200";
  const description = property?.description?.trim()
    || "Experience premium real estate designed for modern living, strong connectivity, practical layouts, and verified Akshar Estate assistance from enquiry to closure.";

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const propertyId = /^[a-f\d]{24}$/i.test(property?._id || "") ? property._id : undefined;
      await publicApi.createEnquiry({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        countryCode: form.countryCode,
        phone: buildInternationalPhone(form.countryCode, form.phone),
        preferredLocation: property?.city || property?.location || "",
        propertyType: property?.type || "",
        propertyTitle: property?.title || "",
        propertyId,
        message: `Broker callback requested${form.homeLoan ? " with home loan interest" : ""}.`,
        source: "property-detail",
      });
      setMessage("Thanks. Our team will contact you shortly.");
      setForm({ firstName: "", lastName: "", email: "", countryCode: "+91", phone: "", homeLoan: false });
    } catch (error) {
      setMessage(error.message || "Could not submit enquiry. Please try again.");
    }
  };

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : name === "phone" ? normalizePhoneDigits(value) : value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans antialiased">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Content */}
        <div className="flex-1 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="whitespace-pre-line text-gray-500 text-[14px] leading-relaxed">
              {description}
            </p>
          </section>

          {/* Video Tour */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tour</h2>
            <button
              type="button"
              onClick={() => property?.videoUrl && window.open(property.videoUrl, "_blank", "noopener,noreferrer")}
              className="relative block w-full overflow-hidden rounded-2xl text-left shadow-lg group"
            >
              <img 
                src={videoThumb}
                className="w-full h-[350px] object-cover" 
                alt="Property Video Thumbnail"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-bg group-hover:bg-black/30">
                <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
                <div className="absolute top-8 w-full text-center">
                   <h3 className="text-white text-4xl font-black uppercase tracking-tighter drop-shadow-lg">
                    {property?.title || "Property Tour"}
                   </h3>
                </div>
              </div>
            </button>
          </section>

          {/* Map View */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Map View</h2>
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px]">
              {property?.map?.embedUrl ? (
                <iframe title="Property map" src={property.map.embedUrl} className="h-full w-full border-0" loading="lazy" />
              ) : (
                <img src={mapImage} className="w-full h-full object-cover" alt="Map View" />
              )}
              {/* Custom Pin Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                   <div className="bg-white px-3 py-1 rounded shadow-md text-[10px] font-bold mb-1 border border-gray-100">
                    {property?.map?.address || property?.location || "Urban Living"}
                   </div>
                   <div className="relative">
                     <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                     <MapPin className="w-8 h-8 text-red-500 -mt-7 drop-shadow-md" />
                   </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Form */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-10 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            
            {/* Status Badge */}
            <div className="bg-[#f0fdf4] text-[#16a34a] text-[13px] font-medium py-3 px-4 rounded-xl flex items-center gap-2 mb-6">
              <span className="text-lg">✨</span>
              Nice Choice, Let's connect with the Experts
            </div>

            {/* Agent Profile */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700 text-lg">
                {initials}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-none mb-1">{contactName}</h4>
                {companyName && <p className="text-xs text-gray-400">{companyName}</p>}
                <p className="text-blue-600 text-xs font-semibold mt-1">{contactPhone}</p>
              </div>
            </div>

            <form id="contact-form" onSubmit={submit} className="space-y-4">
              <h4 className="font-bold text-gray-900">Please share your Contact details</h4>
              
              <div className="flex gap-3">
                <input name="firstName" value={form.firstName} onChange={update} placeholder="First Name*" className="w-1/2 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" required />
                <input name="lastName" value={form.lastName} onChange={update} placeholder="Last Name*" className="w-1/2 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" required />
              </div>
              
              <input name="email" type="email" value={form.email} onChange={update} placeholder="E-mail*" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" required />
              
              <div className="flex gap-2">
                <div className="relative min-w-[96px]">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={update}
                    className="h-full w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-3 pr-7 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
                    aria-label="Country code"
                  >
                    {countryCodeOptions.map((option) => (
                      <option key={`${option.label}-${option.value}`} value={option.value}>{option.value}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <input name="phone" value={form.phone} onChange={update} placeholder="Phone number*" className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" required />
              </div>

              {/* T&C */}
              <div className="pt-4 space-y-4">
                <h5 className="font-bold text-[15px]">Terms and Conditions</h5>
                <label className="flex gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-[12px] text-gray-500 leading-tight">
                    I agree to be contacted by the Akshar Estate brokerage team via WhatsApp, SMS, phone, or email.
                  </span>
                </label>
                <label className="flex gap-3 cursor-pointer group">
                  <input name="homeLoan" type="checkbox" checked={form.homeLoan} onChange={update} className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[12px] text-gray-500 leading-tight">
                    I am interested in Home loans
                  </span>
                </label>
              </div>

              <button className="w-full bg-[#2563eb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                Request Broker Callback
              </button>
              {message && <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-700">{message}</p>}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-[13px] leading-tight">
                  <span className="font-bold text-gray-900">Still Deciding?</span><br />
                  <span className="text-gray-400">Shortlist this property for now & easily come back to it later.</span>
                </div>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  <Bookmark className="w-6 h-6 text-gray-400" />
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
