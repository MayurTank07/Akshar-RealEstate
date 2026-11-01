import { Link } from "react-router-dom";

const searchGroups = [
  {
    title: "Popular Sale Searches",
    dotClass: "bg-[#16a34a]",
    items: [
      ["Properties for Sale in Gandhinagar", "/properties-for-sale/gandhinagar"],
      ["Properties for Sale in Ahmedabad", "/properties-for-sale/ahmedabad"],
      ["Plots for Sale in Gandhinagar", "/plots-for-sale/gandhinagar"],
      ["Plots for Sale in Ahmedabad", "/plots-for-sale/ahmedabad"],
      ["Flats for Sale in Gandhinagar", "/flats-for-sale/gandhinagar"],
    ],
  },
  {
    title: "Land & Plot Searches",
    dotClass: "bg-[#a1a111]",
    items: [
      ["Agricultural Land for Sale in Gandhinagar", "/agricultural-land-for-sale/gandhinagar"],
      ["Agricultural Land for Sale in Viramgam", "/agricultural-land-for-sale/viramgam"],
      ["Agricultural Land for Sale in Dashela", "/agricultural-land-for-sale/dashela"],
      ["Agricultural Land for Sale in Jhakhora", "/agricultural-land-for-sale/jhakhora"],
      ["Agricultural Land for Sale in Dhanap", "/agricultural-land-for-sale/dhanap"],
    ],
  },
  {
    title: "Local Property Searches",
    dotClass: "bg-[#0ea5e9]",
    items: [
      ["Plots for Sale in Palaj", "/plots-for-sale/palaj"],
      ["Plots for Sale in Viramgam", "/plots-for-sale/viramgam"],
      ["4 BHK Apartments in Palaj", "/properties-for-sale/gandhinagar/palaj/4-bhk"],
      ["Properties for Sale in Memnagar", "/properties-for-sale/ahmedabad/memnagar"],
      ["Properties for Sale in Dhanap", "/properties-for-sale/gandhinagar/dhanap"],
    ],
  },
];

const Card = ({ group }) => (
  <div className="wf-card wf-card-hover w-full overflow-hidden">
    <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
      <span className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${group.dotClass}`} />
      <h3 className="font-bold text-[#111827] text-sm sm:text-[15px]">{group.title}</h3>
    </div>
    <div className="flex flex-col gap-2 p-4 sm:p-6">
      {group.items.map(([label, href]) => (
        <Link
          key={href}
          to={href}
          className="w-full cursor-pointer rounded-xl border border-transparent px-3 py-2.5 text-left text-xs leading-snug text-slate-600 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 sm:px-4 sm:py-3.5 sm:text-sm"
        >
          <span className="line-clamp-2 sm:line-clamp-none">{label}</span>
        </Link>
      ))}
    </div>
  </div>
);

const QuickPropertySearch = () => (
  <section className="bg-white py-14 sm:py-16">
    <div className="wf-container">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl md:text-[36px]">Quick Property Searches</h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">Find properties by popular searches</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {searchGroups.map((group) => <Card key={group.title} group={group} />)}
      </div>
    </div>
  </section>
);

export default QuickPropertySearch;
