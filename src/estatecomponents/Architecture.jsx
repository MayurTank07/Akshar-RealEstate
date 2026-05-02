import React from 'react';

const ArchitecturalSeries = () => {
  const collections = [
    {
      title: "The Glass Pavilion",
      subtitle: "New Arrival",
      description: "An exploration of light and transparency in the heart of the hills.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      gridClass: "md:col-span-2",
      tagColor: "text-emerald-400"
    },
    {
      title: "Urban Loft Living",
      subtitle: "",
      description: "Industrial roots meet refined modern comfort.",
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800",
      gridClass: "md:col-span-1",
      tagColor: ""
    }
  ];

  return (
    <section className="bg-white py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2">
              Curated Collections
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              The Architectural Series
            </h2>
          </div>
          <a 
            href="#" 
            className="text-indigo-600 text-sm font-semibold border-b-2 border-indigo-100 hover:border-indigo-600 transition-all pb-1"
          >
            View all editions
          </a>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((item, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto ${item.gridClass} h-[500px] cursor-pointer`}
            >
              {/* Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                {item.subtitle && (
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${item.tagColor}`}>
                    {item.subtitle}
                  </p>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitecturalSeries;