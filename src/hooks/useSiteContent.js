import { useEffect, useState } from "react";
import { publicApi } from "../services/api";
import { defaultAboutContent, defaultContactContent, defaultNavbarAreas, defaultTopLists } from "../config/navigationContent";

const defaults = {
  siteName: "Akshar Estate The Property HUB",
  heroTitle: "We Turn Spaces into Places You Call Home",
  heroSubtitle: "Discover verified homes, apartments, and investment-ready properties across Ahmedabad, Surat, Vadodara, and nearby Gujarat cities.",
  navbarAreas: defaultNavbarAreas,
  navbarTopLists: defaultTopLists,
  aboutContent: defaultAboutContent,
  contactContent: defaultContactContent,
  heroImage: "/house.jpg",
  heroCtaText: "Search",
};

export default function useSiteContent() {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    let active = true;
    publicApi
      .content()
      .then((response) => {
        if (!active) return;
        const next = response.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), defaults);
        setContent(next);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return content;
}
