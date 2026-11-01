import { useEffect, useMemo, useState } from "react";
import { publicApi } from "../services/api";
import { defaultAboutContent, defaultContactContent, defaultHomeSectionsContent, defaultNavbarAreas, defaultTopLists } from "../config/navigationContent";

const defaults = {
  siteName: "Akshar Estate The Property HUB",
  heroTitle: "Agricultural Land, Plots & Properties for Sale in Gujarat",
  heroSubtitle: "Explore verified agricultural land, residential plots and sale properties in Gandhinagar, Ahmedabad and nearby Gujarat locations.",
  navbarAreas: defaultNavbarAreas,
  navbarTopLists: defaultTopLists,
  aboutContent: defaultAboutContent,
  contactContent: defaultContactContent,
  homeSectionsContent: defaultHomeSectionsContent,
  heroImage: "/house.jpg",
  heroCtaText: "Search",
};

let cachedContent = null;
let contentPromise = null;

export function migrateLegacySiteContent(content) {
  const contact = content.contactContent || {};
  const legacyAddress = "4/1, 4Th Floor, B.K.Complex, Above Kotak Mahindra Bank, Opp, Canara Bank, Gh Road, Sector 16, Gandhinagar : 382016 Gujarat India";
  const migratedContact = {
    ...contact,
    address: contact.address === legacyAddress ? defaultContactContent.address : contact.address,
    officeTiming: contact.officeTiming === "Mon - Sat, 10:00 AM to 7:00 PM" ? defaultContactContent.officeTiming : contact.officeTiming,
    ...(contact.location ? { location: {
      ...contact.location,
      address: contact.location.address === legacyAddress ? defaultContactContent.location.address : contact.location.address,
    } } : {}),
  };
  return {
    ...content,
    contactContent: { ...defaultContactContent, ...migratedContact },
    heroTitle: content.heroTitle === "We Turn Spaces into Places You Call Home" ? defaults.heroTitle : content.heroTitle,
    heroSubtitle: /^Discover verified homes, apartments, and investment-ready properties across /i.test(content.heroSubtitle || "") ? defaults.heroSubtitle : content.heroSubtitle,
  };
}

export default function useSiteContent() {
  const [content, setContent] = useState(cachedContent || defaults);
  const [isLoaded, setIsLoaded] = useState(Boolean(cachedContent));

  useEffect(() => {
    let active = true;

    if (cachedContent) {
      return () => {
        active = false;
      };
    }

    contentPromise ||= publicApi
      .content()
      .then((response) => {
        cachedContent = migrateLegacySiteContent(response.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), defaults));
        return cachedContent;
      })
      .catch(() => defaults)
      .finally(() => {
        contentPromise = null;
      });

    contentPromise.then((next) => {
      if (!active) return;
      setContent(next);
      setIsLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ ...content, isLoaded }), [content, isLoaded]);
}
