import { Link } from "react-router-dom";

const priorityLocations = [
  ["Gandhinagar", "/properties-for-sale/gandhinagar"],
  ["Kudasan", "/properties-for-sale/gandhinagar/kudasan"],
  ["Sargasan", "/properties-for-sale/gandhinagar/sargasan"],
  ["GIFT City", "/properties-for-sale/gandhinagar/gift-city"],
  ["Ahmedabad", "/properties-for-sale/ahmedabad"],
  ["Bopal", "/properties-for-sale/ahmedabad/bopal"],
  ["South Bopal", "/properties-for-sale/ahmedabad/south-bopal"],
  ["Shela", "/properties-for-sale/ahmedabad/shela"],
  ["Science City", "/properties-for-sale/ahmedabad/science-city"],
  ["Sanand", "/properties-for-sale/ahmedabad/sanand"],
];

export default function PriorityLocationLinks() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Priority Locations</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Explore Property by Location</h2>
          </div>
          <Link to="/properties" className="text-sm font-bold text-blue-700 transition hover:text-blue-900">
            All Akshar Estate properties
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {priorityLocations.map(([name, href]) => (
            <Link
              key={name}
              to={href}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Properties for sale in {name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
