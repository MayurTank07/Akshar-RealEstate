import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// JSON imports (Ensure these paths are correct in your project)
import buyersData from "../data/buyers.json";
import sellersData from "../data/sellers.json";
import rentalsData from "../data/rentals.json";
import servicesData from "../data/services.json";
import newsData from "../data/news.json";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const dataMap = {
    buyers: buyersData,
    sellers: sellersData,
    rentals: rentalsData,
    services: servicesData,
    news: newsData
  };

  const navItems = [
    { title: "For Buyers", key: "buyers" },
    { title: "For Sellers", key: "sellers" },
    { title: "For Rentals", key: "rentals" },
    { title: "Services", key: "services" },
    { title: "News & Guide", key: "news" }
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
    if (!isLoggedIn) {
      setSelectedMenu(key);
      setShowPopup(true);
      return;
    }
    setActiveMenu(activeMenu === key ? null : key);
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50 px-4" ref={menuRef}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mt-4 relative">
          
          <h1 className="text-white text-2xl font-bold cursor-pointer shrink-0" onClick={() => navigate("/")}>
            Westfield
          </h1>

          <div className="hidden md:flex gap-6 text-white text-sm font-medium">
            {navItems.map((nav) => {
              const fileData = dataMap[nav.key] || {};
              const sections = fileData.menus || [];
              const isSmall = sections.length === 1;
              const isMedium = sections.length === 2;

              return (
                <div key={nav.key} className={isSmall ? "relative" : "static"}>
                  <button
                    className={`hover:text-blue-300 flex items-center gap-1 transition-colors ${activeMenu === nav.key ? "text-blue-300" : ""}`}
                    onClick={() => handleMenuClick(nav.key)}
                  >
                    {nav.title}
                    <span className={`transition-transform ${activeMenu === nav.key ? "rotate-180" : ""}`}>▾</span>
                  </button>

                  {activeMenu === nav.key && (
                    <div className={`absolute top-[120%] mt-2 bg-white text-gray-800 rounded-2xl shadow-2xl z-[100] border border-gray-100 overflow-hidden ${isSmall ? "left-0 w-72 p-6" : isMedium ? "left-1/2 -translate-x-1/2 w-[500px] p-8" : "left-1/2 -translate-x-1/2 w-[90vw] max-w-6xl p-8"}`}>
                      <div className={`grid gap-8 ${isSmall ? "grid-cols-1" : isMedium ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4"}`}>
                        {sections.map((section, idx) => (
                          <div key={idx} className={!isSmall && idx !== sections.length - 1 ? "border-r border-gray-100 pr-4" : ""}>
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">{section.title}</h3>
                            <ul className="space-y-5">
                              {section.items.map((item, i) => {
                                const isObj = typeof item === "object";
                                const label = isObj ? item.name : item;
                                
                                // Generate Path
                                let targetPath;
                                if (nav.key === 'buyers' || nav.key === 'rentals') {
                                  targetPath = `/purchase/${nav.key}/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                } else {
                                  targetPath = `/${label.toLowerCase().replace(/\s+/g, "-")}`;
                                }

                                return (
                                  <li key={i}>
                                    <Link 
                                      to={targetPath} 
                                      className="group block w-full"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {label}
                                      </p>
                                      {isObj && item.desc && (
                                        <p className="text-[12px] text-gray-500 leading-tight mt-1 font-normal">
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

          <div className="flex gap-4 shrink-0">
            <button onClick={() => navigate("/enquiry")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm">Enquiry</button>
            {!isLoggedIn ? (
              <button onClick={() => navigate("/login")} className="bg-white hover:bg-gray-100 text-blue-600 px-5 py-2 rounded-lg text-sm">Login</button>
            ) : (
              <button onClick={() => { localStorage.removeItem("isLoggedIn"); window.location.reload(); }} className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm">Logout</button>
            )}
          </div>
        </div>
      </div>

      {/* Pop-up for Guest access remains the same logic as your previous build */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-80 text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-sm text-gray-600 mb-6">Access exclusive guides by logging in.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/login")} className="bg-blue-600 text-white py-2.5 rounded-xl font-medium">Login</button>
              <button onClick={() => { localStorage.setItem("isLoggedIn", "true"); setShowPopup(false); setActiveMenu(selectedMenu); }} className="bg-gray-100 py-2.5 rounded-xl font-medium">Continue as Guest</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}