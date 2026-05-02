export default function Stats() {
  const stats = [
    { value: "10K+", label: "Happy Clients" },
    { value: "15K+", label: "Properties Sold" },
    { value: "4.9", label: "Average Rating" },
    { value: "25+", label: "Years Experience" },
  ];

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