import { BUSINESS_INFO, SITE_ORIGIN } from "../config/businessInfo.js";

export function compactText(value, limit = 180) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

export function absoluteUrl(value = "", siteOrigin = SITE_ORIGIN) {
  const input = String(value || "").trim();
  if (!input) return "";
  try {
    return new URL(input, siteOrigin).toString();
  } catch {
    return "";
  }
}

function cleanObject(value) {
  if (Array.isArray(value)) {
    const array = value.map(cleanObject).filter((item) => {
      if (item === undefined || item === null || item === "") return false;
      if (Array.isArray(item)) return item.length > 0;
      if (typeof item === "object") return Object.keys(item).length > 0;
      return true;
    });
    return array.length ? array : undefined;
  }
  if (value && typeof value === "object") {
    const object = {};
    Object.entries(value).forEach(([key, item]) => {
      const cleaned = cleanObject(item);
      if (cleaned !== undefined && cleaned !== "") object[key] = cleaned;
    });
    return Object.keys(object).length ? object : undefined;
  }
  return value === undefined || value === null || value === "" ? undefined : value;
}

export function pruneSchema(schema) {
  return cleanObject(schema) || {};
}

export function schemaScriptContent(schema) {
  return JSON.stringify(pruneSchema(schema)).replace(/</g, "\\u003c");
}

function normalizePhone(value) {
  return String(value || "").trim();
}

function contactAddress(contact = {}) {
  const location = contact.location || {};
  const fallback = BUSINESS_INFO.address;
  const addressText = contact.address || location.address || "";
  const addressLower = addressText.toLowerCase();
  const locationCity = location.city && addressLower.includes(String(location.city).toLowerCase()) ? location.city : "";
  const locationPin = location.pincode && addressText.includes(String(location.pincode)) ? location.pincode : "";
  return {
    "@type": "PostalAddress",
    streetAddress: addressText || location.area || fallback.streetAddress,
    addressLocality: locationCity || fallback.addressLocality,
    addressRegion: location.state || fallback.addressRegion,
    postalCode: locationPin || fallback.postalCode,
    addressCountry: fallback.addressCountry,
  };
}

function socialProfiles(contact = {}) {
  const socials = contact.socials || {};
  return [
    socials.instagram,
    socials.facebook,
    socials.linkedin,
    socials.youtube,
    socials.x,
    ...(BUSINESS_INFO.socialProfiles || []),
  ].map((url) => absoluteUrl(url)).filter(Boolean);
}

export function businessIdentity(contact = {}) {
  const phone = normalizePhone(contact.phone || BUSINESS_INFO.phone);
  const whatsapp = normalizePhone(contact.whatsapp || contact.whatsappSettings?.phone || "");
  const email = contact.email || BUSINESS_INFO.email;
  const address = contactAddress(contact);
  const lat = contact.location?.lat;
  const lng = contact.location?.lng;
  const identity = {
    "@id": `${SITE_ORIGIN}/#business`,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.alternateName,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    image: BUSINESS_INFO.image,
    description: contact.footerDescription || BUSINESS_INFO.description,
    telephone: phone,
    email,
    address,
    openingHours: contact.officeTiming ? undefined : BUSINESS_INFO.openingHours,
    openingHoursSpecification: contact.officeTiming
      ? [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:00",
        }]
      : undefined,
    sameAs: socialProfiles(contact),
    areaServed: [
      { "@type": "City", name: "Ahmedabad" },
      { "@type": "City", name: "Gandhinagar" },
      { "@type": "AdministrativeArea", name: "Gujarat" },
    ],
    geo: lat && lng ? { "@type": "GeoCoordinates", latitude: Number(lat), longitude: Number(lng) } : undefined,
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: whatsapp || phone,
      contactType: "customer service",
      areaServed: "IN-GJ",
      availableLanguage: ["English", "Gujarati", "Hindi"],
    }],
  };
  return pruneSchema(identity);
}

export function buildBreadcrumbSchema(items = [], siteOrigin = SITE_ORIGIN) {
  return pruneSchema({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.filter(Boolean).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label || item.name,
      item: absoluteUrl(item.href || item.item || "/", siteOrigin),
    })),
  });
}

function schemaNode(schema) {
  const node = { ...(schema || {}) };
  delete node["@context"];
  return node;
}

export function buildBusinessSchemas({ path = "/", pageName = BUSINESS_INFO.name, contact = {}, includeBreadcrumbs = true } = {}) {
  const url = absoluteUrl(path);
  const identity = businessIdentity(contact);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: identity.name,
      alternateName: identity.alternateName,
      url: identity.url,
      logo: identity.logo,
      image: identity.image,
      description: identity.description,
      telephone: identity.telephone,
      email: identity.email,
      address: identity.address,
      sameAs: identity.sameAs,
      contactPoint: identity.contactPoint,
    },
    {
      ...identity,
      "@type": "LocalBusiness",
      "@id": `${SITE_ORIGIN}/#localbusiness`,
    },
    {
      ...identity,
      "@type": "RealEstateAgent",
      "@id": `${SITE_ORIGIN}/#realestateagent`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: BUSINESS_INFO.name,
      url: SITE_ORIGIN,
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    },
    includeBreadcrumbs && {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_ORIGIN,
        },
        path !== "/" && {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: url,
        },
      ].filter(Boolean),
    },
  ];

  return pruneSchema({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

function isUrlLike(value) {
  return /^https?:\/\//i.test(String(value || "")) || /maps\.app\.goo\.gl|goo\.gl\/maps|google\.com\/maps/i.test(String(value || ""));
}

function cleanPropertyText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function propertyLocation(property = {}) {
  const rawLocation = property.locationMaster?.name || property.location || property.map?.area || "";
  const location = isUrlLike(rawLocation) ? "" : cleanPropertyText(rawLocation);
  const city = isUrlLike(property.city || property.map?.city) ? "" : cleanPropertyText(property.city || property.map?.city || "");
  if (location && city && !new RegExp(`\\b${escapeRegExp(city)}\\b`, "i").test(location)) return `${location}, ${city}`;
  return location || city;
}

function propertyKind(property = {}) {
  const rawType = property.type || property.propertyType || "Property";
  const cleanType = cleanPropertyText(rawType)
    .replace(/\b(for\s+sale|for\s+rent|sale|rent|lease)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "Property";
  if (property.bhk && !/\bbhk\b/i.test(cleanType)) return `${property.bhk} BHK ${cleanType}`;
  return cleanType;
}

function propertySchemaType(property = {}) {
  const text = [
    property.type,
    property.propertyType,
    property.category,
    property.title,
  ].join(" ").toLowerCase();
  if (/plot|land|farm|agriculture|industrial|warehouse|factory|commercial|office|shop|showroom|retail/.test(text)) return "Place";
  if (/flat|apartment/.test(text)) return "Apartment";
  if (/villa|bungalow|house|home/.test(text)) return "House";
  return "Residence";
}

function listingAction(property = {}) {
  const listingType = property.listingType || property.dealType || "";
  return /rent|lease/i.test(listingType) ? "Rent" : "Sale";
}

function propertyTitle(property = {}) {
  const title = cleanPropertyText(property.seoTitle);
  if (title && !isUrlLike(title) && !/\b(sale|rent)\s+for\s+(sale|rent)\b/i.test(title)) return title;
  return `${propertyKind(property)} for ${listingAction(property)} in ${propertyLocation(property) || "Gujarat"}`;
}

function propertyDescription(property = {}) {
  return compactText(
    property.metaDescription ||
      property.description ||
      `Explore this ${propertyKind(property).toLowerCase()} for ${listingAction(property).toLowerCase()} in ${propertyLocation(property) || "Gujarat"}. View price, area, amenities, photos, map and supervisor contact details.`,
    160
  );
}

function propertyImages(property = {}) {
  return [...new Set([property.image, ...(property.gallery || []), ...(property.images || [])].filter(Boolean))]
    .map((url) => absoluteUrl(url))
    .filter(Boolean);
}

function numericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) return undefined;
  return Number(normalized);
}

function areaValue(...values) {
  for (const value of values) {
    const number = numericValue(value);
    if (number) return number;
  }
  return undefined;
}

function propertyAddress(property = {}) {
  const locationName = property.locationMaster?.name || property.location || property.map?.area;
  const city = property.city || property.map?.city;
  const addressText = property.address || property.map?.address;
  if (!addressText && !locationName && !city) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: addressText || locationName,
    addressLocality: city || locationName,
    addressRegion: property.state || property.map?.state || "Gujarat",
    addressCountry: "IN",
  };
}

function propertyAvailability(property = {}) {
  const status = String(property.propertyStatus || property.status || "").toLowerCase();
  if (/sold|rented|closed/.test(status)) return "https://schema.org/SoldOut";
  if (/inactive|draft|deleted|disabled/.test(status)) return "https://schema.org/Discontinued";
  if (/active|available|published/.test(status)) return "https://schema.org/InStock";
  return undefined;
}

function floorSize(property = {}) {
  const value = areaValue(property.carpetArea, property.builtUpArea, property.plotArea, property.sqft);
  if (!value) return undefined;
  return {
    "@type": "QuantitativeValue",
    value,
    unitCode: "FTK",
    unitText: "sq ft",
  };
}

function propertyGeo(property = {}) {
  const lat = property.latitude || property.map?.lat;
  const lng = property.longitude || property.map?.lng;
  if (!lat || !lng) return undefined;
  return {
    "@type": "GeoCoordinates",
    latitude: Number(lat),
    longitude: Number(lng),
  };
}

export function buildPropertyJsonLd(property = {}, { url = "", breadcrumbs = [] } = {}) {
  const canonical = absoluteUrl(url || `/property/${property.slug || property._id || property.id || ""}`);
  const price = numericValue(property.priceAmount);
  const realEstateNode = {
    "@context": "https://schema.org",
    "@type": propertySchemaType(property),
    "@id": `${canonical}#property`,
    name: propertyTitle(property),
    description: propertyDescription(property),
    url: canonical,
    image: propertyImages(property),
    address: propertyAddress(property),
    geo: propertyGeo(property),
    floorSize: floorSize(property),
    numberOfRooms: property.bhk ? Number(property.bhk) : undefined,
    amenityFeature: (property.amenities || []).map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    additionalProperty: [
      ["Property type", propertyKind(property)],
      ["Listing type", listingAction(property)],
      ["Furnishing", property.furnishing],
      ["Parking", property.parking],
      ["Possession", property.possessionStatus || property.availability || property.constructionStatus],
      ["Floor", property.floor || property.floorNumber],
      ["Total floors", property.totalFloors],
      ["Project", property.projectName || property.societyName || property.topProject],
    ].filter(([, value]) => value).map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
    offers: {
      "@type": "Offer",
      "@id": `${canonical}#offer`,
      url: canonical,
      priceCurrency: price ? "INR" : undefined,
      price,
      availability: propertyAvailability(property),
      seller: { "@id": `${SITE_ORIGIN}/#realestateagent` },
      itemOffered: { "@id": `${canonical}#property` },
    },
  };

  const graph = [
    {
      ...businessIdentity(),
      "@type": "RealEstateAgent",
      "@id": `${SITE_ORIGIN}/#realestateagent`,
    },
    realEstateNode,
    breadcrumbs.length ? {
      ...schemaNode(buildBreadcrumbSchema(breadcrumbs)),
      "@id": `${canonical}#breadcrumb`,
    } : undefined,
  ];

  return pruneSchema({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export function buildCollectionPageJsonLd(page = {}, listings = [], { breadcrumbs = [] } = {}) {
  const url = absoluteUrl(page.path || "/properties");
  return pruneSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: page.h1 || page.title || page.name,
        description: page.metaDescription || page.intro,
        url,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: {
          "@type": "Thing",
          name: page.name,
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: listings.length,
          itemListElement: listings.slice(0, 20).map((property, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(property.slug ? `/property/${property.slug}` : "/properties"),
            name: property.title || property.seoTitle,
          })),
        },
      },
      breadcrumbs.length ? {
        ...schemaNode(buildBreadcrumbSchema(breadcrumbs)),
        "@id": `${url}#breadcrumb`,
      } : undefined,
    ],
  });
}

export function buildBlogPostingJsonLd(blog = {}, { url = "" } = {}) {
  const canonical = absoluteUrl(url || `/blog/${blog.slug || ""}`);
  return pruneSchema({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#blog-post`,
    headline: blog.title,
    description: blog.metaDescription || blog.excerpt,
    image: absoluteUrl(blog.featuredImage),
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      "@type": "Organization",
      name: blog.author || BUSINESS_INFO.name,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: BUSINESS_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: BUSINESS_INFO.logo,
      },
    },
    mainEntityOfPage: canonical,
    articleSection: blog.category,
    about: (blog.relatedLocations || []).map((name) => ({ "@type": "Place", name })),
  });
}
