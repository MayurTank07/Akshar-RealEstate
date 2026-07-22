import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import IndianMoneyInput from "../components/IndianMoneyInput";
import useAuth from "../contexts/useAuth";

import Navbar from "../components/PricingNavbar";
import { publicApi } from "../services/api";
import { formatINR, parseINRAmount } from "../utils/currency";
import { parsePurchaseRoute } from "../utils/propertyRouting";
import { normalizeProperty } from "../utils/propertyData";
import { collectOptions, groupSearchResults, matchesAdvancedFilters, matchesPropertySearch, rankedPropertySearch, sortProperties } from "../utils/propertySearch";
import { THUMBNAIL_IMAGE_FALLBACK, propertyImageAlt, propertyImageUrl, responsiveImageProps } from "../utils/imageSeo";
import { trackAnalyticsEvent } from "../utils/analytics";

const emptyFilters = {
  areaWise: "",
  propertyType: "",
  propertyCategory: "",
  minPrice: "",
  maxPrice: "",
};

const emptyPublicOptions = {};

function optionValues(options = {}) {
  return Object.fromEntries(
    Object.entries(options || {}).map(([group, items]) => [
      group,
      (Array.isArray(items) ? items : [])
        .map((item) => (typeof item === "object" ? item.value || item.label : item))
        .filter(Boolean),
    ])
  );
}

function uniqueSorted(...groups) {
  return [...new Set(groups.flat().filter(Boolean).map(String))].sort((a, b) => a.localeCompare(b));
}

function propertyDealText(property = {}) {
  return [
    property.dealType,
    property.category,
    property.propertyStatus,
    property.availability,
    property.constructionStatus,
    property.possessionStatus,
    property.isPreLeased ? "pre leased roi investment sale" : "",
    property.isBarter ? "barter" : "",
    Array.isArray(property.propertyTags) ? property.propertyTags.join(" ") : "",
  ].filter(Boolean).join(" ").toLowerCase();
}

function queryDealMode(query, searchType) {
  const text = String(query || "").toLowerCase();
  if (/\b(rent|rental|lease)\b/.test(text)) return "rent";
  if (/\b(buy|sale|sell|resale|new launch|pre leased|pre-leased|roi|investment)\b/.test(text)) return "buy";
  return String(searchType || "").toLowerCase().includes("rent") ? "rent" : "buy";
}

function matchesDealMode(property, mode, query) {
  const dealText = propertyDealText(property);
  if (!dealText) return mode !== "rent";
  if (mode === "rent") return /\b(rent|rental|lease|rented)\b/.test(dealText);
  if (/\b(rent|rental|lease|rented)\b/.test(dealText) && !/\b(sale|sell|buy|resale|new launch|pre leased|pre-leased|roi|investment)\b/.test(dealText)) {
    return /\b(rent|rental|lease)\b/.test(String(query || "").toLowerCase());
  }
  return true;
}

function safeSearchQuery(value = "") {
  return String(value || "")
    .replace(/\S+@\S+\.\S+/g, "[email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export default function PricingPage({ category, type, city: selectedCity, filters }) {
  const { category: routeCategory, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isPropertySaved, toggleSavedProperty } = useAuth();

  const [remoteListings, setRemoteListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [publicOptions, setPublicOptions] = useState(emptyPublicOptions);
  const routeIntent = parsePurchaseRoute(routeCategory, slug);
  const routeFilters = slug ? routeIntent.filters : {};
  const mergedFilters = { ...routeFilters, ...(filters || {}) };
  const listings = useMemo(() => remoteListings.map((property) => normalizeProperty(property, "pricing")), [remoteListings]);
  const masterOptions = useMemo(() => optionValues(publicOptions), [publicOptions]);
  const availableTypes = useMemo(
    () => uniqueSorted(collectOptions(listings, "type"), masterOptions.propertyTypes),
    [listings, masterOptions.propertyTypes]
  );
  const initialType = mergedFilters.activeType || type || "All";
  const [activeType, setActiveType] = useState(initialType);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(mergedFilters.query || "");
  const [priceRange, setPriceRange] = useState(mergedFilters.priceRange || "Any");
  const [advancedFilters, setAdvancedFilters] = useState({ ...emptyFilters, ...(mergedFilters.advancedFilters || {}) });
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
  const trackingReady = useRef(false);
  const lastTrackedSearch = useRef("");
  const lastTrackedLocation = useRef(activeCity);
  const lastTrackedFilter = useRef("");
  const filterTypes = ["All", ...availableTypes];
  const dynamicOptions = useMemo(() => ({
    areaWise: uniqueSorted(collectOptions(listings, "areaWise"), masterOptions.locations),
    propertyType: uniqueSorted(availableTypes, masterOptions.propertyTypes),
    propertyCategory: uniqueSorted(collectOptions(listings, "category"), masterOptions.category, ["New Projects"]),
    bhk: uniqueSorted(collectOptions(listings, "beds"), masterOptions.bhk).filter((item) => Number(item) >= 0).sort((a, b) => Number(a) - Number(b)),
  }), [availableTypes, listings, masterOptions]);

  const updateAdvancedFilter = (key, value) => setAdvancedFilters((current) => ({ ...current, [key]: value }));
  const hasFilters = activeType !== "All" || activeCity !== "All" || query || priceRange !== "Any" || Object.values(advancedFilters).some(Boolean);
  const newProjectOnly = searchType === "New Projects";

  useEffect(() => {
    let active = true;
    publicApi
      .properties({ limit: 100, sort: "createdAt", order: "desc" })
      .then((response) => {
        if (!active) return;
        setRemoteListings(response.data || []);
        setListingsError("");
      })
      .catch((err) => {
        if (!active) return;
        setRemoteListings([]);
        setListingsError(err.message || "Unable to load live properties.");
      })
      .finally(() => {
        if (active) setListingsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    publicApi
      .propertyOptions()
      .then((response) => setPublicOptions(response.data || emptyPublicOptions))
      .catch(() => setPublicOptions(emptyPublicOptions));
  }, []);

  useEffect(() => {
    if (!filtersOpen || window.matchMedia("(min-width: 1024px)").matches) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);

  const parseCrores = (price) => parseINRAmount(price) / 10000000;

  const rankedItems = useMemo(() => {
    const normalizedQuery = query
      .toLowerCase()
      .replace(/\b(properties?|flats?|homes?)\s+(for\s+)?(sale|rent|buy|lease)\s+in\b/g, "")
      .replace(/\b(for\s+)?(sale|rent|buy|lease)\s+in\b/g, "")
      .replace(/\bproperties\s+in\b/g, "")
      .trim();
    const dealMode = queryDealMode(query, searchType);

    const nextListings = listings.filter((item) => {
      const matchesType = activeType === "All" || String(item.type || "").toLowerCase() === String(activeType || "").toLowerCase();
      const itemCity = String(item.city || item.location || "");
      const itemLocation = String(item.location || "");
      const matchesCity = activeCity === "All" || !activeCity || itemCity.toLowerCase().includes(activeCity.toLowerCase()) || itemLocation.toLowerCase().includes(activeCity.toLowerCase());
      const matchesDealType = newProjectOnly || matchesDealMode(item, dealMode, query);
      const matchesNewProject = !newProjectOnly || Boolean(item.isNewProject);
      const matchesQuery = query.trim() ? true : matchesPropertySearch(item, normalizedQuery);
      const price = parseCrores(item.price);
      const matchesPrice =
        priceRange === "Any" ||
        priceRange.startsWith("Up to ") ||
        (priceRange === "Under 50 Lakh" && price < 0.5) ||
        (priceRange === "50 Lakh - 1 Cr" && price >= 0.5 && price <= 1) ||
        (priceRange === "1 Cr+" && price >= 1) ||
        (priceRange === "1 Cr - 3 Cr" && price >= 1 && price <= 3) ||
        (priceRange === "3 Cr+" && price > 3) ||
        (priceRange === "Under 3 Cr" && price < 3) ||
        (priceRange === "3-6 Cr" && price >= 3 && price <= 6) ||
        (priceRange === "6 Cr+" && price > 6);
      const matchesAdvanced = matchesAdvancedFilters(item, advancedFilters);

      return matchesType && matchesCity && matchesDealType && matchesNewProject && matchesQuery && matchesPrice && matchesAdvanced;
    });
    if (query.trim()) return rankedPropertySearch(nextListings, query);
    return sortProperties(nextListings, "latest").map((p, i) => ({ property: p, rank: 0, index: i }));
  }, [activeCity, activeType, advancedFilters, listings, newProjectOnly, priceRange, query, searchType]);

  const filteredListings = useMemo(() => rankedItems.map((r) => r.property), [rankedItems]);
  const groupedResults = useMemo(() => (query.trim() ? groupSearchResults(rankedItems, query) : null), [rankedItems, query]);

  useEffect(() => {
    trackingReady.current = true;
  }, []);

  useEffect(() => {
    if (!trackingReady.current || !query.trim()) return undefined;
    const safeQuery = safeSearchQuery(query);
    if (!safeQuery || safeQuery === lastTrackedSearch.current) return undefined;
    const timer = window.setTimeout(() => {
      lastTrackedSearch.current = safeQuery;
      trackAnalyticsEvent("search_performed", {
        location: activeCity === "All" ? "" : activeCity,
        propertyType: activeType === "All" ? "" : activeType,
        listingType: searchType,
        metadata: { query: safeQuery, searchType, resultCount: filteredListings.length },
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [activeCity, activeType, filteredListings.length, query, searchType]);

  useEffect(() => {
    if (!trackingReady.current || activeCity === lastTrackedLocation.current) return;
    lastTrackedLocation.current = activeCity;
    if (activeCity && activeCity !== "All") {
      trackAnalyticsEvent("location_selected", {
        location: activeCity,
        listingType: searchType,
        metadata: { resultCount: filteredListings.length },
      });
    }
  }, [activeCity, filteredListings.length, searchType]);

  useEffect(() => {
    if (!trackingReady.current) return;
    const activeFilters = {
      activeType,
      priceRange,
      areaWise: advancedFilters.areaWise,
      propertyType: advancedFilters.propertyType,
      propertyCategory: advancedFilters.propertyCategory,
      minPrice: advancedFilters.minPrice ? "set" : "",
      maxPrice: advancedFilters.maxPrice ? "set" : "",
    };
    const signature = JSON.stringify(activeFilters);
    if (signature === lastTrackedFilter.current) return;
    lastTrackedFilter.current = signature;
    const changed = Object.entries(activeFilters).find(([, value]) => value && value !== "All" && value !== "Any");
    if (!changed) return;
    trackAnalyticsEvent("filter_applied", {
      location: activeCity === "All" ? "" : activeCity,
      propertyType: activeType === "All" ? advancedFilters.propertyType : activeType,
      listingType: searchType,
      metadata: { filterName: changed[0], filterValue: changed[1], resultCount: filteredListings.length },
    });
  }, [activeCity, activeType, advancedFilters, filteredListings.length, priceRange, searchType]);

  const handlePropertyClick = (item) => {
    const dbId = /^[a-f\d]{24}$/i.test(item?._id || "") ? item._id : null;
    const routeKey = item?.slug || dbId;
    navigate(routeKey ? `/property/${routeKey}` : "/properties", { state: { property: item } });
  };

  const handleSaveClick = (item) => {
    const property = { ...item, source: "pricing" };
    const redirectState = {
      filters: {
        activeType,
        activeCity,
        query,
        priceRange,
        searchType,
        advancedFilters,
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
    setPriceRange("Any");
    setAdvancedFilters(emptyFilters);
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
        properties={listings}
      />

      <main className="wf-container py-8 xl:w-[calc(100%-3rem)] xl:max-w-[96rem]">

        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 wf-scrollbar-none">
          <button
            onClick={() => {
              setActiveType("All");
              setActiveCity("All");
            }}
            className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-6 py-2 text-sm font-extrabold text-blue-700 transition hover:bg-blue-100"
            type="button"
          >
            View All Properties
          </button>
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

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between xl:hidden">
          <p className="text-sm font-extrabold text-slate-700">
            {filteredListings.length} Properties Found
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setFiltersOpen(true)} className="wf-btn wf-btn-secondary flex-1 sm:flex-none">
              <SlidersHorizontal size={16} /> Advanced Filters
            </button>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="wf-btn wf-btn-secondary flex-1 sm:flex-none">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="xl:hidden">
          <FilterPanel
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            filters={advancedFilters}
            updateFilter={updateAdvancedFilter}
            options={dynamicOptions}
            resetFilters={resetFilters}
          />
        </div>

        <div className="xl:hidden">
          <PropertyResults
            activeCity={activeCity}
            activeType={activeType}
            filteredListings={filteredListings}
            groupedResults={groupedResults}
            loading={listingsLoading}
            error={listingsError}
            query={query}
            handlePropertyClick={handlePropertyClick}
            handleSaveClick={handleSaveClick}
            isPropertySaved={isPropertySaved}
            resetFilters={resetFilters}
            searchType={searchType}
          />
        </div>

        <div className="hidden items-start gap-7 xl:grid xl:grid-cols-[300px_minmax(0,1fr)]">
          <DesktopFilterSidebar
            filters={advancedFilters}
            hasFilters={hasFilters}
            options={dynamicOptions}
            priceRange={priceRange}
            query={query}
            resetFilters={resetFilters}
            setPriceRange={setPriceRange}
            updateFilter={updateAdvancedFilter}
            updateQuery={setQuery}
          />
          <div className="min-w-0">
            <PropertyResults
              activeCity={activeCity}
              activeType={activeType}
              desktop
              filteredListings={filteredListings}
              groupedResults={groupedResults}
              loading={listingsLoading}
              error={listingsError}
              query={query}
              handlePropertyClick={handlePropertyClick}
              handleSaveClick={handleSaveClick}
              isPropertySaved={isPropertySaved}
              resetFilters={resetFilters}
              searchType={searchType}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DesktopFilterSidebar({ filters, hasFilters, options, priceRange, query, resetFilters, setPriceRange, updateFilter, updateQuery }) {
  const minPrice = Number(filters.minPrice || 0);
  const maxPrice = Number(filters.maxPrice || 0);
  const updatePrice = (key, value, { keepPreset = false } = {}) => {
    updateFilter(key, value ? String(Math.max(0, Number(value))) : "");
    if (!keepPreset) setPriceRange("Any");
  };

  return (
    <div className="sticky top-24">
      <aside className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">Refine results</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-950">Filters</h2>
            </div>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="text-xs font-extrabold text-blue-600 transition hover:text-blue-800">
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-5">
          <label className="block">
            <span className="wf-label">Search properties</span>
            <input
              className="wf-input"
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Area, project, builder..."
            />
          </label>

          <FilterSection title="Location">
            <FilterSelect label="Area / Location" value={filters.areaWise} onChange={(value) => updateFilter("areaWise", value)} options={["", ...options.areaWise]} />
          </FilterSection>

          <FilterSection title="Property">
            <div className="space-y-4">
              <FilterSelect label="Property type" value={filters.propertyType} onChange={(value) => updateFilter("propertyType", value)} options={["", ...(options.propertyType || [])]} />
              <FilterSelect label="Property category" value={filters.propertyCategory} onChange={(value) => updateFilter("propertyCategory", value)} options={["", ...options.propertyCategory]} />
            </div>
          </FilterSection>

          <FilterSection title="Budget">
            <PriceRangeControl
              compact
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinChange={(value, priceOptions) => updatePrice("minPrice", value, priceOptions)}
              onMaxChange={(value, priceOptions) => updatePrice("maxPrice", value, priceOptions)}
            />
          </FilterSection>

          <button type="button" onClick={resetFilters} className="wf-btn wf-btn-secondary w-full">
            Clear Filters
          </button>
        </div>
      </aside>
    </div>
  );
}

function FilterSection({ children, title }) {
  return (
    <section className="border-t border-slate-200 pt-5">
      <h3 className="mb-4 text-sm font-extrabold text-slate-950">{title}</h3>
      {children}
    </section>
  );
}

function PropertyResults({ activeCity, activeType, desktop = false, filteredListings, groupedResults, loading = false, error = "", query, handlePropertyClick, handleSaveClick, isPropertySaved, resetFilters, searchType }) {
  const hasQuery = Boolean(query?.trim());
  const newProjectMode = searchType === "New Projects";

  function renderCard(item) {
    const saved = isPropertySaved({ ...item, source: "pricing" });
    const badgeLabel = item.isNewProject ? "New Project" : item.badge;
    const badgeColor = item.isNewProject ? "bg-blue-600" : item.badgeColor;
    const openDetails = () => handlePropertyClick(item);
    const handleCardKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetails();
      }
    };
    return (
      <article
        key={item._id || item.id}
        role="link"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={handleCardKeyDown}
        aria-label={`View details for ${item.title}`}
        className="cursor-pointer overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 xl:flex xl:h-full xl:flex-col"
      >
        <div className="relative h-44 shrink-0">
          <img
            {...responsiveImageProps(propertyImageUrl(item, 0, THUMBNAIL_IMAGE_FALLBACK), {
              alt: propertyImageAlt(item, 0),
              width: 720,
              height: 520,
              widths: [360, 520, 720],
              sizes: desktop ? "(min-width: 1536px) 320px, 50vw" : "(max-width: 768px) 100vw, 33vw",
              className: "h-full w-full object-cover",
            })}
          />
          <div className={`absolute left-3 top-3 ${badgeColor} rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight text-white`}>{badgeLabel}</div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleSaveClick(item);
            }}
            className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition hover:scale-105 ${saved ? "text-rose-500" : "text-gray-500 hover:text-rose-500"}`}
            aria-label={saved ? "Remove from saved" : "Save property"}
          >
            <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="p-5 xl:flex xl:flex-1 xl:flex-col">
          <h3 className="mb-0.5 text-md font-bold text-gray-900 xl:line-clamp-2">{item.title}</h3>
          <div className="mb-4 flex items-center text-[11px] text-gray-400"><MapPin className="mr-1 h-3 w-3" /> {item.location}</div>
          <div className="mb-4 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">{item.type}</div>
          <div className="mb-6 flex justify-start gap-5 text-[11px] text-gray-500">
            <div className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {item.beds}</div>
            <div className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {item.baths}</div>
            <div className="flex min-w-0 items-center gap-1"><Maximize className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{item.sqft || item.area} {item.sqft ? "sq.ft" : ""}</span></div>
          </div>
          <div className="flex items-end justify-between xl:mt-auto">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Price</div>
              <div className="text-lg font-extrabold text-blue-600">{formatINR(item.priceAmount || item.price)}</div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openDetails();
              }}
              className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:underline"
            >
              Details <span className="text-[14px]">→</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  function renderGroup(title, items, labelCls, badgeCls, subtitle) {
    return (
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span className={`text-xs font-extrabold uppercase tracking-[0.18em] ${labelCls}`}>{title}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeCls}`}>{items.length}</span>
          {subtitle && <span className="text-xs text-slate-400">&mdash; {subtitle}</span>}
        </div>
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${desktop ? "2xl:grid-cols-3" : "lg:grid-cols-3"}`}>
          {items.map((item) => renderCard(item))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ${desktop ? "mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5" : "mb-6"}`}>
        <div>
          {hasQuery && groupedResults ? (
            groupedResults.exact.length > 0 ? (
              <>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
                  {groupedResults.exact.length} Exact {groupedResults.exact.length === 1 ? "Match" : "Matches"}
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Results for &ldquo;{query.trim()}&rdquo;</h1>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-500">0 Exact Results</p>
                <h1 className="mt-1 text-3xl font-extrabold text-slate-950">No exact match for &ldquo;{query.trim()}&rdquo;</h1>
              </>
            )
          ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
                {newProjectMode ? "New Projects" : activeCity === "All" ? `${searchType} properties` : `${searchType} in ${activeCity}`}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
                {filteredListings.length} {newProjectMode ? "New Projects Found" : desktop ? "Properties Found" : "Matching Properties"}
              </h1>
            </>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-500">{activeType === "All" ? "All property types" : activeType}</p>
      </div>

      {hasQuery && groupedResults ? (
        <div>
          {loading && <PropertyStatusCard message="Loading live properties..." />}
          {!loading && error && <PropertyStatusCard tone="error" message={error} />}
          {!loading && !error && groupedResults.exact.length === 0 && filteredListings.length > 0 && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-3.5">
              <p className="text-sm font-bold text-rose-700">No exact results for &ldquo;{query.trim()}&rdquo;</p>
              <p className="mt-0.5 text-xs text-rose-500">Showing similar and nearby properties below.</p>
            </div>
          )}

          {!loading && !error && groupedResults.exact.length > 0 && renderGroup("Exact Matches", groupedResults.exact, "text-blue-600", "bg-blue-50 text-blue-700")}
          {!loading && !error && groupedResults.similar.length > 0 && renderGroup("Similar Properties", groupedResults.similar, "text-violet-600", "bg-violet-50 text-violet-700", "same city, different configuration")}
          {!loading && !error && groupedResults.alternatives.length > 0 && renderGroup("In Other Cities", groupedResults.alternatives, "text-amber-600", "bg-amber-50 text-amber-700", "similar properties nearby")}

          {!loading && !error && filteredListings.length === 0 && (
            <div className="wf-card p-8 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100">
                <Search size={28} className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-950">No properties found</h2>
              <p className="mt-2 text-slate-500">No results for &ldquo;{query.trim()}&rdquo;.</p>
              <p className="mt-1 text-sm text-slate-400">Try a different location, BHK count, or property type.</p>
              <button type="button" onClick={resetFilters} className="wf-btn wf-btn-primary mt-5">Clear All Filters</button>
            </div>
          )}
        </div>
      ) : (
        <>
          {loading && <PropertyStatusCard message="Loading live properties..." />}
          {!loading && error && <PropertyStatusCard tone="error" message={error} />}
          {!loading && !error && (
            <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${desktop ? "2xl:grid-cols-3" : "lg:grid-cols-3"}`}>
              {filteredListings.map((item) => renderCard(item))}
            </div>
          )}
          {!loading && !error && filteredListings.length === 0 && (
            <div className="wf-card p-8 text-center">
              <h2 className="text-2xl font-extrabold text-slate-950">No properties found.</h2>
              <p className="mt-2 text-slate-500">Try changing your search or filters.</p>
              <button type="button" onClick={resetFilters} className="wf-btn wf-btn-primary mt-5">Clear Filters</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function PropertyStatusCard({ message, tone = "default" }) {
  const isError = tone === "error";
  return (
    <div className={`wf-card p-8 text-center ${isError ? "border-rose-100 bg-rose-50 text-rose-600" : "text-slate-500"}`}>
      <p className="text-sm font-bold">{message}</p>
    </div>
  );
}

function FilterPanel({ open, onClose, priceRange, setPriceRange, filters, updateFilter, options, resetFilters }) {
  if (!open) return null;
  const minPrice = Number(filters.minPrice || 0);
  const maxPrice = Number(filters.maxPrice || 0);
  const updatePrice = (key, value, { keepPreset = false } = {}) => {
    updateFilter(key, value ? String(Math.max(0, Number(value))) : "");
    if (!keepPreset) setPriceRange("Any");
  };
  return (
    <div className="fixed inset-0 z-[90] lg:static lg:z-auto">
      <button type="button" className="absolute inset-0 bg-slate-950/45 lg:hidden" onClick={onClose} aria-label="Close filters" />
      <aside className="absolute right-0 top-0 h-full w-[min(92vw,420px)] overflow-y-auto bg-white p-5 shadow-2xl lg:relative lg:h-auto lg:w-full lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-950">Advanced Filters</h2>
            <p className="text-sm text-slate-500">Use search and filters together for exact results.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close filters">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Area wise" value={filters.areaWise} onChange={(value) => updateFilter("areaWise", value)} options={["", ...options.areaWise]} />
          <FilterSelect label="Property type" value={filters.propertyType} onChange={(value) => updateFilter("propertyType", value)} options={["", ...(options.propertyType || [])]} />
          <FilterSelect label="Property category" value={filters.propertyCategory} onChange={(value) => updateFilter("propertyCategory", value)} options={["", ...options.propertyCategory]} />
          <div className="md:col-span-2 xl:col-span-4">
            <PriceRangeControl
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinChange={(value, options) => updatePrice("minPrice", value, options)}
              onMaxChange={(value, options) => updatePrice("maxPrice", value, options)}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={resetFilters} className="wf-btn wf-btn-secondary">Clear Filters</button>
          <button type="button" onClick={onClose} className="wf-btn wf-btn-primary">Show Results</button>
        </div>
      </aside>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, labels = {} }) {
  const cleanOptions = [...new Set(options.filter((option) => option !== undefined && option !== null))];
  return (
    <label className="block">
      <span className="wf-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="wf-input">
        {cleanOptions.map((option) => (
          <option key={option} value={option}>
            {labels[option] || option || "Any"}
          </option>
        ))}
      </select>
    </label>
  );
}

function PriceRangeControl({ compact = false, priceRange, setPriceRange, minPrice, maxPrice, onMinChange, onMaxChange }) {
  const maxLimit = 10000000;
  const sliderValue = priceRange === "1 Cr+" ? maxLimit : Math.min(maxPrice || maxLimit, maxLimit);
  const presets = [
    ["Any", "Any"],
    ["Up to 10 Lakh", "Up to 10 Lakh"],
    ["Up to 25 Lakh", "Up to 25 Lakh"],
    ["Up to 50 Lakh", "Up to 50 Lakh"],
    ["Up to 75 Lakh", "Up to 75 Lakh"],
    ["1 Cr+", "1 Cr+"],
  ];
  const presetValues = {
    "Up to 10 Lakh": 1000000,
    "Up to 25 Lakh": 2500000,
    "Up to 50 Lakh": 5000000,
    "Up to 75 Lakh": 7500000,
  };
  const formatShort = (value) => {
    if (!value) return "0";
    if (value >= 10000000) return `${(value / 10000000).toFixed(value % 10000000 ? 1 : 0)} Cr`;
    if (value >= 100000) return `${Math.round(value / 100000)} Lakh`;
    return value.toLocaleString("en-IN");
  };
  const applyPreset = (value) => {
    setPriceRange(value);
    if (value === "Any") {
      onMinChange("", { keepPreset: true });
      onMaxChange("", { keepPreset: true });
    } else if (presetValues[value]) {
      onMinChange("", { keepPreset: true });
      onMaxChange(String(presetValues[value]), { keepPreset: true });
    } else if (value === "1 Cr+") {
      onMinChange("10000000", { keepPreset: true });
      onMaxChange("", { keepPreset: true });
    }
  };
  const updateMaxFromSlider = (value) => {
    const nextValue = Math.min(maxLimit, Math.max(0, Number(value)));
    const matchingPreset = Object.entries(presetValues).find(([, amount]) => amount === nextValue)?.[0];
    setPriceRange(matchingPreset || "Any");
    onMinChange("", { keepPreset: true });
    onMaxChange(String(nextValue), { keepPreset: true });
  };
  const selectedLabel = priceRange === "1 Cr+"
    ? "Selected: ₹1 Cr+"
    : minPrice && maxPrice
      ? `Selected: ₹${formatShort(minPrice)} to ₹${formatShort(maxPrice)}`
      : maxPrice
        ? `Selected: Up to ₹${formatShort(maxPrice)}`
        : minPrice
          ? `Selected: ₹${formatShort(minPrice)}+`
          : "Choose a budget range";

  return (
    <div className={compact ? "" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"}>
      <div className={compact ? "space-y-3" : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"}>
        <div>
          <h3 className="text-base font-extrabold text-slate-950">Price Range</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {selectedLabel}
          </p>
        </div>
        <select className={`wf-input ${compact ? "" : "sm:max-w-56"}`} value={priceRange} onChange={(event) => applyPreset(event.target.value)}>
          {presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-2" : "md:grid-cols-2"}`}>
        <label>
          <span className="wf-label">From (₹)</span>
          <IndianMoneyInput className="wf-input" value={minPrice || ""} onValueChange={onMinChange} placeholder="No minimum" />
        </label>
        <label>
          <span className="wf-label">To (₹)</span>
          <IndianMoneyInput className="wf-input" value={maxPrice || ""} onValueChange={onMaxChange} placeholder="No maximum" />
        </label>
      </div>

      <div className={`mt-5 flex flex-wrap gap-2 ${compact ? "hidden" : ""}`}>
        {presets.slice(1).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => applyPreset(value)}
            className={`min-h-10 rounded-full border px-4 py-2 text-xs font-extrabold transition ${
              priceRange === value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <input
          className="h-11 w-full cursor-pointer accent-blue-600"
          type="range"
          min="0"
          max={maxLimit}
          step="100000"
          value={sliderValue}
          onChange={(event) => updateMaxFromSlider(event.target.value)}
          aria-label="Maximum property price"
        />
      </div>

      <div className={`justify-between text-xs font-bold text-slate-400 sm:hidden ${compact ? "hidden" : "flex"}`}>
        <span>₹0</span>
        <span>₹50 Lakh</span>
        <span>₹1 Cr+</span>
      </div>
      <div className={compact ? "flex justify-between text-[10px] font-bold text-slate-400" : "hidden grid-cols-5 text-xs font-bold text-slate-400 sm:grid"}>
        <span>₹0</span>
        {!compact && <span className="text-center">₹25 Lakh</span>}
        <span className="text-center">₹50 Lakh</span>
        {!compact && <span className="text-center">₹75 Lakh</span>}
        <span className="text-right">₹1 Cr+</span>
      </div>
    </div>
  );
}
