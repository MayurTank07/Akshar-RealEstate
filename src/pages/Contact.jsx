import { useMemo } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StructuredData from "../components/StructuredData";
import useSiteContent from "../hooks/useSiteContent";
import { defaultContactContent } from "../config/navigationContent";
import { DEFAULT_WHATSAPP_MESSAGE, generateWhatsAppLink } from "../utils/whatsapp";
import { buildBusinessSchemas } from "../utils/structuredData";

export default function Contact() {
  const siteContent = useSiteContent();
  const contact = useMemo(
    () => ({ ...defaultContactContent, ...(siteContent.contactContent || {}) }),
    [siteContent.contactContent]
  );
  const whatsappLink = generateWhatsAppLink(contact.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_MESSAGE);
  const schema = useMemo(
    () => buildBusinessSchemas({ path: "/contact", pageName: "Contact Akshar Estate", contact }),
    [contact]
  );
  return (
    <div className="min-h-screen bg-slate-50">
      <StructuredData id="contact-business" schema={schema} />
      <Navbar />
      <main className="wf-container grid min-h-[70vh] gap-8 pt-32 pb-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{contact.title}</h1>
          <p className="mt-4 max-w-xl text-slate-600">{contact.subtitle}</p>
        </section>
        <section className="wf-card p-6 shadow-xl">
          <div className="grid gap-4">
            <ContactItem icon={MapPin} label="Office" value={contact.address} />
            <ContactItem icon={Phone} label="Phone" value={contact.phone} />
            {contact.secondaryPhone && <ContactItem icon={Phone} label="Alternate Phone" value={contact.secondaryPhone} />}
            <ContactItem icon={MessageCircle} label="WhatsApp" value={contact.whatsapp} />
            <ContactItem icon={Mail} label="Email" value={contact.email} />
            <ContactItem icon={Clock} label="Office Timing" value={contact.officeTiming} />
          </div>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <MessageCircle size={18} />
              Chat with us on WhatsApp
            </a>
          )}
          {(contact.mapEmbed || contact.mapLink) && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              {contact.mapEmbed ? (
                <iframe title="Akshar Estate office map" src={contact.mapEmbed} className="h-72 w-full" loading="lazy" />
              ) : (
                <a className="block p-5 text-sm font-bold text-blue-600" href={contact.mapLink} target="_blank" rel="noreferrer">Open location in Google Maps</a>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </span>
      <span>
        <span className="block text-sm font-bold text-slate-500">{label}</span>
        <span className="mt-1 block font-semibold text-slate-950">{value}</span>
      </span>
    </div>
  );
}
