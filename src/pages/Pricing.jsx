import { useLocation } from "react-router-dom";
import Hero from "../compswest/Hero";
import Footer from "../components/Footer";

export default function Pricing() {
  const location = useLocation();
  const { category, type, city, filters } = location.state || {};

  return (
    <div>
      <Hero key={`${location.pathname}-${JSON.stringify(location.state || {})}`} category={category} type={type} city={city} filters={filters} />
      <Footer />
    </div>
  );
}
