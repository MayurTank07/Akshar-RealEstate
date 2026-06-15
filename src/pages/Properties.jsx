import Hero from "../compswest/Hero";
import Footer from "../components/Footer";

export default function PropertiesPage() {
  return (
    <div>
      <Hero category="Buy" type="All" city="All" filters={{ activeCity: "All", activeType: "All", query: "", searchType: "Buy" }} />
      <Footer />
    </div>
  );
}
