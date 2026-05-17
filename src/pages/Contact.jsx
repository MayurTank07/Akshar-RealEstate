import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="wf-container grid min-h-[70vh] gap-8 pt-32 pb-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Let’s discuss your next property move.</h1>
          <p className="mt-4 max-w-xl text-slate-600">Share your requirement and our team will help with verified options across Gujarat.</p>
        </section>
        <section className="wf-card p-6 shadow-xl">
          <div className="grid gap-4">
            <ContactItem icon={MapPin} label="Office" value="SG Highway, Ahmedabad, Gujarat 380054" />
            <ContactItem icon={Phone} label="Phone" value="+91 1800-123-4567" />
            <ContactItem icon={Mail} label="Email" value="info@aksharrealestate.com" />
          </div>
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
