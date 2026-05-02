import React from 'react';
import { FileText, TrendingUp, ShieldCheck, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
  const services = [
    {
      title: "Legal Assistance",
      description: "Get expert legal support for all your property documentation and registration needs",
      icon: <FileText className="text-blue-600" size={24} />,
      iconBg: "bg-blue-50",
    },
    {
      title: "Property Valuation",
      description: "Accurate market analysis and property valuation from certified experts",
      icon: <TrendingUp className="text-green-600" size={24} />,
      iconBg: "bg-green-50",
    },
    {
      title: "Verified Listings",
      description: "All properties are thoroughly verified for authenticity and legal compliance",
      icon: <ShieldCheck className="text-purple-600" size={24} />,
      iconBg: "bg-purple-50",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you at every step of your journey",
      icon: <Headphones className="text-orange-500" size={24} />,
      iconBg: "bg-orange-50",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            We provide comprehensive services to make your property journey seamless
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="p-8 border border-slate-100 rounded-2xl bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                {service.icon}
              </div>
              
              {/* Text Content */}
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;