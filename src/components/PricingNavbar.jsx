import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bookmark, ChevronDown, Clock, Home, Search, SlidersHorizontal, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SavedBadge from "./SavedBadge";
import useAuth from "../contexts/useAuth";
import useSiteContent from "../hooks/useSiteContent";
import { cityOptionsFromAreas } from "../config/navigationContent";
import { generateSearchSuggestions } from "../utils/propertySearch";

const RECENT_KEY = "akshar_recent_searches";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}

const categories = ["Buy", "Rent", "New Projects"];

export default function PricingNavbar({
  searchType = "Buy",
  city = "Ahmedabad",
  query = "",
  onCategoryChange,
  onCityChange,
  onQueryChange,
  onToggleFilters,
  properties = [],
}) {
  const navigate = useNavigate();
  const { isAuthenticated, savedProperties } = useAuth();
  const siteContent = useSiteContent();
  const cities = cityOptionsFromAreas(siteContent.navbarAreas);
  const savedCount = savedProperties.length;
  const [openMenu, setOpenMenu] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recent] = useState(() => getRecent());
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const toggleMenu = (menu) => setOpenMenu((current) => (current === menu ? null : menu));

  useEffect(() => {
    const t = setTimeout(() => setSuggestions(query.trim() ? generateSearchSuggestions(query, properties) : []), query.trim() ? 180 : 0);
    return () => clearTimeout(t);
  }, [query, properties]);

  useEffect(() => {
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSuggestionClick = (s) => {
    onQueryChange?.(s);
    setShowSuggestions(false);
  };

  const selectCategory = (value) => {
    onCategoryChange?.(value);
    setOpenMenu(null);
  };

  const selectCity = (value) => {
    onCityChange?.(value);
    setOpenMenu(null);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((current) => !current);
    setOpenMenu(null);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="wf-container flex min-h-[72px] flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex min-w-0 items-center rounded-xl text-xl transition hover:opacity-90"
            onClick={() => navigate("/")}
          >
            <BrandLogo />
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 lg:hidden"
            onClick={toggleMobileSearch}
            aria-expanded={mobileSearchOpen}
            aria-label={mobileSearchOpen ? "Hide search filters" : "Show search filters"}
          >
            {mobileSearchOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
            Filter
          </button>
        </div>

        <div className={`${mobileSearchOpen ? "flex" : "hidden"} w-full min-w-0 flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm sm:flex-row lg:flex lg:max-w-2xl`}>
          <div className="relative grid gap-2 sm:min-w-[230px] sm:grid-cols-[0.8fr_1.2fr]">
            <button
              type="button"
              onClick={() => toggleMenu("category")}
              className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-white px-3 text-sm font-bold text-blue-700 shadow-sm"
            >
              <span className="truncate">{searchType}</span>
              <ChevronDown size={16} className={`transition ${openMenu === "category" ? "rotate-180" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => toggleMenu("city")}
              className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-white px-3 text-sm font-bold text-slate-700 shadow-sm"
            >
              <span className="truncate">{city}</span>
              <ChevronDown size={16} className={`transition ${openMenu === "city" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "category" && (
              <DropdownPanel className="left-0 w-44">
                {categories.map((item) => (
                  <DropdownButton key={item} active={item === searchType} onClick={() => selectCategory(item)}>
                    {item}
                  </DropdownButton>
                ))}
              </DropdownPanel>
            )}

            {openMenu === "city" && (
              <DropdownPanel className="left-0 w-full sm:left-auto sm:right-0 sm:w-52">
                {cities.map((item) => (
                  <DropdownButton key={item} active={item === city} onClick={() => selectCity(item)}>
                    {item}
                  </DropdownButton>
                ))}
              </DropdownPanel>
            )}
          </div>

          <div className="relative flex-1" ref={searchContainerRef}>
            <div className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 shadow-sm">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                className="min-h-0 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-700 shadow-none focus:shadow-none"
                type="text"
                placeholder="Search project, locality, builder"
                value={query}
                autoComplete="off"
                onChange={(event) => { onQueryChange?.(event.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") { onQueryChange?.(""); setShowSuggestions(false); }
                }}
              />
              {query && (
                <button type="button" onClick={() => { onQueryChange?.(""); setSuggestions([]); setShowSuggestions(false); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
              {onToggleFilters && (
                <button
                  type="button"
                  onClick={onToggleFilters}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-blue-600 transition hover:bg-blue-50 xl:hidden"
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal size={17} />
                </button>
              )}
            </div>

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[90] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
                {!query.trim() ? (
                  recent.length > 0 && (
                    <div className="px-2 py-2">
                      <p className="mb-1 flex items-center gap-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Clock size={10} /> Recent
                      </p>
                      {recent.slice(0, 4).map((s) => (
                        <button key={s} type="button" onClick={() => handleSuggestionClick(s)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                          <Clock size={13} className="shrink-0 text-slate-300" />
                          <span className="flex-1 truncate">{s}</span>
                        </button>
                      ))}
                    </div>
                  )
                ) : suggestions.length > 0 ? (
                  <div className="py-1.5">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => handleSuggestionClick(s)} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                        <Search size={13} className="shrink-0 text-slate-300" />
                        <span className="flex-1 truncate">{s}</span>
                        <ArrowRight size={13} className="shrink-0 text-slate-200" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button type="button" onClick={() => navigate("/")} className="wf-btn wf-btn-secondary">
            <Home size={16} />
            Home
          </button>
          {isAuthenticated && (
            <button type="button" onClick={() => navigate("/saved")} className="wf-btn wf-btn-secondary">
              <Bookmark size={16} />
              Saved
              <SavedBadge count={savedCount} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" onClick={() => navigate("/")} className="wf-btn wf-btn-secondary flex-1">
            <Home size={16} />
            Home
          </button>
          {isAuthenticated && (
            <button type="button" onClick={() => navigate("/saved")} className="wf-btn wf-btn-secondary flex-1">
              <Bookmark size={16} />
              Saved
              <SavedBadge count={savedCount} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownPanel({ children, className = "" }) {
  return (
    <div className={`absolute top-full z-[80] mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

function DropdownButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
        active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}
