import { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import properties from "../data/properties.json";
import Hero from "../componetswest/Hero";
import Amenities from "../componetswest/Amenities";
import MapForm from "../componetswest/MapForm";
import Footer from "../components/Footer";
import { publicApi } from "../services/api";
import useSiteContent from "../hooks/useSiteContent";
import { defaultContactContent } from "../config/navigationContent";
import { generateWhatsAppLink, propertyWhatsAppMessage } from "../utils/whatsapp";
import { sanitizePublicProperty } from "../utils/propertyData";
import { syncPropertySeo } from "../utils/propertySeo";

export default function PropertyDetails() {
  const location = useLocation();
  const { id } = useParams();
  const initialProperty = useMemo(
    () => sanitizePublicProperty(location.state?.property || properties.find(p => p.id === parseInt(location.pathname.split('/').pop()))),
    [location.pathname, location.state?.property]
  );
  const remoteId = /^[a-f\d]{24}$/i.test(id || "")
    ? id
    : (/^[a-f\d]{24}$/i.test(initialProperty?._id || "") ? initialProperty._id : null);
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(Boolean(remoteId));
  const siteContent = useSiteContent();
  const contact = { ...defaultContactContent, ...(siteContent.contactContent || {}) };

  useEffect(() => {
    if (!remoteId) return;
    let active = true;
    publicApi
      .property(remoteId)
      .then((response) => {
        if (active) setProperty(sanitizePublicProperty(response.data));
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
  }, [remoteId]);

  useEffect(() => syncPropertySeo(property), [property]);
  
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

  const whatsappLink = generateWhatsAppLink(contact.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER, propertyWhatsAppMessage(property));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section from componetswest */}
      <Hero property={property} />

      {/* Map Form Section from componetswest */}
      <MapForm property={property} />

      {/* Amenities Section from componetswest */}
      <Amenities property={property} whatsappLink={whatsappLink} />

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
    </div>
  );
}
