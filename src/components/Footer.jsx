import React from 'react';
import { Share2, Globe, Users, Link, ExternalLink, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1c] text-gray-400 py-8 sm:py-12 px-4 sm:px-6 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-16">
          
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1 sm:col-span-2">
            <h2 className="text-white text-xl sm:text-2xl font-bold">Westfield</h2>
            <p className="text-sm leading-relaxed max-w-xs sm:max-w-sm">
              Your trusted partner in finding the perfect property.
            </p>

            <div className="flex space-x-3">
              {[Share2, Globe, Users, Link, ExternalLink].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <Icon size={14} className="sm:size-[18px] text-gray-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Buy Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rent Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sell Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Home Loans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Property Valuation</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin size={14} className="sm:size-[18px] text-blue-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="break-words">123 Real Estate Ave, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone size={14} className="sm:size-[18px] text-blue-500 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail size={14} className="sm:size-[18px] text-blue-500 flex-shrink-0" />
                <span>info@housing.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-center sm:text-left"> 2026 Housing.com. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;