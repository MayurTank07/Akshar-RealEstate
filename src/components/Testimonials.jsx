import useSiteContent from "../hooks/useSiteContent";
import { defaultHomeSectionsContent } from "../config/navigationContent";

export default function Testimonials() {
  const { homeSectionsContent } = useSiteContent();
  const section = { ...defaultHomeSectionsContent.testimonials, ...(homeSectionsContent?.testimonials || {}) };
  const testimonials = (Array.isArray(section.items) ? section.items : defaultHomeSectionsContent.testimonials.items).filter((item) => item.enabled !== false);
  if (!testimonials.length) return null;

  return (
    <div className="w-full bg-white py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20">

      {/* Header */}
      <div className="max-w-3xl mb-8 sm:mb-12 text-center sm:text-left">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
          {section.eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          {section.title}
        </h2>

        <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
          {section.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((t) => (
          <div
            key={`${t.name}-${t.role}`}
            className="bg-gray-50 sm:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full"
          >

            {/* Stars */}
            <div className="flex text-yellow-400 mb-2 sm:mb-3 justify-center sm:justify-start">
              {"★".repeat(Math.max(1, Math.min(5, Number(t.rating || 5)))).split("").map((_, i) => (
                <span key={i} className="text-sm sm:text-base">★</span>
              ))}
            </div>

            {/* Text */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">
              "{t.text}"
            </p>

            {/* User */}
            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {t.name}
                </p>
                <p className="text-xs text-gray-500">
                  {t.role}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
