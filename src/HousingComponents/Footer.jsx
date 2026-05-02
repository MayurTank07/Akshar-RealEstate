import React from 'react';
import { 
  Share2, 
  Globe, 
  Users, 
  Link, 
  ExternalLink,
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            <span className="text-blue-500">Housing</span>.com
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Your trusted partner in finding the perfect property. We help you discover, buy, rent, and sell properties with ease.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {[Share2, Globe, Users, Link, ExternalLink].map((Icon, index) => (
              <a 
                key={index} 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            {["About Us", "Contact", "Blog", "Careers", "Testimonials"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-500 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Services</h3>
          <ul className="space-y-4 text-sm">
            {["Buy Property", "Rent Property", "Sell Property", "Home Loans", "Property Valuation"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-blue-500 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 shrink-0" />
              <span>123 Real Estate Ave, Mumbai, India 400001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <span>+91 1800-123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <span>info@housing.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 Housing.com. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;