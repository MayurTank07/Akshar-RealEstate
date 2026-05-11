import { useEffect } from "react";

export default function WhatWeDo() {
  useEffect(() => {
    if (window.location.hash === "#what-we-do") {
      requestAnimationFrame(() => {
        document.getElementById("what-we-do")?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  const cards = [
    {
      title: "Guided Site Visits",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
      className: "col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-2",
    },
    {
      title: "Verified Documents",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000",
      className: "col-span-1 md:col-span-1",
    },
    {
      title: "Strategy Sessions",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000",
      className: "col-span-1 md:col-span-1",
    },
    {
      title: "Virtual Tours",
      image: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&q=80&w=1000",
      className: "col-span-2 md:col-span-1 lg:col-span-2",
      video: true,
    },
  ];

  return (
    <section id="what-we-do" className="scroll-mt-24 bg-white py-12 sm:py-16">
      <div className="wf-container">
        <div className="mb-7 max-w-4xl sm:mb-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            What we do
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Real estate guidance from search to closing
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            We make buying, selling, and investing simpler with verified listings, site visits,
            document checks, virtual tours, and market-backed advisory.
          </p>
        </div>

        <div className="grid grid-cols-3 auto-rows-[118px] gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:auto-rows-[150px] md:grid-cols-2 md:auto-rows-[220px] md:gap-4 md:border-0 md:bg-transparent md:p-0 lg:grid-cols-4 lg:auto-rows-[230px]">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group relative min-h-0 overflow-hidden rounded-2xl shadow-sm ${card.className || ""}`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
              {card.video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-2xl transition group-hover:scale-105 sm:h-14 sm:w-14">
                    <div className="ml-1 h-0 w-0 border-b-[9px] border-l-[15px] border-t-[9px] border-b-transparent border-l-blue-600 border-t-transparent" />
                  </div>
                </div>
              )}
              <p className="absolute bottom-4 left-4 right-4 text-sm font-extrabold leading-tight text-white sm:bottom-5 sm:left-5 sm:right-5 sm:text-lg">
                {card.title}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
