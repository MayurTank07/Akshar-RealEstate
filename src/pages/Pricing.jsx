import { useLocation } from "react-router-dom";
import Hero from "../compswest/Hero";
import Footer from "../components/Footer";

export default function Pricing() {
  const location = useLocation();
  const { category, type } = location.state || {};

  return (
    <div>
      <Hero category={category} type={type} />
      <Footer />
    </div>
  );
}