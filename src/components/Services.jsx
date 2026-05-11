import { FileText, ShieldCheck, TrendingUp, Headphones } from "lucide-react";

const services = [
  {
    icon: <FileText size={20} />,
    title: "Legal Assistance",
    desc: "Get expert legal support for all your property documentation and registration needs",
    bg: "bg-blue-100 text-blue-600",
    stat: "Docs",
    layout: "min-h-44",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Verified Listings",
    desc: "All properties are thoroughly verified for authenticity and legal compliance",
    bg: "bg-purple-100 text-purple-600",
    stat: "100%",
    layout: "min-h-72 row-span-2",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Property Valuation",
    desc: "Accurate market analysis and property valuation from certified experts",
    bg: "bg-green-100 text-green-600",
    stat: "Market",
    layout: "min-h-72 row-span-2",
  },
  {
    icon: <Headphones size={20} />,
    title: "24/7 Support",
    desc: "Round-the-clock customer support to assist you at every step of your journey",
    bg: "bg-orange-100 text-orange-600",
    stat: "24/7",
    layout: "min-h-44",
  },
];

export default function Services() {
  return (
    <section className="w-full overflow-hidden bg-white py-12 sm:py-16">
      <div className="wf-container">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">
            Our Services
          </p>

          <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
            Why Choose Akshar Estate The Property HUB
          </h2>

          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            Expert help for verification, valuation, legal checks, and property visits across Gujarat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.title}
              className={`wf-card wf-card-hover flex flex-col justify-between p-4 sm:p-6 lg:min-h-64 ${s.layout}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${s.bg}`}>
                  {s.icon}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 sm:px-3 sm:text-[11px]">
                  {s.stat}
                </span>
              </div>

              <div>
                <h3 className="mt-5 text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl lg:text-lg">
                  {s.title}
                </h3>

                <p className="mt-2 hidden text-sm leading-relaxed text-slate-500 sm:block">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 h-1.5 rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-blue-600/80" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
