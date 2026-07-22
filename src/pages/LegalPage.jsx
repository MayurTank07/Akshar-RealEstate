import { ShieldCheck, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

const legalContent = {
  privacy: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    subtitle: "How Akshar Estate The Property HUB collects, uses, protects, and shares information submitted through our real estate platform.",
    icon: ShieldCheck,
    updated: "Last updated: 27 May 2026",
    sections: [
      {
        title: "Information We Collect",
        body: "We may collect your name, mobile number, email address, preferred location, property budget, property type, and enquiry notes when you submit a form, contact our team, save a property, or request details about a listing.",
      },
      {
        title: "Property Enquiry Data",
        body: "When you enquire about a property, we use the details you provide to understand your requirement, contact you, recommend suitable listings, and coordinate follow-up with our internal team or assigned supervisor.",
      },
      {
        title: "Contact Details Usage",
        body: "Your phone number, WhatsApp number, and email address may be used to respond to enquiries, send property updates, share service confirmations, and provide service-related communication. We do not sell your contact details to unrelated third parties.",
      },
      {
        title: "Cookies and Basic Analytics",
        body: "Our website may use basic cookies, browser storage, or analytics tools to improve page performance, remember preferences, understand listing interest, and keep the platform secure.",
      },
      {
        title: "Data Sharing",
        body: "Where required to serve your enquiry, we may share relevant details with property owners, developers, channel partners, agents, supervisors, or internal team members. Shared information is limited to what is reasonably needed for property assistance.",
      },
      {
        title: "Data Security",
        body: "We use reasonable administrative and technical safeguards to protect submitted information. No online system can be guaranteed fully secure, so users should avoid sharing highly sensitive personal or financial information unless specifically required for a verified transaction process.",
      },
      {
        title: "User Rights and Contact",
        body: "You may contact us to correct, update, or request removal of your submitted information where legally and operationally possible. For privacy requests, use the contact details shown on our Contact page.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    subtitle: "The rules and responsibilities for using Akshar Estate The Property HUB website, listings, enquiries, and brokerage services.",
    icon: FileText,
    updated: "Last updated: 27 May 2026",
    sections: [
      {
        title: "Website Usage",
        body: "By using this website, you agree to use it only for lawful property search, enquiry, listing, and real estate service purposes. You must not misuse forms, submit false information, interfere with the platform, or attempt unauthorized access.",
      },
      {
        title: "Property Listing Disclaimer",
        body: "Property details, photos, amenities, measurements, developer information, and availability are provided for general guidance. We try to keep listings accurate, but users should independently verify all details before making any decision.",
      },
      {
        title: "Price and Availability Disclaimer",
        body: "Prices, rent, deposits, brokerage, possession dates, and availability may change without prior notice. Final terms depend on owner/developer confirmation, negotiation, documentation, and applicable taxes or charges.",
      },
      {
        title: "User Enquiry Responsibility",
        body: "You are responsible for submitting accurate contact details and genuine requirements. Akshar Estate The Property HUB may decline or ignore enquiries that appear incomplete, misleading, abusive, or unrelated to property services.",
      },
      {
        title: "Brokerage and Commission",
        body: "Brokerage, commission, service charges, or consulting fees, if applicable, will be communicated based on the property, transaction type, and agreed service scope. Users should confirm fee terms before proceeding with booking, documentation, or other transaction steps.",
      },
      {
        title: "No Guarantee of Deal Closure",
        body: "Submitting an enquiry, reviewing a property, or receiving assistance from our team does not guarantee purchase, sale, rent, lease, loan approval, documentation completion, or final deal closure.",
      },
      {
        title: "Limitation of Liability",
        body: "Akshar Estate The Property HUB is not liable for indirect losses, market changes, owner/developer decisions, third-party delays, user-provided misinformation, or decisions made without independent verification and professional advice.",
      },
      {
        title: "Changes to Terms",
        body: "We may update these terms from time to time. Continued use of the website after changes means you accept the latest version published on this page.",
      },
    ],
  },
};

export default function LegalPage({ type = "privacy" }) {
  const content = legalContent[type] || legalContent.privacy;
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="wf-container pt-32 pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: content.title }]} className="mb-6" />
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.65fr_0.35fr] lg:p-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-blue-300">{content.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{content.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{content.subtitle}</p>
              <p className="mt-6 text-sm font-bold text-slate-400">{content.updated}</p>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/10 text-blue-200 ring-1 ring-white/10">
                <Icon size={44} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {content.sections.map((section, index) => (
            <article key={section.title} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:p-7">
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-sm font-extrabold text-blue-600">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{section.body}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
