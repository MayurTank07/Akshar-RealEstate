import Hero from "../compswest/Hero";
import Footer from "../components/Footer";

export default function NewProjects() {
  return (
    <div>
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
