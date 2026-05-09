import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Calendar, MapPin, Home, 
  Building2, Mountain, TreePine, ChevronRight, 
  ChevronLeft, Pencil, CheckCircle2, Search
} from "lucide-react";
// Note: You'll need to install this: npm install react-google-places-autocomplete
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export default function PropertyForm({ isModal = false, onSubmitted }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Initialized with empty values
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    address: null, // For Google Place Object
    budget: 50,    // Slider value (0-100)
    type: "Apartment",
  });

  // 2. Realistic Budget Logic (Maps 0-100 slider to actual currency)
  const getActualBudget = (val) => {
    if (val <= 20) return `₹${val * 5}L`; // 0 to 100L
    if (val <= 60) return `₹${((val - 20) * 0.1 + 1).toFixed(1)}Cr`; // 1Cr to 5Cr
    return `₹${((val - 60) * 0.5 + 5).toFixed(1)}Cr`; // 5Cr to 25Cr
  };

  // 3. Validation Logic
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.match(/\S+@\S+\.\S+/)) newErrors.email = "Invalid email";
      if (form.phone.length < 10) newErrors.phone = "Invalid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  useEffect(() => {
    if (isSubmitted) {
      if (isModal && onSubmitted) {
        onSubmitted();
      } else {
        const timer = setTimeout(() => { window.location.href = "/"; }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isSubmitted, isModal, onSubmitted]);

  const steps = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Preferences" },
    { id: 3, label: "Review" },
  ];

  if (isSubmitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100 animate-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Request Received!</h2>
          <p className="text-slate-600">Our relationship manager will contact you shortly.</p>
          <div className="mt-8 space-y-3">
             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-[progress_5s_linear]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? "h-full" : "h-screen"} flex items-center justify-center ${isModal ? "bg-transparent" : "bg-gray-50"} p-4 font-sans overflow-hidden`}>
      <div className={`w-full ${isModal ? "max-w-3xl" : "max-w-4xl"} flex flex-col ${isModal ? "h-full" : "h-full"} max-h-[${isModal ? "750px" : "850px"}]`}>
        
        <div className={`text-center ${isModal ? "mb-4" : "mb-6"} shrink-0`}>
          <h1 className={`${isModal ? "text-2xl" : "text-3xl"} font-bold text-gray-800 tracking-tight`}>Find Your Home</h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in the details to get personalized matches</p>
        </div>

        {/* Stepper */}
        <div className={`relative flex justify-between ${isModal ? "mb-6" : "mb-8"} max-w-xl mx-auto w-full shrink-0`}>
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
          <div className={`absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-0`} style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${step >= s.id ? "bg-blue-600 border-blue-100 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span className={`text-xs mt-2 font-bold ${step >= s.id ? "text-blue-600" : "text-gray-400"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col grow">
          <div className={`${isModal ? "p-6" : "p-8"} overflow-y-auto grow`}>
            
            {/* STEP 1: BASIC DETAILS */}
            {step === 1 && (
              <div className={`${isModal ? "space-y-4" : "space-y-6"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <header><h2 className={`${isModal ? "text-lg" : "text-xl"} font-bold text-gray-800`}>Basic Details</h2></header>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isModal ? "gap-4" : "gap-6"}`}>
                  <InputGroup label="Full Name" icon={<User size={18}/>} name="name" value={form.name} onChange={update} error={errors.name} placeholder="e.g. John Doe" />
                  <InputGroup label="Email Address" icon={<Mail size={18}/>} name="email" value={form.email} onChange={update} error={errors.email} placeholder="john@example.com" />
                  <InputGroup label="Phone Number" icon={<Phone size={18}/>} name="phone" value={form.phone} onChange={update} error={errors.phone} placeholder="+91 XXXXX XXXXX" />
                  <InputGroup label="Age" icon={<Calendar size={18}/>} name="age" type="number" value={form.age} onChange={update} placeholder="e.g. 28" />
                </div>

                {/* Google Places Autocomplete Integration */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><MapPin size={16}/> Preferred Location</label>
                  <GooglePlacesAutocomplete
                    apiKey="AIzaSyB3EmQ83cY3ehesemJ0tg02Xoi_HWqNXNk"
                    selectProps={{
                      value: form.address,
                      onChange: (val) => setForm({...form, address: val}),
                      placeholder: "Search locality, city or project...",
                      className: "text-sm",
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PREFERENCES */}
            {step === 2 && (
              <div className={`${isModal ? "space-y-6" : "space-y-10"} animate-in fade-in slide-in-from-right-4 duration-500`}>
                <header><h2 className={`${isModal ? "text-lg" : "text-xl"} font-bold text-gray-800`}>What are you looking for?</h2></header>
                
                <div className={`${isModal ? "space-y-4" : "space-y-6"}`}>
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Budget Range</label>
                      <p className="text-xs text-gray-400">Slide to adjust your maximum budget</p>
                    </div>
                    <span className={`${isModal ? "px-3 py-1 text-base" : "px-4 py-1.5 text-lg"} bg-blue-600 text-white rounded-lg font-bold shadow-md`}>
                      Up to {getActualBudget(form.budget)}
                    </span>
                  </div>
                  <input 
                    type="range" min="2" max="100" value={form.budget} 
                    onChange={(e) => setForm({...form, budget: e.target.value})}
                    className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span>₹10 Lakhs</span>
                    <span>₹5 Crores</span>
                    <span>₹25 Crores+</span>
                  </div>
                </div>

                <div className={`${isModal ? "space-y-3" : "space-y-4"}`}>
                  <label className="text-sm font-semibold text-gray-700">Property Type</label>
                  <div className={`grid grid-cols-2 md:grid-cols-4 ${isModal ? "gap-3" : "gap-4"}`}>
                    {['Apartment', 'Villa', 'Plot', 'Bungalow'].map((t) => (
                      <TypeCard 
                        key={t}
                        icon={t === 'Villa' ? <Home /> : t === 'Apartment' ? <Building2 /> : t === 'Plot' ? <Mountain /> : <TreePine />} 
                        label={t} 
                        active={form.type === t} 
                        onClick={() => setForm({...form, type: t})} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <div className={`${isModal ? "space-y-4" : "space-y-6"} animate-in fade-in slide-in-from-right-4 duration-500`}>
                <h2 className={`${isModal ? "text-lg" : "text-xl"} font-bold text-gray-800`}>Final Review</h2>
                <div className={`${isModal ? "gap-3" : "gap-4"} grid`}>
                  <ReviewSection title="Contact Information" onEdit={() => setStep(1)}>
                    <div className={`grid grid-cols-2 ${isModal ? "gap-3" : "gap-4"}`}>
                      <ReviewItem label="NAME" value={form.name} />
                      <ReviewItem label="PHONE" value={form.phone} />
                      <div className="col-span-2 border-t pt-2"><ReviewItem label="LOCATION" value={form.address?.label || "Not specified"} /></div>
                    </div>
                  </ReviewSection>
                  <ReviewSection title="Property Requirements" onEdit={() => setStep(2)}>
                    <div className={`grid grid-cols-2 ${isModal ? "gap-3" : "gap-4"}`}>
                      <ReviewItem label="MAX BUDGET" value={getActualBudget(form.budget)} />
                      <ReviewItem label="TYPE" value={form.type} />
                    </div>
                  </ReviewSection>
                </div>
              </div>
            )}
          </div>

          {/* Footer Nav */}
          <div className={`bg-gray-50 ${isModal ? "px-6 py-4" : "px-8 py-5"} flex justify-between items-center border-t border-gray-100 shrink-0`}>
            <button onClick={() => setStep(step - 1)} className={`flex items-center gap-2 text-sm font-bold transition-colors ${step === 1 ? "invisible" : "text-gray-500 hover:text-gray-800"}`}>
              <ChevronLeft size={18} /> Back
            </button>
            <button 
              onClick={step < 3 ? handleNext : () => setIsSubmitted(true)}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${isModal ? "px-6 py-2" : "px-8 py-2.5"} rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95`}
            >
              {step === 3 ? "Submit Enquiry" : "Next Step"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InputGroup({ label, icon, error, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${error ? "text-red-400" : "text-gray-400"}`}>{icon}</div>
        <input {...props} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 outline-none transition-all ${error ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`} />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>}
    </div>
  );
}

function TypeCard({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${active ? "border-blue-600 bg-blue-50 text-blue-600 shadow-inner" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}>
      <div className={`mb-2 transition-transform ${active ? "scale-110" : ""}`}>{icon}</div>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function ReviewSection({ title, children, onEdit }) {
  return (
    <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 relative group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">{title}</h3>
        <button onClick={onEdit} className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline"><Pencil size={10} /> CHANGE</button>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="text-[9px] text-gray-400 font-bold mb-0.5 uppercase tracking-tighter">{label}</p>
      <p className="font-bold text-gray-800 text-sm">{value || "—"}</p>
    </div>
  );
}