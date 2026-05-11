import { Play, MapPin, Bookmark, ChevronDown } from 'lucide-react';

export default function PropertyInformation() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans antialiased">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Content */}
        <div className="flex-1 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              Experience luxury living at its finest in this stunning modern villa located in Ahmedabad's premium residential corridor. 
              This meticulously designed property features contemporary architecture, premium finishes, and 
              breathtaking views. With spacious interiors, smart home technology, and resort-style amenities, this villa 
              offers the perfect blend of comfort and sophistication.
            </p>
          </section>

          {/* Video Tour */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tour</h2>
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-[350px] object-cover" 
                alt="Property Video Thumbnail"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-bg group-hover:bg-black/30">
                <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 text-white fill-current" />
                </div>
                <div className="absolute top-8 w-full text-center">
                   <h3 className="text-white text-4xl font-black uppercase tracking-tighter drop-shadow-lg">
                    Luxury Apartment Tour
                   </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Map View */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Map View</h2>
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px]">
              {/* Mock Map Image */}
              <img 
                src="https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover" 
                alt="Map View"
              />
              {/* Custom Pin Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                   <div className="bg-white px-3 py-1 rounded shadow-md text-[10px] font-bold mb-1 border border-gray-100">
                    Urban Living
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
                HP
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-none mb-1">Hitesh Patel</h4>
                <p className="text-xs text-gray-400">Real Estate Expert</p>
                <p className="text-blue-600 text-xs font-semibold mt-1">+91 12345 67890</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Please share your Contact details</h4>
              
              <div className="flex gap-3">
                <input placeholder="First Name*" className="w-1/2 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                <input placeholder="Last Name*" className="w-1/2 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
              </div>
              
              <input placeholder="E-mail*" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
              
              <div className="flex gap-2">
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[80px]">
                  +91 <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <input placeholder="Phone number*" className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
              </div>

              {/* T&C */}
              <div className="pt-4 space-y-4">
                <h5 className="font-bold text-[15px]">Terms and Conditions</h5>
                <label className="flex gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-[12px] text-gray-500 leading-tight">
                    I agree to be contacted by Housing and agents via WhatsApp, SMS, phone, email etc
                  </span>
                </label>
                <label className="flex gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[12px] text-gray-500 leading-tight">
                    I am interested in Home loans
                  </span>
                </label>
              </div>

              <button className="w-full bg-[#2563eb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                Get Contact Details
              </button>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-[13px] leading-tight">
                  <span className="font-bold text-gray-900">Still Deciding?</span><br />
                  <span className="text-gray-400">Shortlist this property for now & easily come back to it later.</span>
                </div>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  <Bookmark className="w-6 h-6 text-gray-400" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
