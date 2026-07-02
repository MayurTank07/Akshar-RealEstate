import { Play } from "lucide-react";
import useSiteContent from "../hooks/useSiteContent";
import { defaultHomeSectionsContent } from "../config/navigationContent";

export default function Videos() {
  const { homeSectionsContent } = useSiteContent();
  const section = { ...defaultHomeSectionsContent.videos, ...(homeSectionsContent?.videos || {}) };
  const videos = (Array.isArray(section.items) ? section.items : defaultHomeSectionsContent.videos.items).filter((item) => item.enabled !== false);
  if (!videos.length) return null;

  return (
    <div className="w-full bg-gray-100 py-16">

      {/* Header */}
      <div className="px-6 md:px-12 lg:px-20 pb-8">
        {section.eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {section.eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          {section.title}
        </h2>
        <p className="text-gray-500 mt-2">
          {section.subtitle}
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-12 lg:px-20">

        {videos.map((v, i) => (
          <div key={i} className="flex flex-col">

            {/* Video Card */}
            <a href={v.url || "#"} className="relative h-64 rounded-2xl overflow-hidden group block" onClick={(event) => !v.url && event.preventDefault()}>

              <img
                src={v.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer">
                  <Play size={22} />
                </div>
              </div>

              {/* Text Overlay */}
              {v.overlay && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm">
                    {v.overlay}
                  </p>
                  {v.button && (
                    <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition">
                      {v.button}
                    </button>
                  )}
                </div>
              )}

            </a>

            {/* Info */}
            <div className="mt-3">
              <h3 className="font-medium text-gray-900">
                {v.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {v.location}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          ←
        </button>
        <button className="w-10 h-10 border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
          →
        </button>
      </div>

    </div>
  );
}
