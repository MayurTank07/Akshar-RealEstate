import { useEffect, useMemo, useState } from "react";
import { publicApi } from "../services/api";
import { formatINR } from "../utils/currency";
import { buildInternationalPhone, countryCodeOptions, normalizePhoneDigits } from "../utils/countryCodes";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  Mountain,
  Pencil,
  Phone,
  TreePine,
  User,
} from "lucide-react";

const gujaratLocations = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Bharuch",
  "Vesu, Surat",
  "Bodakdev, Ahmedabad",
  "Alkapuri, Vadodara",
  "Gift City, Gandhinagar",
  "Kalawad Road, Rajkot",
];

const steps = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Review" },
];

export default function PropertyForm({ isModal = false, onSubmitted }) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    age: "",
    location: "",
    budget: 50,
    type: "Apartment",
  });

  const locationOptions = useMemo(() => gujaratLocations, []);

  const getActualBudget = (val) => {
    const value = Number(val);
    if (value <= 20) return formatINR(value * 500000);
    if (value <= 60) return formatINR(((value - 20) * 0.1 + 1) * 10000000);
    return formatINR(((value - 60) * 0.5 + 5) * 10000000);
  };

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "phone" ? normalizePhoneDigits(value) : value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: null }));
    }
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!form.name.trim()) nextErrors.name = "Name is required";
      if (!form.email.match(/\S+@\S+\.\S+/)) nextErrors.email = "Enter a valid email";
      if (form.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid phone number";
      if (!form.location.trim()) nextErrors.location = "Location is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep()) {
      setStep((current) => Math.min(current + 1, 3));
    }
  };

  const submit = async () => {
    const enquiryPayload = {
      ...form,
      phone: buildInternationalPhone(form.countryCode, form.phone),
      location: form.location.trim(),
      preferredLocation: form.location.trim(),
      propertyType: form.type,
      budgetLabel: getActualBudget(form.budget),
    };

    try {
      await publicApi.createEnquiry(enquiryPayload);
      setIsSubmitted(true);
    } catch {
      setErrors({ submit: "We could not submit your enquiry. Please try again." });
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      if (isModal && onSubmitted) {
        onSubmitted();
      } else {
        const timer = setTimeout(() => {
          window.location.href = "/";
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isSubmitted, isModal, onSubmitted]);

  if (isSubmitted) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-slate-50 p-6">
        <div className="wf-card w-full max-w-md p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
            <CheckCircle2 size={38} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">Request Received</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Our relationship manager will contact you shortly with matching Gujarat properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isModal ? "h-full" : "min-h-screen pt-24"} items-center justify-center ${
        isModal ? "bg-transparent" : "bg-slate-50"
      } p-2 font-sans sm:p-6`}
    >
      <div className={`flex w-full flex-col ${isModal ? "h-full max-w-4xl" : "max-w-5xl"}`}>
        <header className="shrink-0 px-7 pb-3 pt-3 text-center sm:pb-4 sm:pt-0">
          <h1 className={`${isModal ? "text-2xl" : "text-3xl"} font-extrabold tracking-tight text-slate-950`}>
            Find Your Home
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Tell us what you need. We will match you with the right Gujarat property.
          </p>
        </header>

        <div className="mx-auto mb-4 grid w-full max-w-2xl grid-cols-3 items-start gap-2 px-3 sm:mb-5">
          {steps.map((item, index) => {
            const complete = step > item.id;
            const active = step === item.id;

            return (
              <div key={item.id} className="relative flex flex-col items-center gap-2">
                {index !== 0 && (
                  <span
                    className={`absolute right-1/2 top-5 h-0.5 w-full ${
                      step > item.id - 1 ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-4 text-sm font-extrabold transition ${
                    complete || active
                      ? "border-blue-100 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {complete ? "✓" : item.id}
                </span>
                <span className={`text-[11px] font-extrabold sm:text-xs ${active || complete ? "text-blue-600" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="wf-card flex min-h-0 grow flex-col overflow-hidden shadow-sm">
          <div className="wf-smooth-scroll min-h-0 grow overflow-y-auto p-4 sm:p-6 lg:p-8">
            {step === 1 && (
              <section className="space-y-5 sm:space-y-6">
                <SectionTitle title="Basic Details" subtitle="Your contact information stays private with Akshar Estate The Property HUB." />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <InputGroup label="Full Name" icon={<User size={18} />} name="name" value={form.name} onChange={update} error={errors.name} placeholder="Raj Sharma" />
                  <InputGroup label="Email Address" icon={<Mail size={18} />} name="email" value={form.email} onChange={update} error={errors.email} placeholder="customer@example.com" />
                  <PhoneInputGroup
                    label="Phone Number"
                    countryCode={form.countryCode}
                    phone={form.phone}
                    onChange={update}
                    error={errors.phone}
                  />
                  <InputGroup label="Age" icon={<Calendar size={18} />} name="age" type="number" value={form.age} onChange={update} placeholder="25" />
                </div>

                <div>
                  <label className="wf-label flex items-center gap-2">
                    <MapPin size={16} />
                    Preferred Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="location"
                      value={form.location}
                      onChange={update}
                      list="gujarat-location-options"
                      placeholder="Type or select Ahmedabad, Surat, Vadodara..."
                      className={`wf-input pl-10 ${errors.location ? "border-red-500" : ""}`}
                    />
                    <datalist id="gujarat-location-options">
                      {locationOptions.map((location) => (
                        <option key={location} value={location} />
                      ))}
                    </datalist>
                  </div>
                  {errors.location && <p className="mt-1 text-xs font-bold text-red-500">{errors.location}</p>}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6 sm:space-y-8">
                <SectionTitle title="Preferences" subtitle="Set the budget and property type for better recommendations." />

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <label className="wf-label mb-1">Budget Range</label>
                      <p className="text-xs text-slate-500">Slide to adjust your maximum budget</p>
                    </div>
                    <span className="inline-flex w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-md">
                      Up to {getActualBudget(form.budget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={form.budget}
                    onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                  <div className="mt-3 flex justify-between text-[10px] font-extrabold uppercase tracking-tight text-slate-400">
                    <span>{formatINR(1000000)}</span>
                    <span>{formatINR(50000000)}</span>
                    <span>{formatINR(250000000)}+</span>
                  </div>
                </div>

                <div>
                  <label className="wf-label">Property Type</label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {["Apartment", "Villa", "Plot", "Bungalow"].map((type) => (
                      <TypeCard
                        key={type}
                        icon={type === "Villa" ? <Home /> : type === "Apartment" ? <Building2 /> : type === "Plot" ? <Mountain /> : <TreePine />}
                        label={type}
                        active={form.type === type}
                        onClick={() => setForm((current) => ({ ...current, type }))}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-5">
                <SectionTitle title="Final Review" subtitle="Confirm your details before submitting the enquiry." />
                <ReviewSection title="Contact Information" onEdit={() => setStep(1)}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ReviewItem label="Name" value={form.name} />
                    <ReviewItem label="Phone" value={`${form.countryCode} ${form.phone}`} />
                    <ReviewItem label="Email" value={form.email} />
                    <ReviewItem label="Location" value={form.location.trim()} />
                  </div>
                </ReviewSection>
                <ReviewSection title="Property Requirements" onEdit={() => setStep(2)}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ReviewItem label="Max Budget" value={getActualBudget(form.budget)} />
                    <ReviewItem label="Type" value={form.type} />
                  </div>
                </ReviewSection>
              </section>
            )}
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
              className={`wf-btn wf-btn-secondary ${step === 1 ? "invisible" : ""}`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button type="button" onClick={step < 3 ? goNext : submit} className="wf-btn wf-btn-primary px-5 sm:px-8">
              {step === 3 ? "Submit Enquiry" : "Next Step"}
              <ChevronRight size={18} />
            </button>
          </footer>
          {errors.submit && <p className="bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{errors.submit}</p>}
        </div>
      </div>
    </div>
  );
}

function PhoneInputGroup({ label, countryCode, phone, onChange, error }) {
  return (
    <div>
      <label className="wf-label flex items-center gap-2">
        <Phone size={16} />
        {label}
      </label>
      <div className={`grid grid-cols-[116px_1fr] overflow-hidden rounded-2xl border bg-white ${error ? "border-red-500" : "border-slate-200"} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100`}>
        <select
          name="countryCode"
          value={countryCode}
          onChange={onChange}
          className="min-h-12 border-0 border-r border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-slate-700 outline-none"
          aria-label="Country code"
        >
          {countryCodeOptions.map((option) => (
            <option key={`${option.label}-${option.value}`} value={option.value}>{option.value}</option>
          ))}
        </select>
        <input
          name="phone"
          value={phone}
          onChange={onChange}
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="9876543210"
          className="min-h-12 border-0 px-4 text-sm font-semibold text-slate-900 outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function InputGroup({ label, icon, error, ...props }) {
  return (
    <div>
      <label className="wf-label">{label}</label>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${error ? "text-red-400" : "text-slate-400"}`}>
          {icon}
        </div>
        <input {...props} className={`wf-input pl-10 ${error ? "border-red-500" : ""}`} />
      </div>
      {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
}

function TypeCard({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border p-4 transition-all sm:min-h-28 ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-600 shadow-inner"
          : "border-slate-200 text-slate-400 hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      <div className={`mb-2 transition-transform ${active ? "scale-110" : ""}`}>{icon}</div>
      <span className="text-xs font-extrabold">{label}</span>
    </button>
  );
}

function ReviewSection({ title, children, onEdit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{title}</h3>
        <button type="button" onClick={onEdit} className="flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700">
          <Pencil size={12} />
          Change
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="break-words text-sm font-extrabold text-slate-800">{value || "—"}</p>
    </div>
  );
}
