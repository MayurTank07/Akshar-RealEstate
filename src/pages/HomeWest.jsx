import Navbar2 from "../components/Navbar2";
import Hero from "../components/Hero";
import Properties from "../components/Properties";
import PropertyTypes from "../components/PropertyTypes";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import Footer from "../components/Footer";



export default function Home() {
  return (
    <div>
      <Navbar2 />
      <Hero />
      <PropertyTypes />
      <Properties />
      <Services/>
      <Testimonials/>
      <Stats/>
      <Footer />
    </div>
  );
}