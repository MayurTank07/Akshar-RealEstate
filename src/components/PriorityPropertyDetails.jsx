import { priorityPropertySeo } from "../config/priorityPropertySeo";

const commonDocuments = [
  "Seller identity and authority to sell",
  "Current title and ownership chain",
  "Latest price, dues and availability",
  "Exact site boundaries and access",
];

function documentsToCheck(property) {
  const type = String(property.type || property.propertyType || "").toLowerCase();
  if (/agricult|farm|land/.test(type)) return [...commonDocuments, "Survey number and latest 7/12 or applicable land record", "Agricultural zoning, permitted use and transfer eligibility", "Water, electricity and approach-road status"];
  if (/plot/.test(type)) return [...commonDocuments, "Approved layout and plot measurement", "NA/NOC, zoning and development permission where applicable", "Road width, utilities and possession timeline"];
  return [...commonDocuments, "RERA and sanctioned-plan details where applicable", "Carpet area, parking and possession commitment", "Maintenance, taxes and total purchase cost"];
}

export default function PriorityPropertyDetails({ property }) {
  const seo = priorityPropertySeo(property);
  if (!seo) return null;
  const documents = documentsToCheck(property);
  const faqs = [
    ["What are the key details of this property?", seo.answer],
    ["What should be verified before a site visit?", `${documents.join("; ")}.`],
    ["Is the price and availability final?", "Price, availability and transaction terms can change. Confirm the latest details with Akshar Estate before travelling, paying a token or signing any document."],
  ];
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 text-slate-800 sm:px-6 lg:px-8" aria-label="Property buying guidance">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-slate-950">Quick Answer</h2>
        <p className="mt-3 leading-7">{seo.answer}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-950">Documents to Check</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-6">{documents.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-950">Site Visit Guidance</h2>
          <p className="mt-3 leading-7">Confirm the latest availability, asking price, meeting point and assigned supervisor before travelling. During the visit, compare the physical boundaries, road access, surroundings and utilities with the listing and available documents.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-950">Frequently Asked Questions</h2>
        <div className="mt-3 divide-y divide-slate-200">{faqs.map(([question, answer]) => (
          <details key={question} className="py-3">
            <summary className="cursor-pointer font-semibold">{question}</summary>
            <p className="mt-2 leading-7 text-slate-700">{answer}</p>
          </details>
        ))}</div>
      </div>
    </section>
  );
}
