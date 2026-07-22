import { Navigate, useParams } from "react-router-dom";
import Hero from "../compswest/Hero";
import Footer from "../components/Footer";
import { getSaleLandingPage, landingStateForPage } from "../config/locationLandingPages";

export default function LocationLanding() {
  const { region, locality } = useParams();
  const page = getSaleLandingPage(region, locality);
  if (!page) return <Navigate to="/properties" replace />;
  const state = landingStateForPage(page);

  return (
    <div>
      <Hero key={page.path} category={state.category} type={state.type} city={state.city} filters={state.filters} />
      <Footer />
    </div>
  );
}
