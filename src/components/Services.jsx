import { FileText, ShieldCheck, TrendingUp, Headphones } from "lucide-react";

const services = [
  {
    icon: <FileText size={20} />,
    title: "Legal Assistance",
    desc: "Get expert legal support for all your property documentation and registration needs",
    bg: "bg-blue-100 text-blue-600",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Verified Listings",
    desc: "All properties are thoroughly verified for authenticity and legal compliance",
    bg: "bg-purple-100 text-purple-600",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Property Valuation",
    desc: "Accurate market analysis and property valuation from certified experts",
    bg: "bg-green-100 text-green-600",
  },
  {
    icon: <Headphones size={20} />,
    title: "24/7 Support",
    desc: "Round-the-clock customer support to assist you at every step of your journey",
    bg: "bg-orange-100 text-orange-600",
  },
];

export default function Services() {
  return (
    <div className="w-full bg-#fffff py-20 px-6 md:px-12 lg:px-20">

      {/* Header */}
      <div className="mb-12 max-w-4xl">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
          Our Services
        </p>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          Why Choose Westfield
        </h2>

        <p className="text-gray-500 mt-3">
          We provide comprehensive services to make your property journey
          seamless and stress-free
        </p>
      </div>

      {/* Cards FULL WIDTH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >

            {/* Icon */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${s.bg}`}>
              {s.icon}
            </div>

            {/* Title */}
            <h3 className="mt-5 font-semibold text-gray-900 text-lg">
              {s.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {s.desc}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}