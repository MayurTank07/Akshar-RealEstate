import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Calendar, MapPin, Home, 
  Building2, Mountain, TreePine, ChevronRight, 
  ChevronLeft, Pencil, CheckCircle2 
} from "lucide-react";

export default function PropertyForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    age: "25",
    address: "",
    budget: 5,
    type: "Villa",
    bhk: "2 BHK",
  });

  // Handle Redirection after submission
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = "/"; // Redirects to home page
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const steps = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Preferences" },
    { id: 3, label: "Review" },
  ];

  // Success Message View
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enquiry Submitted!</h2>
          <p className="text-gray-600 leading-relaxed">
            Thank you for your interest. You will receive a call from our team 
            <span className="font-bold text-blue-600"> within 48 hours </span> 
            to help you find your dream home.
          </p>
          
          <div className="mt-8 space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Redirecting to Home
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-[progress_5s_linear]"></div>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-4xl">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Property Enquiry Form</h1>
          <p className="text-gray-500 mt-2">Find your dream home in just 3 simple steps</p>
        </div>

        {/* STEPPER */}
        <div className="relative flex justify-between mb-12 max-w-2xl mx-auto">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                step >= s.id ? "bg-blue-600 border-blue-100 text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span className={`text-xs mt-3 font-semibold ${step >= s.id ? "text-blue-600" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8">
            
            {/* STEP 1: BASIC DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Basic Details</h2>
                  <p className="text-sm text-gray-500">Please provide your contact and personal information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" icon={<User size={18}/>} name="name" value={form.name} onChange={update} placeholder="John Doe" />
                  <InputGroup label="Email Address" icon={<Mail size={18}/>} name="email" value={form.email} onChange={update} placeholder="john.doe@example.com" />
                  <InputGroup label="Phone Number" icon={<Phone size={18}/>} name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210" />
                  <InputGroup label="Age" icon={<Calendar size={18}/>} name="age" value={form.age} onChange={update} placeholder="25" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Current Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea 
                      name="address" 
                      rows="3"
                      value={form.address}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full residential address"
                      onChange={update}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PREFERENCES */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Property Preferences</h2>
                  <p className="text-sm text-gray-500">Help us narrow down the perfect match for your requirements.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-700">Budget Range</label>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                      ₹10L - ₹{form.budget}Cr
                    </span>
                  </div>
                  <input 
                    type="range" min="1" max="50" value={form.budget} 
                    onChange={(e) => setForm({...form, budget: e.target.value})}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>₹10L</span>
                    <span>₹50Cr</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">Property Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TypeCard icon={<Home />} label="Villa" active={form.type === "Villa"} onClick={() => setForm({...form, type: "Villa"})} />
                    <TypeCard icon={<Building2 />} label="Apartment" active={form.type === "Apartment"} onClick={() => setForm({...form, type: "Apartment"})} />
                    <TypeCard icon={<Mountain />} label="Plot" active={form.type === "Plot"} onClick={() => setForm({...form, type: "Plot"})} />
                    <TypeCard icon={<TreePine />} label="Bungalow" active={form.type === "Bungalow"} onClick={() => setForm({...form, type: "Bungalow"})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">BHK Size</label>
                  <div className="flex flex-wrap gap-3">
                    {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map(b => (
                      <button 
                        key={b}
                        onClick={() => setForm({...form, bhk: b})}
                        className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all ${
                          form.bhk === b ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Review Your Details</h2>
                  <p className="text-sm text-gray-500">Please confirm your information before submitting.</p>
                </div>

                <ReviewSection title="Basic Details" onEdit={() => setStep(1)}>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <ReviewItem label="NAME" value={form.name} />
                    <ReviewItem label="EMAIL" value={form.email} />
                    <ReviewItem label="PHONE" value={form.phone} />
                    <ReviewItem label="AGE" value={form.age + " years"} />
                    <div className="col-span-2">
                      <ReviewItem label="ADDRESS" value={form.address || "Not provided"} />
                    </div>
                  </div>
                </ReviewSection>

                <ReviewSection title="Property Preferences" onEdit={() => setStep(2)}>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <ReviewItem label="BUDGET" value={`₹${form.budget}Cr`} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold mb-1">PROPERTY TYPE</p>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{form.type}</span>
                    </div>
                    <ReviewItem label="BHK SIZE" value={form.bhk} />
                  </div>
                </ReviewSection>
              </div>
            )}
          </div>

          {/* FOOTER NAV */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${step === 1 ? "text-transparent cursor-default" : "text-gray-500 hover:text-gray-800"}`}
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : setIsSubmitted(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              {step === 3 ? "Submit Enquiry" : "Next"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function InputGroup({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
      </div>
    </div>
  );
}

function TypeCard({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
        active ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" : "border-gray-100 text-gray-500 hover:border-gray-200"
      }`}
    >
      <div className="mb-3">{icon}</div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function ReviewSection({ title, children, onEdit }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <button onClick={onEdit} className="text-blue-600 flex items-center gap-1 text-xs font-bold hover:underline">
          <Pencil size={12} /> Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}