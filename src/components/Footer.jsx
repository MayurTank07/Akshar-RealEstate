import { ExternalLink, Globe, Link, Mail, MapPin, Phone, Share2, Users } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import useSiteContent from '../hooks/useSiteContent';
import { defaultContactContent } from '../config/navigationContent';
import { pricingPathFor, pricingStateFromLabel } from '../utils/propertyRouting';

const Footer = () => {
  const siteContent = useSiteContent();
  const contact = { ...defaultContactContent, ...(siteContent.contactContent || {}) };
  const socials = contact.socials || {};
  const contactPhones = Array.from(
    new Set([contact.phone, contact.secondaryPhone].map((phone) => String(phone || '').trim()).filter(Boolean))
  );
  const footerActions = [
    { icon: Share2, label: 'Enquiry', to: '/enquiry' },
    { icon: Globe, label: 'Properties', to: '/properties' },
    { icon: Users, label: 'About Us', to: '/about' },
    { icon: Link, label: 'Contact Us', to: '/contact' },
    { icon: ExternalLink, label: 'Services', to: '/services' },
  ];
  const socialLinks = [
    { icon: FaInstagram, label: 'Instagram', href: socials.instagram },
    { icon: FaFacebookF, label: 'Facebook', href: socials.facebook },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: socials.linkedin },
    { icon: FaYoutube, label: 'YouTube', href: socials.youtube },
    { icon: Globe, label: 'X', href: socials.x },
  ].filter((item) => item.href);
  const iconLinks = socialLinks.length ? socialLinks : footerActions;

  return (
    <footer className="bg-[#0a0f1c] text-gray-400 py-8 sm:py-12 px-4 sm:px-6 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-16">
          
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1 sm:col-span-2">
            <BrandLogo light large />
            <p className="text-sm leading-relaxed max-w-xs sm:max-w-sm">
              {contact.footerDescription || defaultContactContent.footerDescription}
            </p>

            <div className="flex space-x-3">
              {iconLinks.map(({ icon: Icon, label, to, href }) => (
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <Icon size={14} className="sm:size-[18px] text-gray-300 hover:text-white" />
                  </a>
                ) : (
                  <RouterLink
                  key={label}
                  to={to}
                  aria-label={label}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <Icon size={14} className="sm:size-[18px] text-gray-300 hover:text-white" />
                </RouterLink>
                )
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><RouterLink to={pricingPathFor("Properties for sale in Ahmedabad", "buyers")} state={pricingStateFromLabel("Properties for sale in Ahmedabad", "buyers")} className="hover:text-white transition-colors">Buy Property</RouterLink></li>
              <li><RouterLink to={pricingPathFor("Properties for Rent in Ahmedabad", "rentals")} state={pricingStateFromLabel("Properties for Rent in Ahmedabad", "rentals")} className="hover:text-white transition-colors">Rent Property</RouterLink></li>
              <li><RouterLink to="/enquiry" className="hover:text-white transition-colors">Sell Property</RouterLink></li>
              <li><RouterLink to="/services" className="hover:text-white transition-colors">Services</RouterLink></li>
              <li><RouterLink to="/blog" className="hover:text-white transition-colors">Property Guides</RouterLink></li>
              <li><RouterLink to="/properties" className="hover:text-white transition-colors">Properties</RouterLink></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><RouterLink to="/about" className="hover:text-white transition-colors">About Us</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-white transition-colors">Contact Us</RouterLink></li>
              <li><RouterLink to="/services" className="hover:text-white transition-colors">Services</RouterLink></li>
              <li><RouterLink to="/blog" className="hover:text-white transition-colors">Property Guides</RouterLink></li>
              <li><RouterLink to="/properties" className="hover:text-white transition-colors">Properties</RouterLink></li>
              <li><RouterLink to="/stafflogin" className="hover:text-white transition-colors">Staff Login</RouterLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 sm:mb-6">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin size={14} className="sm:size-[18px] text-blue-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="break-words">{contact.address}</span>
              </li>
              {contactPhones.length > 0 && (
                <li className="flex items-center gap-2 sm:gap-3">
                  <Phone size={14} className="sm:size-[18px] text-blue-500 flex-shrink-0" />
                  <span className="flex flex-col gap-1 leading-relaxed">
                    {contactPhones.map((phone) => (
                      <span key={phone} className="break-words">{phone}</span>
                    ))}
                  </span>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2 sm:gap-3">
                  <Mail size={14} className="sm:size-[18px] text-blue-500 flex-shrink-0" />
                  <span>{contact.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-center sm:text-left">{contact.footerCopyright || defaultContactContent.footerCopyright}</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <RouterLink to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</RouterLink>
            <RouterLink to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</RouterLink>
            <RouterLink to="/contact" className="hover:text-white transition-colors">Contact Us</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
