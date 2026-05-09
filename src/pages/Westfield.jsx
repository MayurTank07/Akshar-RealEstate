import { useLocation, Link } from "react-router-dom";
import properties from "../data/properties.json";
import Hero from "../componetswest/Hero";
import Amenities from "../componetswest/Amenities";
import MapForm from "../componetswest/MapForm";
import Footer from "../components/Footer";

export default function Westfield() {
  const location = useLocation();
  
  // Get property from navigation state first, then fallback to URL params
  const property = location.state?.property || properties.find(p => p.id === parseInt(location.pathname.split('/').pop()));
  
  // Handle property not found
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
      <MapForm />

      {/* Amenities Section from componetswest */}
      <Amenities />

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