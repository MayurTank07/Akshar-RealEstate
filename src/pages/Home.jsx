// pages/Home.jsx
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Properties from "../components/Properties";
import PropertyTypes from "../components/PropertyTypes";
import Services from "../components/Services";
import WhatWeDo from "../components/WhatWeDo";
import Videos from "../components/Videos";
import Agents from "../components/Agents";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import QuickPropertySearch from "../components/QuickPropertySearch";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhatWeDo/>
      <PropertyTypes />
      <Services/>
      <Properties />
      <Videos/>
      <Agents/>
      <Testimonials/>
      <Stats/>
      <QuickPropertySearch/>
      <Footer />
    </div>
  );
}