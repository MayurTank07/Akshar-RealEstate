const SITE_NAME = "Akshar Estate The Property HUB";

function compact(value, limit) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function propertyLocation(property) {
  const location = property.location || property.city || "Ahmedabad";
  const city = property.city || "Ahmedabad";
  return new RegExp(city, "i").test(location) ? location : `${location}, ${city}`;
}

export function buildPropertySeo(property) {
  const title = property.title || "Verified Property";
  const type = property.type || "Property";
  const location = propertyLocation(property);
  const dealType = property.dealType || "Buy";
  const canonical = `${window.location.origin}/property/${property._id || property.id || ""}`;
  const metaTitle = compact(`${compact(title, 32)} | ${type} in ${compact(location, 24)} | Ahmedabad Broker`, 68);
  const metaDescription = compact(
    `Explore ${title}, a verified ${type.toLowerCase()} in ${location}. Get Ahmedabad-focused broker-assisted ${dealType.toLowerCase()} guidance, pricing support, and private site visits from ${SITE_NAME}.`,
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

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.dataset.aksharPropertySeo = "true";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description || seo.description,
    image: [property.image, ...(property.gallery || [])].filter(Boolean),
    category: `${property.category || "Real Estate"} ${property.type || "Property"}`.trim(),
    url: seo.canonical,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: property.priceAmount || property.price || undefined,
      availability: property.status === "active" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      url: seo.canonical,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Location", value: propertyLocation(property) },
      { "@type": "PropertyValue", name: "Deal Type", value: property.dealType || "" },
      { "@type": "PropertyValue", name: "Area", value: property.area || property.sqft || "" },
    ],
  });
  document.head.appendChild(schema);

  return () => {
    clearPropertySeo();
    if (document.title === seo.title) document.title = previousTitle;
  };
}
