import { useLocation } from "react-router-dom";
import Hero from "../compswest/Hero";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

export default function Pricing() {
  const location = useLocation();
  const { category, type, city, filters } = location.state || {};

  return (
    <div>
      <Hero
        key={`${location.pathname}-${JSON.stringify(location.state || {})}`}
        category={category}
        type={type}
        city={city}
        filters={filters}
        intro={(
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }, { label: type || category || "Property Search" }]} />
          </div>
        )}
      />
      <Footer />
    </div>
  );
}
