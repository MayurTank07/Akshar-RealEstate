import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GuestForm from "./GuestForm";
import EnquiryModal from "./EnquiryModal";
import { Menu, X } from "lucide-react";

// JSON imports
import buyersData from "../data/buyers.json";
import sellersData from "../data/sellers.json";
import rentalsData from "../data/rentals.json";
import servicesData from "../data/services.json";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, guestAccess, guestLoggedIn } = useAuth();

  // Check if we are on the About page to adapt styling
  const isAboutPage = location.pathname === "/about";

  const dataMap = {
    buyers: buyersData,
    sellers: sellersData,
    rentals: rentalsData,
    services: servicesData
  };

  const navItems = [
    { title: "For Buyers", key: "buyers" },
    { title: "For Sellers", key: "sellers" },
    { title: "For Rentals", key: "rentals" },
    { title: "Services", key: "services" },
    { title: "About Us", key: "about" }
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
    if ((key === "buyers" || key === "rentals")) {
      setSelectedMenu(key);
      setShowGuestForm(true);
      // Do not show dropdown yet - wait for form submission
      return;
    }
    setActiveMenu(activeMenu === key ? null : key);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 px-4" ref={menuRef}>
        <div className={`max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border rounded-xl mt-4 relative transition-all duration-300 backdrop-blur-md ${
          isAboutPage 
            ? "bg-white/80 border-slate-200 shadow-sm" 
            : "bg-white/10 border-white/20"
        }`}>
          
          {/* Logo */}
          <h1
            className={`text-2xl font-bold cursor-pointer shrink-0 transition-colors ${
              isAboutPage ? "text-slate-900" : "text-white"
            }`}
            onClick={() => navigate("/")}
          >
            Westfield
          </h1>

          {/* Nav Items */}
          <div className={`hidden md:flex gap-4 text-sm font-medium transition-colors ${
            isAboutPage ? "text-slate-600" : "text-white"
          }`}>
            {navItems.map((nav) => {
              const fileData = dataMap[nav.key] || {};
              const sections = fileData.menus || [];
              const isSmall = sections.length === 1;
              const isMedium = sections.length === 2;

              return (
                <div key={nav.key} className={isSmall ? "relative" : "static"}>
                  <button
                    className={`hover:text-blue-500 flex items-center gap-1 transition-colors ${
                      activeMenu === nav.key ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleMenuClick(nav.key)}
                  >
                    {nav.title}
                    {nav.key !== "about" && (
                      <span
                        className={`transition-transform ${
                          activeMenu === nav.key ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    )}
                  </button>

                  {/* Dropdown (NOT for About Us) */}
                  {nav.key !== "about" && activeMenu === nav.key && (
                    <div
                      className={`absolute top-[120%] mt-1 bg-white text-gray-800 rounded-2xl shadow-2xl z-[100] border border-gray-100 overflow-hidden ${
                        isSmall
                          ? "left-0 w-64 p-4"
                          : isMedium
                          ? "left-1/2 -translate-x-1/2 w-[450px] p-6"
                          : "left-1/2 -translate-x-1/2 w-[85vw] max-w-5xl p-6"
                      }`}
                    >
                      <div
                        className={`grid gap-6 ${
                          isSmall
                            ? "grid-cols-1"
                            : isMedium
                            ? "grid-cols-2"
                            : "grid-cols-1 md:grid-cols-4"
                        }`}
                      >
                        {sections.map((section, idx) => (
                          <div
                            key={idx}
                            className={
                              !isSmall && idx !== sections.length - 1
                                ? "border-r border-gray-100 pr-4"
                                : ""
                            }
                          >
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                              {section.title}
                            </h3>
                            <ul className="space-y-3">
                              {section.items.map((item, i) => {
                                const isObj = typeof item === "object";
                                const label = isObj ? item.name : item;

                                let targetPath;
                                if (nav.key === "buyers" || nav.key === "rentals") {
                                  targetPath = `/purchase/${nav.key}/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                } else {
                                  targetPath = `/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                }

                                return (
                                  <li key={i}>
                                    <Link
                                      to={targetPath}
                                      className="group block w-full"
                                      onClick={(e) => {
                                        if ((nav.key === "buyers" || nav.key === "rentals")) {
                                          e.preventDefault();
                                          setActiveMenu(null);
                                          // Pass category and type to Pricing page
                                          navigate("/pricing", { 
                                            state: { 
                                              category: nav.key === "buyers" ? "Buy" : "Rentals", 
                                              type: label 
                                            } 
                                          });
                                        } else {
                                          setActiveMenu(null);
                                        }
                                      }}
                                    >
                                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {label}
                                      </p>
                                      {isObj && item.desc && (
                                        <p className="text-[12px] text-gray-500 mt-1">
                                          {item.desc}
                                        </p>
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
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3 shrink-0">
            <button
              onClick={() => setShowEnquiryModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Enquiry
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  isAboutPage 
                    ? "bg-slate-900 text-white hover:bg-slate-800" 
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isAboutPage ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/20"
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] overflow-hidden ${
            isAboutPage 
              ? "bg-white border-l border-slate-200" 
              : "bg-white/95 backdrop-blur-md border-l border-white/20"
          } shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col`}>
            
            {/* Mobile Menu Header */}
            <div className={`px-4 py-3 border-b flex-shrink-0 ${
              isAboutPage ? "border-slate-200" : "border-gray-200"
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${
                  isAboutPage ? "text-slate-900" : "text-gray-900"
                }`}>Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isAboutPage ? "text-slate-600 hover:bg-slate-100" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <nav className="px-3 py-3 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((nav) => {
                const fileData = dataMap[nav.key] || {};
                const sections = fileData.menus || [];

                return (
                  <div key={nav.key} className="border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center justify-between ${
                        isAboutPage 
                          ? "text-slate-700 hover:bg-slate-50" 
                          : "text-gray-700 hover:bg-gray-50"
                      } ${activeMenu === nav.key ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => {
                        if (nav.key === "about") {
                          navigate("/about");
                          setMobileMenuOpen(false);
                        } else if (nav.key === "sellers" && !isAuthenticated) {
                          setSelectedMenu(nav.key);
                          setShowGuestForm(true);
                          setMobileMenuOpen(false);
                        } else if ((nav.key === "buyers" || nav.key === "rentals") && !guestLoggedIn) {
                          setSelectedMenu(nav.key);
                          setShowGuestForm(true);
                          setMobileMenuOpen(false);
                        } else {
                          setActiveMenu(activeMenu === nav.key ? null : nav.key);
                        }
                      }}
                    >
                      <span>{nav.title}</span>
                      {nav.key !== "about" && (
                        <span className={`transition-transform ${
                          activeMenu === nav.key ? "rotate-180" : ""
                        }`}>
                          ▾
                        </span>
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {nav.key !== "about" && activeMenu === nav.key && (
                      <div className="mt-1 pl-3 space-y-1">
                        {sections.map((section, idx) => (
                          <div key={idx} className="mb-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-2">
                              {section.title}
                            </h4>
                            <ul className="space-y-0.5">
                              {section.items.map((item, i) => {
                                const isObj = typeof item === "object";
                                const label = isObj ? item.name : item;

                                let targetPath;
                                if (nav.key === "buyers" || nav.key === "rentals") {
                                  targetPath = `/purchase/${nav.key}/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                } else {
                                  targetPath = `/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                }

                                return (
                                  <li key={i}>
                                    <Link
                                      to={targetPath}
                                      className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      onClick={(e) => {
                                        if ((nav.key === "buyers" || nav.key === "rentals")) {
                                          e.preventDefault();
                                          setActiveMenu(null);
                                          setMobileMenuOpen(false);
                                          // Pass category and type to Pricing page
                                          navigate("/pricing", { 
                                            state: { 
                                              category: nav.key === "buyers" ? "Buy" : "Rentals", 
                                              type: label 
                                            } 
                                          });
                                        } else {
                                          setActiveMenu(null);
                                          setMobileMenuOpen(false);
                                        }
                                      }}
                                    >
                                      <p className="font-medium text-xs">{label}</p>
                                      {isObj && item.desc && (
                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                          {item.desc}
                                        </p>
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Mobile Action Buttons */}
            <div className="px-3 py-2 border-t border-gray-200 space-y-2 flex-shrink-0">
              <button
                onClick={() => {
                  setShowEnquiryModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-medium transition-all text-sm"
              >
                Enquiry
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md font-medium transition-all text-sm ${
                    isAboutPage 
                      ? "bg-slate-900 text-white hover:bg-slate-800" 
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-medium transition-all text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guest Form Modal */}
      {showGuestForm && (
        <GuestForm
          onClose={() => setShowGuestForm(false)}
          onContinue={(guestData) => {
            guestAccess(guestData);
            setShowGuestForm(false);
            // Show dropdown after form submission
            setActiveMenu(selectedMenu);
          }}
        />
      )}

      {/* Enquiry Modal */}
      <EnquiryModal 
        isOpen={showEnquiryModal} 
        onClose={() => setShowEnquiryModal(false)} 
      />
    </>
  );
}
