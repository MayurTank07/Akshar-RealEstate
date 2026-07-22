import { Navigate, useParams } from "react-router-dom";
import Hero from "../compswest/Hero";
import Footer from "../components/Footer";
import { getBhkIntentPage, getPropertyTypeIntentPage, getSaleLandingPage, landingStateForPage } from "../config/locationLandingPages";

export default function LocationLanding({ typePrefix = "" }) {
  const { region, locality, intent, typeLocation } = useParams();
  const page = typePrefix
    ? getPropertyTypeIntentPage(typePrefix, typeLocation)
    : intent
      ? getBhkIntentPage(region, locality, intent)
      : getSaleLandingPage(region, locality);
  if (!page) return <Navigate to="/properties" replace />;
  const state = landingStateForPage(page);

  return (
    <div>
      <Hero key={page.path} category={state.category} type={state.type} city={state.city} filters={state.filters} />
      <Footer />
    </div>
  );
}
