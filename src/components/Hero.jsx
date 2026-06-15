import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Search, TrendingUp, X } from "lucide-react";
import useSiteContent from "../hooks/useSiteContent";
import { publicApi } from "../services/api";
import { generateSearchSuggestions } from "../utils/propertySearch";

const RECENT_KEY = "akshar_recent_searches";
const MAX_RECENT = 5;
const POPULAR_SEARCHES = [
  "2 BHK in Surat",
  "3 BHK in Ahmedabad",
  "Villa in Vadodara",
  "Flat for Rent in Surat",
  "Commercial Space",
];

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(q) {
  if (!q?.trim()) return;
  const prev = getRecent().filter((s) => s !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

export default function Hero() {
  const navigate = useNavigate();
  const { heroTitle, heroSubtitle, heroImage, heroCtaText } = useSiteContent();
  const [activeTab, setActiveTab] = useState("Buy");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [properties, setProperties] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const localities = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Anand"];
  const tabs = ["Buy", "Rent", "Sell", "Pre Leased", "Barter", "ROI", "New Projects"];
  const highlights = ["Verified homes", "Gujarat focused", "Site visits"];

  useEffect(() => {
    publicApi.properties().then((r) => { if (r.data?.length) setProperties(r.data); }).catch(() => {});
  }, []);

  useEffect(() => { setRecent(getRecent()); }, []);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(() => setSuggestions(generateSearchSuggestions(query, properties)), 150);
    return () => clearTimeout(t);
  }, [query, properties]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback((value = query, mode = "query") => {
    const clean = value.trim();
    if (clean) { saveRecent(clean); setRecent(getRecent()); }
    setShowDropdown(false);

    if (activeTab === "Sell") {
      navigate("/enquiry", { state: { category: "Sell", city: clean || "Ahmedabad" } });
      return;
    }

    const isLocality = mode === "locality";
    const isInvestmentMode = ["Pre Leased", "Barter", "ROI"].includes(activeTab);
    const isNewProjects = activeTab === "New Projects";
    const searchQuery = isLocality ? "" : clean || (isNewProjects ? "new launch" : "");

    navigate("/pricing", {
      state: {
        category: activeTab === "Rent" ? "Rentals" : isNewProjects ? "New Projects" : activeTab,
        type: "All",
        city: isLocality ? clean || "Ahmedabad" : "All",
        filters: {
          activeCity: isLocality ? clean || "Ahmedabad" : "All",
          activeType: "All",
          query: searchQuery,
          searchType: activeTab === "Rent" ? "Rent" : isInvestmentMode || isNewProjects ? activeTab : "Buy",
          intentLabel: isInvestmentMode || isNewProjects ? activeTab : "",
        },
      },
    });
  }, [activeTab, navigate, query]);

  const dropdownVisible = showDropdown && (recent.length > 0 || suggestions.length > 0 || POPULAR_SEARCHES.length > 0);

  return (
    <section className="relative min-h-[760px] w-full overflow-hidden bg-slate-950 sm:min-h-[720px] lg:min-h-[760px]">
      <img
        src={heroImage || "/house.jpg"}
        alt="Modern Akshar Estate The Property HUB home exterior"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-800/45 to-blue-950/85 sm:bg-gradient-to-r sm:from-blue-950/85 sm:via-blue-900/55 sm:to-blue-500/30" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950/65 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-7xl flex-col justify-end px-4 pb-10 pt-28 text-white sm:min-h-[720px] sm:px-6 sm:pb-14 sm:pt-32 lg:min-h-[760px] lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-50 backdrop-blur sm:text-[11px]">
            Gujarat real estate advisory
          </p>
          <h1 className="max-w-3xl text-[2.7rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:mt-5 sm:text-lg">
            {heroSubtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
            {highlights.map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/12 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-slate-950/10 backdrop-blur">
                {item}
              </span>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); doSearch(); }}
          className="mt-6 w-full rounded-[1.6rem] border border-white/70 bg-white/95 p-4 text-slate-700 shadow-2xl shadow-blue-950/30 backdrop-blur sm:mt-9 sm:max-w-4xl sm:p-6"
        >
          <div className="wf-scrollbar-none flex gap-3 overflow-x-auto border-b border-slate-200 pb-3 text-sm sm:gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-1 pb-2 font-extrabold transition ${
                  activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 flex min-w-0 flex-col items-stretch gap-3 sm:mt-5 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1" ref={containerRef}>
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-shadow focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 sm:h-14">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); doSearch(); }
                    if (e.key === "Escape") setShowDropdown(false);
                  }}
                  placeholder="2 BHK in Surat, Villa, Commercial..."
                  className="min-h-0 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <X size={15} />
                  </button>
                )}
              </div>

              {dropdownVisible && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
                  {!query.trim() ? (
                    <>
                      {recent.length > 0 && (
                        <div className="border-b border-slate-100 px-2 pb-2 pt-3">
                          <p className="mb-1 flex items-center gap-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Clock size={10} /> Recent Searches
                          </p>
                          {recent.map((s) => (
                            <button key={s} type="button" onClick={() => { setQuery(s); doSearch(s); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                              <Clock size={13} className="shrink-0 text-slate-300" />
                              <span className="flex-1">{s}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="px-2 pb-2 pt-3">
                        <p className="mb-1 flex items-center gap-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <TrendingUp size={10} /> Popular Searches
                        </p>
                        {POPULAR_SEARCHES.map((s) => (
                          <button key={s} type="button" onClick={() => { setQuery(s); doSearch(s); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                            <TrendingUp size={13} className="shrink-0 text-blue-300" />
                            <span className="flex-1">{s}</span>
                            <ArrowRight size={13} className="shrink-0 text-slate-200" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-1.5">
                      {suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => { setQuery(s); doSearch(s); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                          <Search size={13} className="shrink-0 text-slate-300" />
                          <span className="flex-1">{s}</span>
                          <ArrowRight size={13} className="shrink-0 text-slate-200" />
                        </button>
                      ))}
                      <button type="button" onClick={() => doSearch()} className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-xs font-bold text-blue-600 transition hover:bg-blue-50">
                        <Search size={13} />
                        Search for &ldquo;<span className="underline underline-offset-2">{query.trim()}</span>&rdquo;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-base font-extrabold text-white shadow-xl shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 active:translate-y-0 sm:h-14 sm:w-auto sm:min-w-40"
            >
              <Search size={20} />
              {heroCtaText || "Search"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm sm:mt-5 sm:gap-2.5">
            <span className="mr-1 whitespace-nowrap font-semibold text-slate-500">Popular Localities:</span>
            {localities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => { setQuery(city); doSearch(city, "locality"); }}
                className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {city}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
