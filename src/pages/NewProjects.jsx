import Hero from "../compswest/Hero";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";

export default function NewProjects() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New Projects" }]} />
      </div>
      <Hero
        category="New Projects"
        type="All"
        city="All"
        filters={{
          activeCity: "All",
          activeType: "All",
          query: "",
          searchType: "New Projects",
          newProject: true,
          intentLabel: "New Projects",
        }}
      />
      <Footer />
    </div>
  );
}
