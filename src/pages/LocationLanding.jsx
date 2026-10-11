import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Hero from "../compswest/Hero";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import { getBhkIntentPage, getPropertyTypeIntentPage, getSaleLandingPage, landingStateForPage } from "../config/locationLandingPages";

export default function LocationLanding({ typePrefix = "" }) {
  const { region, locality, intent, typeLocation } = useParams();
  const page = typePrefix
    ? getPropertyTypeIntentPage(typePrefix, typeLocation)
    : intent
      ? getBhkIntentPage(region, locality, intent)
      : getSaleLandingPage(region, locality);
  useEffect(() => {
    if (!page) return undefined;
    const previousTitle = document.title;
    const updates = [
      ["meta[name='description']", "content", page.metaDescription || page.intro],
      ["link[rel='canonical']", "href", `https://www.aksharestate.in${page.path}`],
      ["meta[property='og:title']", "content", page.title],
      ["meta[property='og:description']", "content", page.metaDescription || page.intro],
      ["meta[property='og:url']", "content", `https://www.aksharestate.in${page.path}`],
    ];
    const restore = updates.map(([selector, attribute, value]) => {
      const existing = document.querySelector(selector);
      const element = existing || document.createElement(selector.startsWith("link") ? "link" : "meta");
      if (!existing) {
        if (selector.startsWith("link")) element.rel = "canonical";
        else if (selector.includes("property=")) element.setAttribute("property", selector.match(/property='([^']+)'/)?.[1] || "");
        else element.setAttribute("name", selector.match(/name='([^']+)'/)?.[1] || "");
        document.head.appendChild(element);
      }
      const previous = element.getAttribute(attribute);
      element.setAttribute(attribute, value);
      return () => {
        if (!existing) element.remove();
        else if (previous === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, previous);
      };
    });
    document.title = page.title;
    return () => {
      restore.forEach((undo) => undo());
      document.title = previousTitle;
    };
  }, [page]);
  if (!page) return <Navigate to="/properties" replace />;
  const state = landingStateForPage(page);
  const intro = (
    <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Properties", href: "/properties" },
        page.regionName && { label: page.regionName, href: `/properties-for-sale/${page.regionSlug}` },
        { label: page.name },
      ]} />
      <section className="mt-6 max-w-4xl text-slate-800">
        <h2 className="text-lg font-bold text-slate-950">At a glance</h2>
        <p className="mt-2 leading-7">{page.intro}</p>
      </section>
    </div>
  );

  return (
    <div>
      <Hero key={page.path} category={state.category} type={state.type} city={state.city} filters={state.filters} pageTitle={page.h1} intentPage={page} intro={intro} />
      <nav aria-label="Related property searches" className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 px-4 py-8 text-sm font-semibold text-blue-700 sm:px-6 lg:px-8">
        <Link to="/agricultural-land-for-sale/gandhinagar">Agricultural land in Gandhinagar</Link>
        <Link to="/plots-for-sale/ahmedabad">Plots in Ahmedabad</Link>
        <Link to="/flats-for-sale/ahmedabad">Flats in Ahmedabad</Link>
        <Link to="/2-bhk-flats-for-sale/gandhinagar">2 BHK flats in Gandhinagar</Link>
      </nav>
      <Footer />
    </div>
  );
}
