import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import buyersData from "../data/buyers.json";
import sellersData from "../data/sellers.json";
import rentalsData from "../data/rentals.json";

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
    rentals: rentalsData
  };

  const navItems = [
    { title: "For Buyers", key: "buyers" },
    { title: "For Sellers", key: "sellers" },
    { title: "For Rentals", key: "rentals" }
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

  // 🔥 Handle menu click
  const handleMenuClick = (key) => {
    if (!isLoggedIn) {
      setSelectedMenu(key);
      setShowPopup(true);
      return;
    }
    setActiveMenu(activeMenu === key ? null : key);
  };

  // 🔥 Continue as guest
  const handleGuestAccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setShowPopup(false);
    setActiveMenu(selectedMenu);
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50" ref={menuRef}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mt-4">
          
          <h1
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Westfield
          </h1>

          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            {navItems.map((nav) => {
              const fileData = dataMap[nav.key] || {};
              const allItems = Object.values(fileData).flat();

              return (
                <div key={nav.key} className="relative">
                  <button
                    className={`hover:text-blue-300 flex items-center gap-1 ${
                      activeMenu === nav.key ? "text-blue-300" : ""
                    }`}
                    onClick={() => handleMenuClick(nav.key)}
                  >
                    {nav.title}
                    <span className={`transition ${activeMenu === nav.key ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {activeMenu === nav.key && (
                    <div className="absolute top-full left-0 mt-4 bg-white text-gray-800 rounded-lg shadow-xl w-64 py-2 border z-[100]">
                      {allItems.map((item, index) => (
                        <Link
                          key={index}
                          to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-4 py-2 text-sm hover:bg-blue-50"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <span className="cursor-pointer hover:text-blue-300">Services</span>
            <span className="cursor-pointer hover:text-blue-300">News</span>
          </div>

          <div className="flex gap-4">
            <button 
            onClick={() => navigate("/enquiry")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg">
              Enquiry
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 px-5 py-2 rounded-lg"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              Login Required
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please login or continue as guest to access this section.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={handleGuestAccess}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Continue
              </button>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}