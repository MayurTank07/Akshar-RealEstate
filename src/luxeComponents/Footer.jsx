import React from "react";
import {
  Share2,
  Globe,
  Users,
  Link,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0B1C2E] text-gray-300 px-8 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold">
              L
            </div>
            <h2 className="text-white text-lg font-semibold">LuxeEstate</h2>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Your trusted partner in finding the perfect property.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {[Share2, Globe, Users, Link, ExternalLink].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center bg-[#13263D] rounded-lg hover:bg-purple-600 transition cursor-pointer"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Testimonials</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white text-sm font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Buy Property</li>
            <li className="hover:text-white cursor-pointer">Rent Property</li>
            <li className="hover:text-white cursor-pointer">Sell Property</li>
            <li className="hover:text-white cursor-pointer">Home Loans</li>
            <li className="hover:text-white cursor-pointer">
              Property Valuation
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-sm font-semibold mb-4">Contact Us</h3>

          <div className="flex items-start gap-2 mb-3 text-sm text-gray-400">
            <MapPin size={16} className="text-purple-400 mt-1" />
            <p>123 Real Estate Ave, Mumbai, India 400001</p>
          </div>

          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <Phone size={16} className="text-purple-400" />
            <p>+91 1800-123-4567</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail size={16} className="text-purple-400" />
            <p>info@luxeestate.com</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 LuxeEstate. All rights reserved.</p>

        <div className="flex gap-6 mt-3 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;