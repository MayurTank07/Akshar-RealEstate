const testimonials = [
  {
    name: "Ananya Desai",
    role: "First-time Buyer",
    image: "/t1.jpg",
    text: "Buying my first home was daunting, but the LuxeEstate team guided me through every step. They were patient, answered all my questions, and made the entire process stress-free.",
  },
  {
    name: "Vikram Patel",
    role: "Commercial Buyer",
    image: "/t2.jpg",
    text: "Excellent service for commercial properties. They understood our business needs and found us the perfect location. Their professionalism and attention to detail are unmatched.",
  },
  {
    name: "Priya Sharma",
    role: "Homeowner",
    image: "/t3.jpg",
    text: "LuxeEstate made finding my dream home incredibly easy. Their team was professional, responsive, and truly understood what I was looking for.",
  },
  {
    name: "Rajesh Kumar",
    role: "Property Investor",
    image: "/t4.jpg",
    text: "As a real estate investor, I've worked with many agencies. LuxeEstate stands out with their market knowledge and transparent approach.",
  },
  {
    name: "Rajesh Kumar",
    role: "Property Investor",
    image: "/t4.jpg",
    text: "As a real estate investor, I've worked with many agencies. LuxeEstate stands out with their market knowledge and transparent approach.",
  },
  {
    name: "Rajesh Kumar",
    role: "Property Investor",
    image: "/t4.jpg",
    text: "As a real estate investor, I've worked with many agencies. LuxeEstate stands out with their market knowledge and transparent approach.",
  },
];

export default function Testimonials() {
  return (
    <div className="w-full bg-#FFFFFF py-20 px-6 md:px-12 lg:px-20">

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
          Testimonials
        </p>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          What Our Clients Say
        </h2>

        <p className="text-gray-500 mt-3">
          Don't just take our word for it. Here's what our valued clients have to say about their experience with us.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >

            {/* Stars */}
            <div className="flex text-yellow-400 mb-3">
              {"★★★★★".split("").map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            {/* Text */}
            <p className="text-gray-600 text-sm leading-relaxed">
              "{t.text}"
            </p>

            {/* User */}
            <div className="flex items-center gap-3 mt-6">

              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={t.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
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