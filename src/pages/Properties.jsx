import Hero from "../compswest/Hero";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

export default function PropertiesPage() {
  return (
    <div>
      <Hero
        category="Buy"
        type="All"
        city="All"
        filters={{ activeCity: "All", activeType: "All", query: "", searchType: "Buy" }}
        intro={(
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties" }]} />
          </div>
        )}
      />
      <Footer />
    </div>
  );
}
