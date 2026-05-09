import agents from "../data/agents.json";

export default function Agents() {
  return (
    <div className="w-full bg-[#F5F8FF] py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20">

      {/* Header */}
      <div className="max-w-3xl mb-8 sm:mb-12 text-center sm:text-left">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
          Our Experts
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          Meet our Expert Agents in Ahmedabad
        </h2>

        <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
          Connect with our certified real estate professionals across India
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition group"
          >

            {/* Avatar */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow mb-3 sm:mb-4 mx-auto sm:mx-0">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 text-center sm:text-left">
              {agent.name},{" "}
              <span className="text-gray-500 text-sm font-normal block sm:inline">
                {agent.city}
              </span>
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 mt-2 sm:mt-3 leading-relaxed text-center sm:text-left line-clamp-3 sm:line-clamp-none">
              Experienced real estate professional with extensive knowledge of
              local market trends and property investment opportunities across India.
            </p>

            {/* Link */}
            <button className="text-blue-600 text-sm font-medium mt-3 sm:mt-4 hover:underline w-full sm:w-auto text-center">
              View Agent Profile →
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}