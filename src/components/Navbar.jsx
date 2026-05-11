import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import EnquiryModal from "./EnquiryModal";
import BrandLogo from "./BrandLogo";
import { Bookmark, ChevronDown, LogIn, LogOut, Menu, X } from "lucide-react";

import buyersData from "../data/buyers.json";
import sellersData from "../data/sellers.json";
import rentalsData from "../data/rentals.json";
import servicesData from "../data/services.json";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const dataMap = {
    buyers: buyersData,
    sellers: sellersData,
    rentals: rentalsData,
    services: servicesData,
  };

  const navItems = [
    { title: "For Buyers", key: "buyers" },
    { title: "For Sellers", key: "sellers" },
    { title: "For Rentals", key: "rentals" },
    { title: "Services", key: "services" },
    { title: "About Us", key: "about" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (key) => {
    if (key === "about") {
      navigate("/about");
      return;
    }

    if (key === "sellers" && !isAuthenticated) {
      navigate("/login");
      return;
    }

    setActiveMenu(activeMenu === key ? null : key);
  };

  const getTargetPath = (navKey, label) => {
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    return navKey === "buyers" || navKey === "rentals"
      ? `/purchase/${navKey}/${slug}`
      : `/${slug}`;
  };

  const handleDropdownClick = (event, navKey, label) => {
    if (navKey === "buyers" || navKey === "rentals") {
      event.preventDefault();
      navigate("/pricing", {
        state: {
          category: navKey === "buyers" ? "Buy" : "Rentals",
          type: label,
        },
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
                  const isObj = typeof item === "object";
                  const label = isObj ? item.name : item;

                  return (
                    <li key={label}>
                      <Link
                        to={getTargetPath(nav.key, label)}
                        onClick={(event) => handleDropdownClick(event, nav.key, label)}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
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
            className="flex min-w-0 items-center rounded-xl text-xl transition hover:opacity-90"
          >
            <BrandLogo />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
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
                  {nav.key !== "about" && (
                    <ChevronDown
                      size={15}
                      className={`transition ${activeMenu === nav.key ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                {nav.key !== "about" && activeMenu === nav.key && renderDropdown(nav)}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={() => { if (!isAuthenticated) { navigate("/login"); return; } setShowEnquiryModal(true); }} className="wf-btn wf-btn-primary">
              Enquiry
            </button>

            <button type="button" onClick={() => navigate("/saved")} className="wf-btn wf-btn-secondary">
              <Bookmark size={16} />
              Saved
            </button>

            {!isAuthenticated ? (
              <button type="button" onClick={() => navigate("/login")} className="wf-btn wf-btn-secondary">
                <LogIn size={16} />
                Login
              </button>
            ) : (
              <button type="button" onClick={logout} className="wf-btn wf-btn-secondary">
                <LogOut size={16} />
                Logout
              </button>
            )}

          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation backdrop"
          />

          <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,390px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="min-w-0 text-lg">
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

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
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
                    {nav.key !== "about" && (
                      <ChevronDown
                        size={16}
                        className={`transition ${activeMenu === nav.key ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  {nav.key !== "about" && activeMenu === nav.key && renderDropdown(nav, true)}
                </div>
              ))}
            </nav>

            <div className="space-y-3 border-t border-slate-200 p-4">
              <button type="button" onClick={() => { if (!isAuthenticated) { navigate("/login"); return; } setShowEnquiryModal(true); }} className="wf-btn wf-btn-primary w-full">
                Enquiry
              </button>
              <button type="button" onClick={() => navigate("/saved")} className="wf-btn wf-btn-secondary w-full">
                <Bookmark size={16} />
                Saved
              </button>
              {!isAuthenticated ? (
                <button type="button" onClick={() => navigate("/login")} className="wf-btn wf-btn-secondary w-full">
                  <LogIn size={16} />
                  Login
                </button>
              ) : (
                <button type="button" onClick={logout} className="wf-btn wf-btn-secondary w-full">
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      <EnquiryModal isOpen={showEnquiryModal} onClose={() => setShowEnquiryModal(false)} />
    </>
  );
}
