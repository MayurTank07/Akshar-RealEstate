import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import useAuth from "../contexts/useAuth";

import propertyData from "../data/pricingProperties.json";
import Navbar from "../components/PricingNavbar";
import { publicApi } from "../services/api";
import { formatINR, parseINRAmount } from "../utils/currency";
import { parsePurchaseRoute } from "../utils/propertyRouting";
import { mergeProperties } from "../utils/propertyData";

export default function PricingPage({ category, type, city: selectedCity, filters }) {
  const { category: routeCategory, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isPropertySaved, toggleSavedProperty } = useAuth();

  const [remoteListings, setRemoteListings] = useState(null);
  const availableTypes = useMemo(() => {
    const types = remoteListings ? [...new Set(remoteListings.map((item) => item.type).filter(Boolean))] : propertyData.propertyTypes;
    return types.length ? types : propertyData.propertyTypes;
  }, [remoteListings]);
  const routeIntent = parsePurchaseRoute(routeCategory, slug);
  const routeFilters = slug ? routeIntent.filters : {};
  const mergedFilters = { ...routeFilters, ...(filters || {}) };
  const listings = remoteListings ? mergeProperties(remoteListings, propertyData.listings, "pricing") : propertyData.listings;
  const initialType = mergedFilters.activeType || (availableTypes.includes(type) ? type : "All");
  const [activeType, setActiveType] = useState(initialType);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(mergedFilters.query || "");
  const [minBeds, setMinBeds] = useState(mergedFilters.minBeds || "Any");
  const [priceRange, setPriceRange] = useState(mergedFilters.priceRange || "Any");
  const [activeCity, setActiveCity] = useState(
    mergedFilters.activeCity ||
    selectedCity ||
    routeIntent.city ||
    "All"
  );
  const [searchType, setSearchType] = useState(
    mergedFilters.searchType ||
    category ||
    routeIntent.category ||
    (routeCategory === "rentals" ? "Rent" : "Buy")
  );
  const filterTypes = ["All", ...availableTypes];

  useEffect(() => {
    publicApi
      .properties()
      .then((response) => {
        if (response.data?.length) setRemoteListings(response.data);
      })
      .catch(() => setRemoteListings(null));
  }, []);

  const parseCrores = (price) => parseINRAmount(price) / 10000000;

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.toLowerCase().replace("properties in", "").trim();

    return listings.filter((item) => {
      const matchesType = activeType === "All" || item.type === activeType;
      const itemCity = item.city || item.location;
      const matchesCity = activeCity === "All" || !activeCity || itemCity.toLowerCase().includes(activeCity.toLowerCase()) || item.location.toLowerCase().includes(activeCity.toLowerCase());
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        String(item.propertyCode || "").toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        String(item.city || "").toLowerCase().includes(normalizedQuery) ||
        item.type.toLowerCase().includes(normalizedQuery) ||
        String(item.ownerName || item.developer || item.builder || "").toLowerCase().includes(normalizedQuery) ||
        String(item.status || item.propertyStatus || "").toLowerCase().includes(normalizedQuery);
      const matchesBeds = minBeds === "Any" || item.beds >= Number(minBeds);
      const price = parseCrores(item.price);
      const matchesPrice =
        priceRange === "Any" ||
        (priceRange === "Under 3 Cr" && price < 3) ||
        (priceRange === "3-6 Cr" && price >= 3 && price <= 6) ||
        (priceRange === "6 Cr+" && price > 6);

      return matchesType && matchesCity && matchesQuery && matchesBeds && matchesPrice;
    });
  }, [activeCity, activeType, listings, minBeds, priceRange, query]);

  const handlePropertyClick = (item) => {
    const dbId = /^[a-f\d]{24}$/i.test(item?._id || "") ? item._id : null;
    navigate(dbId ? `/property/${dbId}` : "/property-detail", { state: { property: item } });
  };

  const handleSaveClick = (item) => {
    const property = { ...item, source: "pricing" };
    const redirectState = {
      filters: {
        activeType,
        activeCity,
        query,
        minBeds,
        priceRange,
        searchType,
      },
    };

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          redirectTo: `${location.pathname}${location.search}`,
          redirectState,
          message: "Please login or register to save properties.",
        },
      });
      return;
    }

    toggleSavedProperty(property);
  };

  const resetFilters = () => {
    setActiveType("All");
    setActiveCity("All");
    setQuery("");
    setMinBeds("Any");
    setPriceRange("Any");
  };

  return (
    <div className="bg-white min-h-screen font-sans">

      <Navbar
        searchType={searchType}
        city={activeCity}
        query={query}
        onCategoryChange={setSearchType}
        onCityChange={setActiveCity}
        onQueryChange={setQuery}
        onToggleFilters={() => setFiltersOpen((current) => !current)}
      />

      <main className="wf-container py-8">

        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 wf-scrollbar-none">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`shrink-0 rounded-full border px-6 py-2 text-sm font-extrabold transition-all ${
                activeType === type
                  ? "bg-[#2563eb] text-white border-[#2563eb]"
                  : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {filtersOpen && (
          <div className="wf-card mb-8 grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
            <FilterSelect label="Minimum Bedrooms" value={minBeds} onChange={setMinBeds} options={["Any", "2", "3", "4"]} />
            <FilterSelect label="Price Range" value={priceRange} onChange={setPriceRange} options={["Any", "Under 3 Cr", "3-6 Cr", "6 Cr+"]} />
            <div className="flex items-end">
              <button type="button" onClick={resetFilters} className="wf-btn wf-btn-secondary w-full">
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
              {activeCity === "All" ? `${searchType} properties` : `${searchType} in ${activeCity}`}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
              {filteredListings.length} Matching Properties
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {activeType === "All" ? "All property types" : activeType}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => {
            const saved = isPropertySaved({ ...item, source: "pricing" });

            return (
            <div
              key={item._id || item.id}
              className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-44"> 
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover" 
                  alt={item.title} 
                />

                <div className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tight`}>
                  {item.badge}
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveClick(item)}
                  className={`absolute top-3 right-3 rounded-full bg-white p-2 shadow-sm transition hover:scale-105 ${
                    saved ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                  }`}
                  aria-label={saved ? "Remove from saved" : "Save property"}
                >
                  <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-md font-bold text-gray-900 mb-0.5">{item.title}</h3>

                <div className="flex items-center text-gray-400 text-[11px] mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {item.location}
                </div>
                <div className="mb-4 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                  {item.type}
                </div>

                <div className="flex justify-start gap-5 text-[11px] text-gray-500 mb-6">
                  <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {item.beds}</div>
                  <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {item.baths}</div>
                    <div className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {item.sqft || item.area} {item.sqft ? "sq.ft" : ""}</div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Price</div>
                <div className="text-lg font-extrabold text-blue-600">
                      {formatINR(item.priceAmount || item.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePropertyClick(item)}
                    className="text-blue-600 text-[12px] font-bold flex items-center gap-1 hover:underline"
                  >
                    Details <span className="text-[14px]">→</span>
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {filteredListings.length === 0 && (
          <div className="wf-card p-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-950">No matching properties found</h2>
            <p className="mt-2 text-slate-500">Try changing the city, property type, or advanced filters.</p>
            <button type="button" onClick={resetFilters} className="wf-btn wf-btn-primary mt-5">
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="wf-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="wf-input">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
