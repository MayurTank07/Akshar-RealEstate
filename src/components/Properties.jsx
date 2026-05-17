import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import useAuth from "../contexts/useAuth";
import fallbackProperties from "../data/properties.json";
import { publicApi } from "../services/api";
import { mergeProperties } from "../utils/propertyData";

export default function Properties() {
  const [properties, setProperties] = useState(fallbackProperties);

  useEffect(() => {
    publicApi
      .properties()
      .then((response) => {
        if (response.data?.length) {
          setProperties(mergeProperties(response.data, fallbackProperties, "home"));
        }
      })
      .catch(() => setProperties(fallbackProperties));
  }, []);

  const sections = [
    {
      title: "Recently Added",
      eyebrow: "New in Gujarat",
      description: "Fresh listings added for active buyers this week.",
      items: properties.filter((property) => property.tag === "New"),
    },
    {
      title: "Featured Properties",
      eyebrow: "Curated picks",
      description: "Premium homes selected for location, finish, and buyer interest.",
      items: properties.filter((property) => property.tag === "Featured"),
    },
    {
      title: "Popular Properties",
      eyebrow: "High demand",
      description: "Homes getting strong attention across Akshar Estate The Property HUB searches.",
      items: properties.filter((property) => property.tag === "Hot"),
    },
  ];

  return (
    <section id="properties" className="overflow-hidden bg-slate-50 py-12 sm:py-16">
      <div className="wf-container">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">
              Featured Collection
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              Available Residences
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Browse curated Gujarat properties by freshness, editorial selection, and buyer demand.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-600 transition hover:text-blue-700"
          >
            View all listings
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <PropertyRail key={section.title} section={section} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/properties" className="wf-btn wf-btn-primary w-full sm:w-auto sm:px-8">
            View All Properties
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PropertyRail({ section }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
            {section.eyebrow}
          </p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-950">
            {section.title}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
            {section.description}
          </p>
        </div>
        <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200 sm:inline-flex">
          {section.items.length} homes
        </span>
      </div>

      <div className="wf-scrollbar-none flex snap-x gap-4 overflow-x-auto pb-4 sm:gap-5">
        {section.items.map((property) => (
          <PropertyCard key={property._id || property.id} property={property} />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ property }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isPropertySaved, toggleSavedProperty } = useAuth();
  const savedProperty = { ...property, source: "home" };
  const saved = isPropertySaved(savedProperty);

  const handleSaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          redirectTo: `${location.pathname}${location.search}`,
          message: "Please login or register to save properties.",
        },
      });
      return;
    }

    toggleSavedProperty(savedProperty);
  };

  return (
    <Link
      to={`/property/${property._id || property.id}`}
      state={{ property }}
      className="wf-card wf-card-hover group min-w-[84vw] snap-start overflow-hidden sm:min-w-[360px] lg:min-w-[390px]"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-60">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold text-white shadow-lg ${
            property.tag === "Featured"
              ? "bg-blue-600"
              : property.tag === "New"
              ? "bg-emerald-500"
              : "bg-orange-500"
          }`}
        >
          {property.tag === "Hot" ? "Popular" : property.tag}
        </span>

        <button
          type="button"
          onClick={handleSaveClick}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-lg transition hover:scale-105 ${
            saved ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-5">
        <h4 className="line-clamp-1 text-xl font-extrabold text-slate-950">
          {property.title}
        </h4>

        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
          <MapPin size={16} className="text-blue-600" />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} />
            {property.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={16} />
            {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 size={16} />
            <span className="line-clamp-1">{property.area || `${property.sqft} sq.ft`}</span>
          </span>
        </div>

        <div className="my-4 h-px bg-slate-200" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">Price</p>
            <p className="text-xl font-extrabold text-blue-600">
            {property.price}
            </p>
          </div>

          <span className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-600">
            Details
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
