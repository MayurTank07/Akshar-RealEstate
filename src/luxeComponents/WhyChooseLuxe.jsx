import React from "react";
import { FileText, TrendingUp, ShieldCheck, Headphones } from "lucide-react";

const services = [
  {
    title: "Legal Assistance",
    desc: "Get expert legal support for all your property documentation and registration needs",
    icon: FileText,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Property Valuation",
    desc: "Accurate market analysis and property valuation from certified experts",
    icon: TrendingUp,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Verified Listings",
    desc: "All properties are thoroughly verified for authenticity and legal compliance",
    icon: ShieldCheck,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    title: "24/7 Support",
    desc: "Round-the-clock customer support to assist you at every step of your journey",
    icon: Headphones,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
];

const ServiceCard = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition duration-200 w-[300px]">
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${service.color}`} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-gray-800 mb-2">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[12px] text-gray-400 leading-relaxed">
        {service.desc}
      </p>
    </div>
  );
};

const WhyChoose = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-[11px] text-purple-500 font-semibold uppercase tracking-wide">
          Our Services
        </p>

        <h2 className="text-[24px] font-semibold text-gray-900 mt-1">
          Why Choose LuxeEstate
        </h2>

        <p className="text-[13px] text-gray-400 mt-3">
          We provide comprehensive services to make your property journey seamless and stress-free
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 justify-center max-w-3xl mx-auto">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>

    </div>
  );
};

export default WhyChoose;