import Hero from "../componetswest/Hero";
import Map from "../componetswest/MapForm";
import Amenities from "../componetswest/Amenities";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div>
        <Hero />   
        <Map /> 
        <Amenities />     
        <Footer />
    </div>
    );
}