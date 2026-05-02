import Hero from "../HousingComponents/Hero";
import PropertTypes from "../HousingComponents/Propertytypes";
import Propertycard from "../HousingComponents/PropertyCard";
import WhyChooseUs from "../HousingComponents/WhyChooseUs";
import Footer from "../HousingComponents/Footer";

export default function Home() {
  return (
    <div>
        <Hero />
        <PropertTypes />
        <Propertycard />
        <WhyChooseUs />
        <Footer />
    </div>
  );
}