import Hero from "../luxeComponents/Hero";
import PropertTypes from "../luxeComponents/Propertytypes";
import AvailableResidencies from "../luxeComponents/AvailableResidencies";
import WhyChoose from "../luxeComponents/WhyChooseLuxe";
import Footer from "../luxeComponents/Footer";



export default function Home() {
  return (
    <div>
        <Hero />    
        <PropertTypes />
        <AvailableResidencies />
        <WhyChoose />
        <Footer />
    </div>
    );  
}