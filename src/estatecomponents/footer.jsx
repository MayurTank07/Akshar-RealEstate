import React from 'react';

export default function LuxeFooter() {
  const footerLinks = {
    Platform: ["Property Guides", "Market Trends", "Agent Login"],
    Company: ["About Us", "Terms of Use", "Privacy Policy"],
  };

  return (
    <footer className="bg-[#f9f9f9] pt-16 pb-8 px-6 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Logo and Description */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-bold text-gray-900 mb-6">LuxeEstate</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Redefining the real estate landscape through architectural 
              appreciation and data-driven insights.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-gray-400 text-sm hover:text-indigo-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support Section */}
          <div className="lg:col-span-3 lg:flex lg:flex-col lg:items-end">
            <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-6 w-full lg:text-left">
              Support
            </h4>
            <button className="bg-[#1a1a1a] text-white text-xs font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-all w-fit">
              Contact Support
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400 text-[11px] font-medium tracking-tight">
            © 2024 LuxeEstate Digital Architect. Defined by structural integrity.
          </p>
        </div>
      </div>
    </footer>
  );
}