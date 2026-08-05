import { buildPropertyJsonLd, schemaScriptContent } from "./structuredData";

const SITE_NAME = "Akshar Estate The Property HUB";

function compact(value, limit) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
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

function propertyLocation(property) {
  const location = isUrlLike(property.location) ? "" : cleanPropertyText(property.location || property.map?.area || "");
  const city = isUrlLike(property.city || property.map?.city) ? "" : cleanPropertyText(property.city || property.map?.city || "Ahmedabad");
  if (location && city && !new RegExp(`\\b${escapeRegExp(city)}\\b`, "i").test(location)) return `${location}, ${city}`;
  return location || city || "Ahmedabad";
}

function propertyType(property) {
  return cleanPropertyText(property.type || property.propertyType || "Property")
    .replace(/\b(for\s+sale|for\s+rent|sale|rent|lease)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "Property";
}

function storedSeoTitle(property) {
  const title = cleanPropertyText(property.seoTitle || property.seo?.metaTitle || "");
  if (!title) return "";
  if (isUrlLike(title) || /\b(sale|rent)\s+for\s+(sale|rent)\b/i.test(title)) return "";
  return title;
}

export function buildPropertySeo(property) {
  const title = property.title || "Verified Property";
  const type = propertyType(property);
  const location = propertyLocation(property);
  const dealType = property.dealType || "Buy";
  const canonical = property.canonicalUrl || `${window.location.origin}/property/${property.slug || property._id || property.id || ""}`;
  const metaTitle = compact(storedSeoTitle(property) || `${compact(title, 32)} | ${type} in ${compact(location, 24)} | Ahmedabad Broker`, 68);
  const metaDescription = compact(property.metaDescription || property.seo?.metaDescription ||
    `Explore ${title}, a verified ${type.toLowerCase()} in ${location}. Get Ahmedabad-focused broker-assisted ${dealType.toLowerCase()} guidance, pricing support, and private consultation from ${SITE_NAME}.`,
    160
  );
  const keywords = [
    title,
    `${type} in Ahmedabad`,
    `${dealType} property in Ahmedabad`,
    "Ahmedabad real estate broker",
    "flats shops offices villas plots in Ahmedabad",
    "broker-assisted property deals Ahmedabad",
    property.location,
    property.topProject,
    property.developerName || property.topDeveloper,
  ].filter(Boolean).join(", ");
  return { title: metaTitle, description: metaDescription, keywords, canonical };
}

function metaTag(attributes) {
  const selector = attributes.name ? `meta[name="${attributes.name}"]` : `meta[property="${attributes.property}"]`;
  const element = document.querySelector(selector) || document.createElement("meta");
  if (element.isConnected && element.dataset.aksharPropertySeoOriginal === undefined) {
    element.dataset.aksharPropertySeoOriginal = element.getAttribute("content") || "";
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  element.dataset.aksharPropertySeo = "true";
  if (!element.isConnected) document.head.appendChild(element);
}

function schemaTag(id, schema) {
  const element = document.getElementById(id) || document.createElement("script");
  element.id = id;
  element.type = "application/ld+json";
  element.textContent = schemaScriptContent(schema);
  element.dataset.aksharPropertySeo = "true";
  if (!element.isConnected) document.head.appendChild(element);
}

function clearPropertySeo() {
  document.querySelectorAll("[data-akshar-property-seo='true']").forEach((element) => {
    if (element.dataset.aksharPropertySeoOriginal !== undefined) {
      element.setAttribute("content", element.dataset.aksharPropertySeoOriginal);
      delete element.dataset.aksharPropertySeo;
      delete element.dataset.aksharPropertySeoOriginal;
    } else {
      element.remove();
    }
  });
}

export function syncPropertySeo(property) {
  if (!property) return undefined;
  const previousTitle = document.title;
  clearPropertySeo();
  const seo = buildPropertySeo(property);
  document.title = seo.title;
  metaTag({ name: "description", content: seo.description });
  metaTag({ name: "keywords", content: seo.keywords });
  metaTag({ property: "og:title", content: seo.title });
  metaTag({ property: "og:description", content: seo.description });
  metaTag({ property: "og:type", content: "product" });
  metaTag({ property: "og:url", content: seo.canonical });
  if (property.image || property.gallery?.[0]) metaTag({ property: "og:image", content: property.image || property.gallery[0] });
  metaTag({ name: "twitter:card", content: "summary_large_image" });
  metaTag({ name: "twitter:title", content: seo.title });
  metaTag({ name: "twitter:description", content: seo.description });

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = seo.canonical;
  canonical.dataset.aksharPropertySeo = "true";
  document.head.appendChild(canonical);

  schemaTag("akshar-schema-property-page", buildPropertyJsonLd(property, {
    url: seo.canonical,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      property.city && { label: property.city, href: "/properties" },
      property.location && { label: property.location, href: "/properties" },
      { label: property.title || "Property", href: seo.canonical },
    ].filter(Boolean),
  }));

  return () => {
    clearPropertySeo();
    if (document.title === seo.title) document.title = previousTitle;
  };
}
