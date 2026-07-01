import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import useAuth from "../contexts/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatINR } from "../utils/currency";

export default function SavedProperties() {
  const navigate = useNavigate();
  const { isAuthenticated, savedProperties, toggleSavedProperty } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="wf-container flex min-h-[70vh] items-center justify-center pt-28">
          <div className="wf-card max-w-lg p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-600">
              <Heart size={26} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950">Login to View Saved Properties</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Create an account or sign in to save Gujarat properties and revisit them anytime.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate("/login", { state: { redirectTo: "/saved" } })}
                className="wf-btn wf-btn-primary"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register", { state: { redirectTo: "/saved" } })}
                className="wf-btn wf-btn-secondary"
              >
                Register
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="wf-container pt-28 pb-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-extrabold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">
              Saved
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              Saved Properties
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Your shortlisted Akshar Estate The Property HUB homes and investment options.
            </p>
          </div>
          <Link to="/pricing" className="wf-btn wf-btn-secondary w-fit">
            Browse More
            <ArrowRight size={17} />
          </Link>
        </div>

        {savedProperties.length === 0 ? (
          <div className="wf-card p-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-950">No saved properties yet</h2>
            <p className="mt-2 text-slate-500">Tap the heart on any property card to add it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedProperties.map((property) => (
              <SavedPropertyCard key={`${property.source}-${property._id || property.id}`} property={property} onUnsave={toggleSavedProperty} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function SavedPropertyCard({ property, onUnsave }) {
  const navigate = useNavigate();
  const detailsPath = property.source === "pricing" ? "/property-detail" : `/property/${property._id || property.id}`;
  const area = property.sqft ? `${property.sqft} sq.ft` : property.area;
  const price = formatINR(property.priceAmount || property.price);
  const openDetails = () => navigate(detailsPath, { state: { property } });
  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  };
  const removeSaved = (event) => {
    event?.stopPropagation();
    onUnsave(property);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${property.title}`}
      className="wf-card wf-card-hover group cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img src={property.image} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">
          {property.badge || property.tag || "Saved"}
        </span>
        <button
          type="button"
          onClick={removeSaved}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-rose-500 shadow-lg transition duration-200 hover:scale-105 hover:bg-rose-50"
          aria-label="Unsave property"
          title="Unsave property"
        >
          <Heart size={18} fill="currentColor" />
        </button>
      </div>

      <div className="p-5">
        <h2 className="line-clamp-1 text-xl font-extrabold text-slate-950">{property.title}</h2>
        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
          <MapPin size={16} className="text-blue-600" />
          <span className="line-clamp-1">{property.location}</span>
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><BedDouble size={16} />{property.beds}</span>
          <span className="flex items-center gap-1.5"><Bath size={16} />{property.baths}</span>
          <span className="flex items-center gap-1.5"><Maximize2 size={16} /><span className="line-clamp-1">{area}</span></span>
        </div>
        <div className="my-4 h-px bg-slate-200" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">Price</p>
            <p className="text-xl font-extrabold text-blue-600">{price}</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openDetails();
            }}
            className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-600"
          >
            Details
            <ArrowRight size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={removeSaved}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-extrabold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100"
        >
          <Heart size={16} fill="currentColor" />
          Unsave
        </button>
      </div>
    </article>
  );
}
