import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Hero from "../componetswest/Hero";
import Amenities from "../componetswest/Amenities";
import MapForm from "../componetswest/MapForm";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { publicApi } from "../services/api";
import useAuth from "../contexts/useAuth";
import {
  generateWhatsAppLink,
  normalizeEnquirerName,
  propertyWhatsAppMessage,
  propertyWhatsAppNumber,
  saveEnquirerName,
  storedEnquirerName,
  userDisplayName,
  validateEnquirerName,
} from "../utils/whatsapp";
import { sanitizePublicProperty } from "../utils/propertyData";
import { syncPropertySeo } from "../utils/propertySeo";
import { trackPropertyEvent } from "../utils/analytics";

export default function PropertyDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const autoWhatsAppHandled = useRef(false);
  const pageViewTracked = useRef("");
  const initialProperty = useMemo(
    () => sanitizePublicProperty(location.state?.property),
    [location.state?.property]
  );
  const remoteId = /^[a-f\d]{24}$/i.test(id || "")
    ? id
    : (/^[a-f\d]{24}$/i.test(initialProperty?._id || "") ? initialProperty._id : null);
  const remoteSlug = id && !remoteId ? id : null;
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(Boolean(remoteId || remoteSlug));
  const [namePrompt, setNamePrompt] = useState({ open: false, name: storedEnquirerName(), error: "" });

  useEffect(() => {
    if (!remoteId && !remoteSlug) return;
    let active = true;
    const loader = remoteId ? publicApi.property(remoteId) : publicApi.propertyBySlug(remoteSlug);
    loader
      .then((response) => {
        if (!active) return;
        const nextProperty = sanitizePublicProperty(response.data);
        setProperty(nextProperty);
        if (nextProperty?.slug && (remoteId || (remoteSlug && nextProperty.slug !== remoteSlug))) {
          navigate(`/property/${nextProperty.slug}`, { replace: true, state: { property: nextProperty } });
        }
      })
      .catch(() => {
        if (active) setProperty((current) => current || null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [navigate, remoteId, remoteSlug]);

  useEffect(() => syncPropertySeo(property), [property]);
  useEffect(() => {
    const key = property?.slug || property?._id || "";
    if (!key || pageViewTracked.current === key) return;
    pageViewTracked.current = key;
    trackPropertyEvent("property_page_view", property);
  }, [property]);

  const whatsappNumber = propertyWhatsAppNumber(property);
  const whatsappAvailable = Boolean(generateWhatsAppLink(whatsappNumber, "Hello"));
  const enquirerName = () => userDisplayName(user) || storedEnquirerName();

  const openPropertyWhatsApp = (rawName) => {
    const name = normalizeEnquirerName(rawName);
    const error = validateEnquirerName(name);
    if (error) {
      setNamePrompt({ open: true, name, error });
      return;
    }
    const link = generateWhatsAppLink(whatsappNumber, propertyWhatsAppMessage(property, { customerName: name }));
    if (!link) return;
    trackPropertyEvent("supervisor_contacted", property, { formType: "whatsapp" });
    saveEnquirerName(name);
    setNamePrompt({ open: false, name, error: "" });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const requestWhatsAppEnquiry = () => {
    if (!whatsappAvailable) return;
    const name = enquirerName();
    const error = validateEnquirerName(name);
    if (error) {
      setNamePrompt({ open: true, name, error: "" });
      return;
    }
    openPropertyWhatsApp(name);
  };

  useEffect(() => {
    if (!property || autoWhatsAppHandled.current || !location.state?.triggerWhatsApp) return;
    autoWhatsAppHandled.current = true;
    window.setTimeout(requestWhatsAppEnquiry, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, location.state?.triggerWhatsApp]);
  
  // Handle property not found
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-slate-500 font-bold">Loading property...</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
          <Link 
            to="/properties"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          property.city && { label: property.city, href: `/properties-for-sale/${String(property.city).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}` },
          property.location && { label: property.location, href: `/properties-for-sale/${String(property.city || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}/${String(property.location).toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}` },
          { label: property.title || "Property Details" },
        ]} />
      </div>
      {/* Hero Section from componetswest */}
      <Hero property={property} whatsappAvailable={whatsappAvailable} onWhatsAppEnquiry={requestWhatsAppEnquiry} />

      {/* Map Form Section from componetswest */}
      <MapForm property={property} />

      {/* Amenities Section from componetswest */}
      <Amenities property={property} whatsappAvailable={whatsappAvailable} onWhatsAppEnquiry={requestWhatsAppEnquiry} />

      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
        >
          ← Back to Properties
        </Link>
      </div>

      {/* Footer */}
      <Footer />
      <WhatsAppNamePrompt
        state={namePrompt}
        onChange={(name) => setNamePrompt((current) => ({ ...current, name, error: "" }))}
        onClose={() => setNamePrompt((current) => ({ ...current, open: false, error: "" }))}
        onSubmit={() => openPropertyWhatsApp(namePrompt.name)}
      />
    </div>
  );
}

function WhatsAppNamePrompt({ state, onChange, onClose, onSubmit }) {
  if (!state.open) return null;
  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Enter your name</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Enter your name to continue with the WhatsApp enquiry.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close WhatsApp name prompt">
            x
          </button>
        </div>
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700">Your name</span>
            <input
              autoFocus
              className="wf-input"
              value={state.name}
              onChange={(event) => onChange(event.target.value)}
              placeholder="e.g. Mayur Tank"
            />
          </label>
          {state.error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{state.error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary">Cancel</button>
            <button type="submit" className="wf-btn bg-[#25D366] text-white hover:bg-[#1ebe5d]">Continue to WhatsApp</button>
          </div>
        </form>
      </div>
    </div>
  );
}
