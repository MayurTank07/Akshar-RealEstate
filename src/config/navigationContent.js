export const defaultNavbarAreas = [
  "Properties for sale in Bodakdev",
  "Properties for sale in Thaltej",
  "Properties for sale in Satellite",
  "Properties for sale in Prahlad Nagar",
  "Properties for sale in SG Highway",
  "Properties for sale in Bopal",
  "Properties for sale in South Bopal",
  "Properties for sale in Shela",
  "Properties for sale in Gota",
  "Properties for sale in Chandkheda",
];

export const defaultTopLists = [
  { title: "Gurukrupa Ananatam", type: "project", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 1, city: "", slug: "", description: "" },
  { title: "Trump Towers", type: "project", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 2, city: "", slug: "", description: "" },
  { title: "Ashapura Skies", type: "project", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 3, city: "", slug: "", description: "" },
  { title: "Clinton Heights", type: "project", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 4, city: "", slug: "", description: "" },
  { title: "Nathani Heights", type: "project", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 5, city: "", slug: "", description: "" },
  { title: "Vaibhavlaxmi Developers", type: "developer", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 1, city: "", slug: "", description: "" },
  { title: "Lodha Builders", type: "developer", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 2, city: "", slug: "", description: "" },
  { title: "Reliable India and Corporation", type: "developer", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 3, city: "", slug: "", description: "" },
  { title: "Haware Properties", type: "developer", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 4, city: "", slug: "", description: "" },
  { title: "Agastya Infra", type: "developer", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: 5, city: "", slug: "", description: "" },
];

export const defaultAboutContent = {
  title: "Real Estate with Akshar Estate The Property HUB Confidence.",
  subtitle: "Akshar Estate The Property HUB is a Gujarat-focused brokerage committed to helping clients find the right property with transparency and ease.",
  mainDescription: "We simplify real estate and build lasting relationships through performance. We connect people to the best residential and commercial opportunities.",
  heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
  ownerName: "Hitesh Patel",
  ownerPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
  ownerDesignation: "Founder, Akshar Estate The Property HUB",
  ownerBio: "Hitesh Patel leads Akshar Estate The Property HUB with a practical, client-first approach built around verified opportunities, clear advice, and long-term property value across Gujarat.",
  ownerQuote: "Our goal is simple — to make real estate decisions smarter, faster, and more profitable for our clients.",
  visionTitle: "Our Vision",
  visionContent: "To become a trusted name in real estate by delivering honest guidance and long-term value.",
  missionTitle: "Our Mission",
  missionContent: "Help every buyer, seller, renter, and investor make confident property decisions with verified options, clear advice, and complete support.",
  storyTitle: "Company Story",
  storyContent: "Akshar Estate The Property HUB was built to bring sharper local knowledge, reliable listings, and transparent guidance to Gujarat real estate.",
  stats: [
    { label: "Trust", value: "100%" },
    { label: "Deals Done", value: "500+" },
  ],
  features: [
    { title: "Trusted Guidance", desc: "We prioritize honesty and clear communication in every interaction." },
    { title: "Market Expertise", desc: "Strong understanding of local trends and high-growth opportunities." },
    { title: "Personalized Service", desc: "Every client receives tailored property solutions unique to their needs." },
    { title: "End-to-End Support", desc: "From the initial property search to the final legal deal closure." },
    { title: "Strong Network", desc: "Exclusive access to verified listings and premium off-market properties." },
    { title: "Results Driven", desc: "Our goal is to make decisions smarter, faster, and more profitable." },
  ],
  seoTitle: "About Akshar Estate The Property HUB",
  seoDescription: "Learn about Akshar Estate The Property HUB, our leadership, vision, and Gujarat real estate expertise.",
};

export const defaultContactContent = {
  title: "Let’s discuss your next property move.",
  subtitle: "Share your requirement and our team will help with verified options across Gujarat.",
  phone: "+91 1800-123-4567",
  email: "info@aksharrealestate.com",
  address: "SG Highway, Ahmedabad, Gujarat 380054",
  whatsapp: "+91 98765 43210",
  officeTiming: "Mon - Sat, 10:00 AM to 7:00 PM",
  mapEmbed: "",
  mapLink: "",
  socials: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },
  location: {
    address: "SG Highway, Ahmedabad, Gujarat 380054",
    area: "SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380054",
    lat: null,
    lng: null,
    placeId: "",
  },
};

export function enabledSorted(items = [], type) {
  return items
    .filter((item) => item && item.enabled !== false && item.showInNavbar !== false && (!type || item.type === type))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.title || "").localeCompare(String(b.title || "")));
}

export function normalizeAreaName(item) {
  const raw = typeof item === "object" && item ? item.title || item.name || item.label || "" : item;
  return String(raw || "")
    .replace(/^Properties for sale in\s+/i, "")
    .replace(/^Properties for Rent in\s+/i, "")
    .trim();
}

function enabledAreaItems(areas = defaultNavbarAreas) {
  return areas
    .map((item, index) => ({ item, index }))
    .filter((item) => {
      if (!item.item) return false;
      if (typeof item.item === "object") return item.item.enabled !== false && item.item.showInNavbar !== false;
      return true;
    })
    .sort((a, b) => {
      const aOrder = typeof a.item === "object" ? Number(a.item.sortOrder || 0) : 0;
      const bOrder = typeof b.item === "object" ? Number(b.item.sortOrder || 0) : 0;
      return aOrder - bOrder || a.index - b.index;
    })
    .map(({ item }) => item);
}

export function navbarAreasForMode(areas = defaultNavbarAreas, mode = "sale", { limit = 5, includeViewMore = true } = {}) {
  const prefix = mode === "rent" ? "Properties for Rent in" : "Properties for sale in";
  const normalized = enabledAreaItems(areas).map((item) => {
    const area = normalizeAreaName(item);
    return {
      name: `${prefix} ${area || "Ahmedabad"}`,
      desc: typeof item === "object" ? item.description || "" : "",
      slug: typeof item === "object" ? item.slug || "" : "",
      city: typeof item === "object" ? item.city || "Ahmedabad" : "Ahmedabad",
      kind: "area",
    };
  });
  const visible = normalized.slice(0, limit);
  if (includeViewMore && normalized.length > limit) {
    visible.push({
      name: "View More",
      desc: "Explore all Ahmedabad areas and available properties",
      link: "/properties",
      kind: "view-more",
    });
  }
  return visible;
}

export function buildDynamicMenus(content = {}, mode = "sale") {
  const areas = Array.isArray(content.navbarAreas) ? content.navbarAreas : defaultNavbarAreas;
  const topLists = Array.isArray(content.navbarTopLists) ? content.navbarTopLists : defaultTopLists;
  const menus = [
    {
      title: "Ahmedabad Areas",
      items: navbarAreasForMode(areas, mode),
    },
    {
      title: "Top Projects in India",
      items: enabledSorted(topLists, "project").map((item) => ({ name: item.title, desc: item.description, slug: item.slug })),
    },
    {
      title: "Top Developers in India",
      items: enabledSorted(topLists, "developer").map((item) => ({ name: item.title, desc: item.description, slug: item.slug })),
    },
  ];
  const extraLinks = [...enabledSorted(topLists, "city"), ...enabledSorted(topLists, "custom-link")]
    .map((item) => ({ name: item.title, desc: item.description || item.city, slug: item.slug, kind: item.type }));
  if (extraLinks.length) {
    menus.push({ title: "Explore More", items: extraLinks });
  }
  return menus;
}

export function cityOptionsFromAreas(areas = defaultNavbarAreas) {
  return ["All", ...enabledAreaItems(areas).map(normalizeAreaName).filter(Boolean)];
}
