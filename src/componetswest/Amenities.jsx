import { CheckCircle2, Mail, Phone, Calendar } from 'lucide-react';

export default function PropertyAmenities() {
  const amenities = [
    "Swimming Pool", "Private Garden", "Smart Home System",
    "Home Theater", "Gym", "Parking for 3 Cars",
    "24/7 Security", "Backup Power", "Central AC",
    "Modular Kitchen", "Landscaped Lawn", "Servant Quarter"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      
      {/* Amenities Section */}
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

      {/* Pricing & Actions Card */}
      <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-gray-400 text-sm font-medium">Price</span>
          <div className="text-3xl font-bold text-[#2563eb] mt-1">₹8.5 Cr</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-10">
          <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-50">
            <Mail className="w-5 h-5 fill-current" />
            Send Enquiry
          </button>
          
          <button className="w-full bg-[#059669] hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-50">
            <Phone className="w-5 h-5 fill-current" />
            Call Now
          </button>
          
          <button className="w-full bg-white border-2 border-[#2563eb] text-[#2563eb] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
            <Calendar className="w-5 h-5" />
            Schedule Visit
          </button>
        </div>

        {/* Property Details List */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Property Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Property Type</span>
              <span className="text-gray-700 font-semibold">Villa</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Year Built</span>
              <span className="text-gray-700 font-semibold">2022</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Property ID</span>
              <span className="text-gray-700 font-semibold">LX-0001</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
