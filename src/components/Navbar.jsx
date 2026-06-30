import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import EnquiryModal from "./EnquiryModal";
import BrandLogo from "./BrandLogo";
import SavedBadge from "./SavedBadge";
import { Bookmark, ChevronDown, LogIn, LogOut, Menu, User, X } from "lucide-react";

import buyersData from "../data/buyers.json";
import sellersData from "../data/sellers.json";
import rentalsData from "../data/rentals.json";
import useSiteContent from "../hooks/useSiteContent";
import { buildDynamicMenus } from "../config/navigationContent";
import { pricingPathFor, pricingStateFromLabel } from "../utils/propertyRouting";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, savedProperties } = useAuth();
  const siteContent = useSiteContent();
  const savedCount = savedProperties.length;

  const dataMap = {
    buyers: { ...buyersData, menus: buildDynamicMenus(siteContent, "sale") },
    sellers: sellersData,
    rentals: { ...rentalsData, menus: buildDynamicMenus(siteContent, "rent") },
  };

  const navItems = [
    { title: "For Buyers", key: "buyers" },
    { title: "For Sellers", key: "sellers" },
    { title: "For Rentals", key: "rentals" },
    { title: "New Projects", key: "new-projects", path: "/new-projects" },
    { title: "Services", key: "services", path: "/services" },
    { title: "About Us", key: "about", path: "/about" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuOpen) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const handleMenuClick = (key) => {
    const nav = navItems.find((item) => item.key === key);
    if (nav?.path) {
      navigate(nav.path);
      setMobileMenuOpen(false);
      return;
    }
    if (nav?.filters) {
      navigate("/pricing", {
        state: {
          category: nav.filters.searchType || "Buy",
          type: nav.filters.activeType || "All",
          city: "All",
          filters: { activeCity: "All", ...nav.filters },
        },
      });
      setMobileMenuOpen(false);
      return;
    }

    setActiveMenu((current) => current === key ? null : key);
  };

  const getTargetPath = (navKey, itemOrLabel) => {
    const isObj = typeof itemOrLabel === "object" && itemOrLabel;
    if (isObj && itemOrLabel.kind === "view-more") return itemOrLabel.link || "/properties";
    if (isObj && itemOrLabel.slug && ["city", "custom-link"].includes(itemOrLabel.kind)) {
      return itemOrLabel.slug.startsWith("/") ? itemOrLabel.slug : `/${itemOrLabel.slug.replace(/^\/+/, "")}`;
    }
    if (isObj && itemOrLabel.slug?.startsWith("/")) return itemOrLabel.slug;
    const label = isObj ? itemOrLabel.name || itemOrLabel.title || "" : itemOrLabel;
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    return navKey === "buyers" || navKey === "rentals"
      ? pricingPathFor(label, navKey)
      : `/${slug}`;
  };

  const handleDropdownClick = (event, navKey, itemOrLabel) => {
    const isObj = typeof itemOrLabel === "object" && itemOrLabel;
    if (isObj && itemOrLabel.kind === "view-more") {
      event.preventDefault();
      navigate(itemOrLabel.link || "/properties");
      setActiveMenu(null);
      setMobileMenuOpen(false);
      return;
    }
    if (isObj && itemOrLabel.slug && ["city", "custom-link"].includes(itemOrLabel.kind)) {
      setActiveMenu(null);
      setMobileMenuOpen(false);
      return;
    }
    const label = isObj ? itemOrLabel.name || itemOrLabel.title || "" : itemOrLabel;
    if (navKey === "sellers" && label.toLowerCase().includes("owner")) {
      event.preventDefault();
      const target = "/profile";
      const state = { action: "add" };
      setActiveMenu(null);
      setMobileMenuOpen(false);
      if (!isAuthenticated) {
        navigate("/login", {
          state: {
            redirectTo: target,
            redirectState: state,
            message: "Please login or register to submit your owner property.",
          },
        });
      } else {
        navigate(target, { state });
      }
      return;
    }
    if (navKey === "buyers" || navKey === "rentals") {
      event.preventDefault();
      navigate("/pricing", {
        state: pricingStateFromLabel(label, navKey),
      });
    }

    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  const renderDropdown = (nav, isMobile = false) => {
    const sections = dataMap[nav.key]?.menus || [];
    if (!sections.length) return null;

    return (
      <div
        className={
          isMobile
            ? "mt-2 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            : "absolute left-1/2 top-full z-[100] mt-3 w-[min(900px,calc(100vw-3rem))] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        }
      >
        <div className={isMobile ? "space-y-5" : "grid grid-cols-2 gap-6 lg:grid-cols-4"}>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const isObj = typeof item === "object" && item;
                  const label = isObj ? item.name || item.title : item;

                  return (
                    <li key={label}>
                      <Link
                        to={getTargetPath(nav.key, item)}
                        onClick={(event) => handleDropdownClick(event, nav.key, item)}
                        className={`block rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700 ${
                          isObj && item.kind === "view-more" ? "border border-blue-100 bg-blue-50 text-blue-700" : "text-slate-700"
                        }`}
                      >
                        <span>{label}</span>
                        {isObj && item.desc && (
                          <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-500">
                            {item.desc}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4" ref={menuRef}>
        <div className="mx-auto flex min-h-[66px] w-full max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex min-w-0 items-center rounded-xl transition hover:opacity-90"
          >
            <BrandLogo />
          </button>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((nav) => (
              <div key={nav.key} className="relative">
                <button
                  type="button"
                  onClick={() => handleMenuClick(nav.key)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                    activeMenu === nav.key || location.pathname === `/${nav.key}`
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {nav.title}
                  {dataMap[nav.key]?.menus?.length > 0 && (
                    <ChevronDown
                      size={15}
                      className={`transition ${activeMenu === nav.key ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                {dataMap[nav.key]?.menus?.length > 0 && activeMenu === nav.key && renderDropdown(nav)}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button type="button" onClick={() => setShowEnquiryModal(true)} className="wf-btn wf-btn-primary">
              Enquiry
            </button>

            {isAuthenticated && (
              <button type="button" onClick={() => navigate("/saved")} className="wf-btn wf-btn-secondary">
                <Bookmark size={16} />
                Saved
                <SavedBadge count={savedCount} />
              </button>
            )}

            {!isAuthenticated ? (
              <button type="button" onClick={() => navigate("/login")} className="wf-btn wf-btn-secondary">
                <LogIn size={16} />
                Login
              </button>
            ) : (
              <>
                <button type="button" onClick={() => navigate("/profile")} className="wf-btn wf-btn-secondary">
                  <User size={16} />
                  Profile
                </button>
                <button type="button" onClick={logout} className="wf-btn wf-btn-secondary">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 xl:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation backdrop"
          />

          <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,390px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <BrandLogo />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close navigation"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="wf-smooth-scroll flex-1 space-y-2 overflow-y-auto px-4 py-5">
              {navItems.map((nav) => (
                <div key={nav.key}>
                  <button
                    type="button"
                    onClick={() => handleMenuClick(nav.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                      activeMenu === nav.key
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {nav.title}
                    {dataMap[nav.key]?.menus?.length > 0 && (
                      <ChevronDown
                        size={16}
                        className={`transition ${activeMenu === nav.key ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  {dataMap[nav.key]?.menus?.length > 0 && activeMenu === nav.key && renderDropdown(nav, true)}
                </div>
              ))}
            </nav>

            <div className="space-y-3 border-t border-slate-200 p-4">
              <button type="button" onClick={() => { setMobileMenuOpen(false); setShowEnquiryModal(true); }} className="wf-btn wf-btn-primary w-full">
                Enquiry
              </button>
              {isAuthenticated && (
                <button type="button" onClick={() => { setMobileMenuOpen(false); navigate("/saved"); }} className="wf-btn wf-btn-secondary w-full">
                  <Bookmark size={16} />
                  Saved
                  <SavedBadge count={savedCount} />
                </button>
              )}
              {!isAuthenticated ? (
                <button type="button" onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="wf-btn wf-btn-secondary w-full">
                  <LogIn size={16} />
                  Login
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => { setMobileMenuOpen(false); navigate("/profile"); }} className="wf-btn wf-btn-secondary w-full">
                    <User size={16} />
                    Profile
                  </button>
                  <button type="button" onClick={() => { setMobileMenuOpen(false); logout(); }} className="wf-btn wf-btn-secondary w-full">
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      <EnquiryModal isOpen={showEnquiryModal} onClose={() => setShowEnquiryModal(false)} />
    </>
  );
}
