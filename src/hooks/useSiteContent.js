import { useEffect, useMemo, useState } from "react";
import { publicApi } from "../services/api";
import { defaultAboutContent, defaultContactContent, defaultHomeSectionsContent, defaultNavbarAreas, defaultTopLists } from "../config/navigationContent";

const defaults = {
  siteName: "Akshar Estate The Property HUB",
  heroTitle: "We Turn Spaces into Places You Call Home",
  heroSubtitle: "Discover verified homes, apartments, and investment-ready properties across Ahmedabad, Surat, Vadodara, and nearby Gujarat cities.",
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
        cachedContent = response.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), defaults);
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
