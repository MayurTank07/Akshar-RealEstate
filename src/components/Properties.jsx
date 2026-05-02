// components/Properties.jsx
const properties = [
  {
    title: "Luxury Modern Villa",
    location: "Palm Jumeirah, Dubai",
    price: "₹8.5 Cr",
    beds: 4,
    baths: 3,
    area: "3200 sq.ft",
    tag: "Featured",
    image: "/p1.jpg",
  },
  {
    title: "Contemporary Apartment",
    location: "Bandra West, Mumbai",
    price: "₹2.8 Cr",
    beds: 3,
    baths: 2,
    area: "1850 sq.ft",
    tag: "New",
    image: "/p2.jpg",
  },
  {
    title: "Luxury Villa with Pool",
    location: "Whitefield, Bangalore",
    price: "₹5.2 Cr",
    beds: 5,
    baths: 4,
    area: "4500 sq.ft",
    tag: "Hot",
    image: "/p3.jpg",
  },
  {
    title: "Modern Penthouse",
    location: "Cyber City, Gurgaon",
    price: "₹6.5 Cr",
    beds: 4,
    baths: 3,
    area: "3800 sq.ft",
    tag: "Featured",
    image: "/p4.jpg",
  },
  {
    title: "Residential Tower",
    location: "Andheri East, Mumbai",
    price: "₹1.8 Cr",
    beds: 2,
    baths: 2,
    area: "1200 sq.ft",
    tag: "New",
    image: "/p5.jpg",
  },
  {
    title: "Cozy Family Home",
    location: "Koramangala, Bangalore",
    price: "₹3.2 Cr",
    beds: 3,
    baths: 2,
    area: "2100 sq.ft",
    tag: "Hot",
    image: "/p6.jpg",
  },
];

export default function Properties() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-blue-600 text-xs font-semibold tracking-wider uppercase">
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
              Available Residences
            </h2>
          </div>

          <button className="text-blue-600 text-sm font-medium hover:underline">
            View all listings →
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >

              {/* Image */}
              <div className="relative">
                <img
                  src={p.image}
                  alt=""
                  className="h-52 w-full object-cover"
                />

                {/* Tag */}
                <span
                  className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full text-white ${
                    p.tag === "Featured"
                      ? "bg-blue-500"
                      : p.tag === "New"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {p.tag}
                </span>

                {/* Heart */}
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer">
                  🤍
                </div>
              </div>

              {/* Content */}
              <div className="p-5">

                <h3 className="font-semibold text-lg text-gray-900">
                  {p.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {p.location}
                </p>

                {/* Info */}
                <div className="flex gap-4 text-gray-500 text-sm mt-3">
                  <span>🛏 {p.beds}</span>
                  <span>🛁 {p.baths}</span>
                  <span>📐 {p.area}</span>
                </div>

                {/* Divider */}
                <div className="border-t my-4"></div>

                {/* Price */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-blue-600 font-semibold text-lg">
                      {p.price}
                    </p>
                  </div>

                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    Details →
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            View All Properties
          </button>
        </div>

      </div>
    </div>
  );
}