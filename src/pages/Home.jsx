// pages/Home.jsx
import { useMemo } from "react";
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
import StructuredData from "../components/StructuredData";
import useSiteContent from "../hooks/useSiteContent";
import { buildBusinessSchemas } from "../utils/structuredData";


export default function Home() {
  const siteContent = useSiteContent();
  const schema = useMemo(
    () => buildBusinessSchemas({ path: "/", pageName: "Home", contact: siteContent.contactContent }),
    [siteContent.contactContent]
  );

  return (
    <div className="home-page">
      <StructuredData id="home-business" schema={schema} />
      <Navbar />
      <main className="home-motion">
        <Hero />
        <Properties />
        <WhatWeDo/>
        <PropertyTypes />
        <Services/>
        <Videos/>
        <Agents/>
        <Testimonials/>
        <Stats/>
        <QuickPropertySearch/>
      </main>
      <Footer />
    </div>
  );
}
