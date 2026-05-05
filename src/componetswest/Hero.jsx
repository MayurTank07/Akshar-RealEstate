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
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const images = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600607687940-477a43bd3955?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
  ];

  const amenities = [
    "Swimming Pool", "Private Garden", "Smart Home System",
    "Home Theater", "Gym", "Parking for 3 Cars",
    "24/7 Security", "Backup Power", "Central AC",
    "Modular Kitchen", "Landscaped Lawn", "Servant Quarter"
  ];

  const goToRegister = () => {
    // If already registered, scroll to the contact actions
    if (isRegistered) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Optional: highlight the form
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for registration/enquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegistered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to show "Call" eligibility
    }, 1500);
  };

  const handleCall = () => {
    if (isRegistered) {
      window.location.href = "tel:+911234567890";
    } else {
      alert("Please register your details first to unlock direct calling.");
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            {/* Dynamic Button Based on Eligibility */}
            <button 
              onClick={isRegistered ? handleCall : goToRegister}
              className={`mt-3 px-8 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition ml-auto shadow-md ${
                isRegistered ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isRegistered ? <><Phone size={18} /> Call Builder Now</> : <><Mail size={18} /> Enquire to Call</>}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-4 mb-10">
          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-sm relative">
            <img src={images[selectedImage]} alt="Main View" className="w-full h-full object-cover" />
            {!isRegistered && (
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-600"/> Verified Listing
                </div>
            )}
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

            <section>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Luxury living in Mumbai with premium finishes and breathtaking views. 
                Register today to unlock floor plans and direct contact with the developer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 shadow-sm">
                {amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: The "Eligibility" Logic lives here */}
          <div className="space-y-6">
            <div ref={formRef} className="bg-white border border-gray-100 rounded-3xl p-6 sticky top-6 shadow-xl transition-all">
              {!isRegistered ? (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 text-blue-800 font-bold mb-1">
                      <Unlock size={18} />
                      <span>Unlock Contact Details</span>
                    </div>
                    <p className="text-[11px] text-blue-600">Register to call the owner and schedule a private site visit.</p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input required type="text" placeholder="Full Name*" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                    <input required type="email" placeholder="E-mail*" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                    <input required type="tel" placeholder="Phone number*" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                    
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Register to Call'}
                    </button>
                  </form>
                </>
              ) : (
                /* THE ELIGIBLE STATE: User can now call */
                <div className="py-4 space-y-6 animate-in fade-in duration-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Access Granted</h3>
                    <p className="text-xs text-gray-500">You are now eligible to contact the expert directly.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">HP</div>
                      <div>
                        <p className="text-sm font-bold">Hitesh Patel</p>
                        <p className="text-[10px] text-gray-400">Builder Representative</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={handleCall}
                        className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all active:scale-95"
                      >
                        <Phone size={20} /> Call +91 12345 67890
                      </button>
                      <button className="w-full border border-gray-200 bg-white text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                        <Calendar size={18} /> Book Site Visit
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-gray-400">Your enquiry ID: #NH-9921 has been sent.</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">Add to Shortlist</span>
                <button className="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <Heart size={20} className="text-red-400 fill-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;