const agents = [
  {
    name: "Vikram Patel",
    city: "Vadodara",
    image: "/a1.jpg",
  },
  {
    name: "Rakesh Dahiyal",
    city: "Vadodara",
    image: "/a2.jpg",
  },
];

export default function Agents() {
  return (
    <div className="w-full bg-#F5F8FF py-20 px-6 md:px-12 lg:px-20">

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
          Our Experts
        </p>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          Meet our Experts Agents in Ahmedabad
        </h2>

        <p className="text-gray-500 mt-3">
          Connect with our certified real estate professionals across India
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-8 flex-wrap">

        {agents.map((agent, i) => (
          <div
            key={i}
            className="w-[300px] bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow mb-4">
              <img
                src={agent.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900">
              {agent.name},{" "}
              <span className="text-gray-500 text-sm font-normal">
                {agent.city}
              </span>
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Experienced real estate professional with extensive knowledge of
              local market trends and property investment opportunities across India.
            </p>

            {/* Link */}
            <button className="text-blue-600 text-sm font-medium mt-4 hover:underline">
              View Agent Profile →
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}