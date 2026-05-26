import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import useSiteContent from "../hooks/useSiteContent";

export default function Hero() {
  const navigate = useNavigate();
  const { heroTitle, heroSubtitle, heroImage, heroCtaText } = useSiteContent();
  const [activeTab, setActiveTab] = useState("Buy");
  const [query, setQuery] = useState("");

  const localities = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Anand"];
  const tabs = ["Buy", "Rent", "Sell", "Pre Leased", "Barter", "ROI"];
  const highlights = ["Verified homes", "Gujarat focused", "Site visits"];

  const handleSearch = (city = query) => {
    const cleanCity = city.trim();

    if (activeTab === "Sell") {
      navigate("/enquiry", { state: { category: "Sell", city: cleanCity || "Ahmedabad" } });
      return;
    }

    const isInvestmentMode = ["Pre Leased", "Barter", "ROI"].includes(activeTab);

    navigate("/pricing", {
      state: {
        category: activeTab === "Rent" ? "Rentals" : activeTab,
        type: "All",
        city: cleanCity || "Ahmedabad",
        filters: {
          activeCity: cleanCity || "Ahmedabad",
          activeType: "All",
          query: "",
          searchType: activeTab === "Rent" ? "Rent" : isInvestmentMode ? activeTab : "Buy",
          intentLabel: isInvestmentMode ? activeTab : "",
        },
      },
    });
  };

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
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/12 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-slate-950/10 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
          className="mt-6 w-full rounded-[1.6rem] border border-white/70 bg-white/95 p-4 text-slate-700 shadow-2xl shadow-blue-950/30 backdrop-blur sm:mt-9 sm:max-w-4xl sm:p-6"
        >
          <div className="wf-scrollbar-none flex gap-3 overflow-x-auto border-b border-slate-200 pb-3 text-sm sm:gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-1 pb-2 font-extrabold transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 flex min-w-0 flex-col items-stretch gap-3 sm:mt-5 sm:flex-row sm:items-center">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Ahmedabad, Surat, Vadodara..."
              className="h-12 w-full min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-14"
            />

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
                onClick={() => {
                  setQuery(city);
                  handleSearch(city);
                }}
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
