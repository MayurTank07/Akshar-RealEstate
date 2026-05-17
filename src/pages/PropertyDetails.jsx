import { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import properties from "../data/properties.json";
import Hero from "../componetswest/Hero";
import Amenities from "../componetswest/Amenities";
import MapForm from "../componetswest/MapForm";
import Footer from "../components/Footer";
import { publicApi } from "../services/api";

export default function PropertyDetails() {
  const location = useLocation();
  const { id } = useParams();
  const initialProperty = location.state?.property || properties.find(p => p.id === parseInt(location.pathname.split('/').pop()));
  const remoteId = id || (/^[a-f\d]{24}$/i.test(initialProperty?._id || "") ? initialProperty._id : null);
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(Boolean(remoteId));

  useEffect(() => {
    if (!remoteId) return;
    let active = true;
    publicApi
      .property(remoteId)
      .then((response) => {
        if (active) setProperty(response.data);
      })
      .catch(() => {
        if (active && !initialProperty) setProperty(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialProperty, remoteId]);
  
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
            to="/pricing"
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
      {/* Hero Section from componetswest */}
      <Hero property={property} />

      {/* Map Form Section from componetswest */}
      <MapForm property={property} />

      {/* Amenities Section from componetswest */}
      <Amenities property={property} />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/pricing"
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
