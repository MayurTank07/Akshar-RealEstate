import { ArrowRight, Building2, CheckCircle2, Home, KeyRound, Landmark, ListChecks, SearchCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  {
    title: "Property for Rent",
    description: "Curated rental homes and commercial spaces with location checks, owner coordination, and requirement follow-up.",
    icon: KeyRound,
  },
  {
    title: "Property for Sale",
    description: "Verified residential and commercial sale opportunities across Gujarat with clear pricing guidance.",
    icon: Home,
  },
  {
    title: "Pre-Leased Properties",
    description: "Income-ready assets for investors looking for stable rentals, tenant visibility, and long-term value.",
    icon: Landmark,
  },
  {
    title: "Property Acquisition",
    description: "Requirement mapping, locality shortlisting, due diligence coordination, and negotiation support.",
    icon: SearchCheck,
  },
  {
    title: "Property Listings",
    description: "Professional listing support for owners, including positioning, buyer matching, and enquiry tracking.",
    icon: ListChecks,
  },
  {
    title: "Commercial & Residential Assistance",
    description: "End-to-end advisory for homes, offices, shops, showrooms, plots, and investment properties.",
    icon: Building2,
  },
];

const steps = ["Requirement discovery", "Verified shortlist", "Requirement coordination", "Negotiation support", "Closure assistance"];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-slate-950 pt-32 text-white sm:pt-36">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1800"
            alt="Premium real estate advisory"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-950/70" />
          <div className="wf-container relative z-10 pb-20">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-blue-100 backdrop-blur">
              Real Estate Services
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Focused property services for serious buyers, owners, and investors.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              We keep the process clean: verified options, practical advice, fast coordination, and long-term real estate value.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate("/pricing", { state: { category: "Buy", city: "Ahmedabad", filters: { activeCity: "Ahmedabad", activeType: "All", query: "", searchType: "Buy" } } })} className="wf-btn wf-btn-primary sm:px-6">
                Explore Properties
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/enquiry")} className="wf-btn border border-white/20 bg-white/10 text-white hover:bg-white/15 sm:px-6">
                Request Assistance
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="wf-container">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">What we do</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Real estate services, without unnecessary noise.</h2>
              <p className="mt-3 text-slate-600">Every service is built around property discovery, listing quality, communication, and conversion.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map(({ title, description, icon: Icon }) => (
                <article key={title} className="wf-card wf-card-hover group p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="wf-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Process</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">A sharper way to move from enquiry to closure.</h2>
              <p className="mt-4 text-slate-600">Our service flow is designed for clarity, speed, and trust at every decision point.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <div className="grid gap-3">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-sm font-extrabold text-white">{index + 1}</span>
                    <span className="font-bold text-slate-800">{step}</span>
                    <CheckCircle2 className="ml-auto text-emerald-500" size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
