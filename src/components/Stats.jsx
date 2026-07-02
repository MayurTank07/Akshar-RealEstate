import useSiteContent from "../hooks/useSiteContent";
import { defaultHomeSectionsContent } from "../config/navigationContent";

export default function Stats() {
  const { homeSectionsContent } = useSiteContent();
  const section = { ...defaultHomeSectionsContent.stats, ...(homeSectionsContent?.stats || {}) };
  const stats = (Array.isArray(section.items) ? section.items : defaultHomeSectionsContent.stats.items).filter((item) => item.enabled !== false);
  if (!stats.length) return null;

  return (
    <div className="w-full bg-#FFFFFF py-16 px-6 md:px-12 lg:px-20">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

        {stats.map((s, i) => (
          <div key={i}>

            {/* Number */}
            <h3 className="text-3xl md:text-4xl font-semibold text-blue-600">
              {s.value}
            </h3>

            {/* Label */}
            <p className="text-gray-500 text-sm mt-2">
              {s.label}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
