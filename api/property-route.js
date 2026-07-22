import fs from "node:fs";
import path from "node:path";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://akshar-realestate-backend.onrender.com/api";
const SITE_ORIGIN = (process.env.SITE_ORIGIN || process.env.FRONTEND_URL || "https://www.aksharestate.in").replace(/\/$/, "");
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
const PROPERTY_PATH_RE = /^\/property\/([^/?#]+)\/?/i;

function firstQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function compact(value, limit) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function canonicalPath(slug) {
  return `/property/${slug}`;
}

function canonicalUrl(slug, property = {}) {
  const expectedPath = canonicalPath(slug);
  if (property.canonicalUrl) {
    try {
      const parsed = new URL(property.canonicalUrl);
      if (parsed.origin === SITE_ORIGIN && parsed.pathname === expectedPath) return property.canonicalUrl;
    } catch {
      // Fall back to the configured public origin below.
    }
  }
  return `${SITE_ORIGIN}${expectedPath}`;
}

async function fetchPropertyById(id) {
  const response = await fetch(`${API_BASE_URL}/public/properties/${encodeURIComponent(id)}`);
  if (!response.ok) return null;
  const body = await response.json();
  return body?.data || null;
}

async function fetchPropertyBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/public/properties/slug/${encodeURIComponent(slug)}`);
  if (!response.ok) return null;
  const body = await response.json();
  return body?.data || null;
}

async function fetchPublicProperties(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  const response = await fetch(`${API_BASE_URL}/public/properties?${search.toString()}`);
  if (!response.ok) return [];
  const body = await response.json();
  return Array.isArray(body?.data) ? body.data : [];
}

async function fetchRelatedProperties(property) {
  const [sameLocation, sameType] = await Promise.all([
    fetchPublicProperties({ location: property.location || property.locationMaster?.name || "", city: property.city || "", limit: 6 }),
    fetchPublicProperties({ type: property.type || property.propertyType || "", city: property.city || "", limit: 6 }),
  ]);
  const seen = new Set([property._id, property.slug]);
  const unique = (items) => items.filter((item) => {
    const key = item.slug || item._id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    sameLocation: unique(sameLocation).slice(0, 5),
    sameType: unique(sameType).slice(0, 5),
  };
}

function readIndexHtml() {
  const candidates = [
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  return "<!doctype html><html lang=\"en-IN\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Akshar Estate: The Property Hub</title></head><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>";
}

function buildPropertyMeta(property, slug) {
  const title = compact(property.seoTitle || propertyPageTitle(property), 70);
  const description = propertyMetaDescription(property);
  const url = canonicalUrl(slug, property);
  const image = propertyImages(property)[0]?.url || "";
  const robots = property.isIndexable === false ? "noindex,follow" : "index,follow,max-image-preview:large";

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<meta http-equiv="content-language" content="en-IN" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : "",
    jsonLdScript(buildPropertySchema(property, slug)),
    jsonLdScript(buildBreadcrumbSchema(property, slug)),
  ].filter(Boolean).join("\n    ");
}

function injectPropertyMeta(html, property, slug, related = {}) {
  const meta = buildPropertyMeta(property, slug);
  const withoutTitle = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<html([^>]*)>/i, '<html lang="en-IN">');
  const withMeta = withoutTitle.includes("</head>")
    ? withoutTitle.replace("</head>", `    ${meta}\n  </head>`)
    : `${meta}\n${withoutTitle}`;
  const initialPage = buildInitialPropertyPage(property, related);
  return withMeta.includes('<div id="root"></div>')
    ? withMeta.replace('<div id="root"></div>', `<div id="root">${initialPage}</div>`)
    : withMeta.replace("</body>", `<div id="root">${initialPage}</div></body>`);
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function propertyLocation(property) {
  return [property.locationMaster?.name || property.location, property.city].filter(Boolean).join(", ");
}

function propertyKind(property) {
  if (property.bhk) return `${property.bhk} BHK ${property.type || property.propertyType || "Property"}`;
  return property.type || property.propertyType || "Property";
}

function listingAction(property) {
  const listingType = property.listingType || property.dealType || "";
  return /rent|lease/i.test(listingType) ? "Rent" : "Sale";
}

function propertyPageTitle(property) {
  return `${propertyKind(property)} for ${listingAction(property)} in ${propertyLocation(property) || "Gujarat"}`;
}

function propertyMetaDescription(property) {
  return compact(
    property.metaDescription ||
      `Explore this ${propertyKind(property).toLowerCase()} for ${listingAction(property).toLowerCase()} in ${propertyLocation(property) || "Gujarat"}. View price, area, amenities, photos, map, supervisor contact and similar properties.`,
    160
  );
}

function propertyImages(property) {
  const urls = Array.from(new Set([property.image, ...(property.gallery || []), ...(property.images || [])].filter(Boolean)));
  return urls.map((url, index) => ({ url, alt: propertyImageAlt(property, index) }));
}

function propertyImageAlt(property, index = 0) {
  const savedAlt = property.imageAltTexts?.[index];
  const repeatedAlt = savedAlt && property.imageAltTexts?.filter((item) => item === savedAlt).length > 1;
  if (savedAlt && !repeatedAlt) return savedAlt;
  const views = ["Exterior view", "Living room", "Bedroom", "Kitchen", "Balcony", "Interior view", "Entrance view", "Floor plan"];
  return `${views[index % views.length]} of ${propertyKind(property).toLowerCase()} in ${propertyLocation(property) || "Gujarat"}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function formatArea(value, label) {
  if (!value) return "";
  return `${value} sq.ft ${label}`;
}

function mapLabel(property) {
  return property.address || property.map?.address || propertyLocation(property) || "Map location available on request";
}

function section(title, body) {
  if (!body) return "";
  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function detailList(items) {
  const rows = items.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");
  if (!rows.length) return "";
  return `<dl>${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`;
}

function linkList(items) {
  const links = items.filter(Boolean);
  if (!links.length) return "";
  return `<ul>${links.map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}</ul>`;
}

function propertyLink(property) {
  return property?.slug ? canonicalPath(property.slug) : "";
}

function buildInternalLinks(property, related = {}) {
  const city = property.city || "";
  const locality = property.locationMaster?.name || property.location || "";
  const type = property.type || property.propertyType || "";
  const citySlug = slugify(city);
  const localitySlug = slugify([locality, city].filter(Boolean).join(" "));
  const typeSlug = slugify([type, "for", listingAction(property), "in", city].filter(Boolean).join(" "));
  const nearbyLinks = String(property.nearbyLandmarks || "")
    .split(/[,.;\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 3)
    .slice(0, 4)
    .map((item) => ({ label: `Properties near ${item}`, href: `/purchase/buyers/${slugify(`properties near ${item} ${city}`)}` }));

  return {
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      city && { label: city, href: `/purchase/buyers/properties-for-sale-in-${citySlug}` },
      locality && { label: locality, href: `/purchase/buyers/properties-for-sale-in-${localitySlug}` },
      { label: property.title || propertyPageTitle(property), href: canonicalPath(property.slug) },
    ].filter(Boolean),
    core: [
      city && { label: `Properties in ${city}`, href: `/purchase/buyers/properties-for-sale-in-${citySlug}` },
      locality && { label: `Properties in ${locality}`, href: `/purchase/buyers/properties-for-sale-in-${localitySlug}` },
      type && { label: `${type} properties`, href: `/purchase/buyers/${typeSlug}` },
      ...nearbyLinks,
    ].filter(Boolean),
    similar: (related.sameType || []).map((item) => ({ label: item.title || propertyPageTitle(item), href: propertyLink(item) })),
    sameLocation: (related.sameLocation || []).map((item) => ({ label: item.title || propertyPageTitle(item), href: propertyLink(item) })),
  };
}

function buildInitialPropertyPage(property, related = {}) {
  const title = propertyPageTitle(property);
  const description = property.description || propertyMetaDescription(property);
  const images = propertyImages(property);
  const broker = property.broker || {};
  const links = buildInternalLinks(property, related);
  const status = property.propertyStatus || property.status || "Available";
  const lastUpdated = formatDate(property.lastModifiedAt || property.updatedAt);

  return `
    <main class="akshar-property-seo" style="max-width:1120px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <nav aria-label="Breadcrumb" style="font-size:14px;margin-bottom:16px">
        ${links.breadcrumbs.map((item, index) => `${index ? " / " : ""}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
      </nav>
      <article>
        <header>
          <p style="margin:0 0 8px;color:#2563eb;font-weight:700">Akshar Estate: The Property Hub verified listing</p>
          <h1 style="font-size:32px;line-height:1.2;margin:0 0 12px">${escapeHtml(title)}</h1>
          <p>${escapeHtml(propertyLocation(property))}</p>
        </header>
        ${images.length ? `<figure><img src="${escapeHtml(images[0].url)}" alt="${escapeHtml(images[0].alt)}" style="width:100%;height:auto;border-radius:12px" /><figcaption>${escapeHtml(images[0].alt)}</figcaption></figure>` : ""}
        ${section("Property Overview", `<p>${escapeHtml(description)}</p>${detailList([
          ["Property status", status],
          ["Last updated", lastUpdated],
          ["Property type", propertyKind(property)],
          ["Listing type", listingAction(property)],
        ])}`)}
        ${section("Price", `<p>${escapeHtml(property.price || "Price on request")}</p>`)}
        ${section("Carpet Area", `<p>${escapeHtml(formatArea(property.carpetArea, "carpet area") || property.area || "Available on request")}</p>`)}
        ${section("Built-up Area", `<p>${escapeHtml(formatArea(property.builtUpArea, "built-up area") || (property.sqft ? `${property.sqft} sq.ft` : "Available on request"))}</p>`)}
        ${section("Property Description", `<p>${escapeHtml(description)}</p>`)}
        ${section("Amenities", property.amenities?.length ? linkList(property.amenities.map((item) => ({ label: item, href: `/purchase/buyers/${slugify(`${item} ${property.type || "properties"} in ${property.city || ""}`)}` }))) : "<p>Amenities available on request.</p>")}
        ${section("Furnishing", `<p>${escapeHtml(property.furnishing || "Available on request")}</p>`)}
        ${section("Floor Details", `<p>${escapeHtml([property.floor || property.floorNumber, property.totalFloors ? `Total floors: ${property.totalFloors}` : ""].filter(Boolean).join(", ") || "Available on request")}</p>`)}
        ${section("Parking", `<p>${escapeHtml(property.parking || "Available on request")}</p>`)}
        ${section("Possession", `<p>${escapeHtml(property.possessionStatus || property.availability || property.constructionStatus || "Available on request")}</p>`)}
        ${section("Project or Society", `<p>${escapeHtml(property.projectName || property.societyName || property.topProject || "Available on request")}</p>`)}
        ${section("Address", `<p>${escapeHtml(property.address || property.map?.address || propertyLocation(property) || "Available on request")}</p>`)}
        ${section("Map", `<p>${escapeHtml(mapLabel(property))}</p>`)}
        ${section("Nearby Landmarks", `<p>${escapeHtml(property.nearbyLandmarks || "Nearby landmark details available on request.")}</p>`)}
        ${section("Assigned Supervisor", detailList([
          ["Name", broker.name || "Contact our property expert"],
          ["Phone", broker.phone || "Available after assignment"],
          ["Company", broker.companyName || "Akshar Estate The Property Hub"],
        ]))}
        ${section("Contact This Property", `<p><a href="${escapeHtml(broker.phone ? `tel:${String(broker.phone).replace(/[^\d+]/g, "")}` : "/contact")}">Call button</a></p><p><a href="${escapeHtml(broker.whatsapp ? `https://wa.me/${String(broker.whatsapp).replace(/[^\d]/g, "")}` : "/contact")}">WhatsApp button</a></p>`)}
        ${section("Similar Properties", linkList(links.similar) || "<p>Similar active properties will appear here as inventory updates.</p>")}
        ${section("Properties in the Same Location", linkList(links.sameLocation) || "<p>More active properties in this location will appear here as inventory updates.</p>")}
        ${section("Internal Links", linkList(links.core))}
        ${images.length > 1 ? section("Property Images", `<ul>${images.slice(1).map((image) => `<li><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" style="max-width:240px;height:auto" /></li>`).join("")}</ul>`) : ""}
      </article>
    </main>`;
}

function buildPropertySchema(property, slug) {
  const url = canonicalUrl(slug, property);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: propertyPageTitle(property),
    description: propertyMetaDescription(property),
    image: propertyImages(property).map((image) => image.url),
    url,
    brand: { "@type": "Organization", name: "Akshar Estate The Property Hub" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: property.priceAmount || undefined,
      availability: property.status === "active" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      url,
      seller: { "@type": "Organization", name: "Akshar Estate The Property Hub" },
    },
    additionalProperty: [
      ["Location", propertyLocation(property)],
      ["Property type", propertyKind(property)],
      ["Carpet area", formatArea(property.carpetArea, "carpet area")],
      ["Built-up area", formatArea(property.builtUpArea, "built-up area")],
      ["Furnishing", property.furnishing],
      ["Parking", property.parking],
      ["Possession", property.possessionStatus],
    ].filter(([, value]) => value).map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
  };
}

function buildBreadcrumbSchema(property, slug) {
  const links = buildInternalLinks(property);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: links.breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_ORIGIN}${index === links.breadcrumbs.length - 1 ? canonicalPath(slug) : item.href}`,
    })),
  };
}

function redirect(res, location) {
  res.writeHead(301, {
    Location: location,
    "Cache-Control": "public, max-age=3600",
  });
  res.end();
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end("<!doctype html><html><head><title>Property Not Found | Akshar Estate</title><meta name=\"robots\" content=\"noindex\" /></head><body><h1>Property Not Found</h1><p>The property you are looking for is unavailable.</p></body></html>");
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || "", "https://www.aksharestate.in");
    const rawKeyFromPath = PROPERTY_PATH_RE.exec(url.pathname)?.[1];
    const rawKey = firstQueryValue(req.query?.key) || rawKeyFromPath || "";
    const decodedKey = decodeURIComponent(String(rawKey)).trim().replace(/^\/+|\/+$/g, "");
    if (!decodedKey) {
      notFound(res);
      return;
    }

    const hasTrailingSlash = url.pathname.endsWith("/") || firstQueryValue(req.query?.slash) === "1";
    const extraQueryKeys = [...url.searchParams.keys()].filter((key) => !["key", "slash"].includes(key));
    const hasQueryNoise = extraQueryKeys.length > 0;

    if (OBJECT_ID_RE.test(decodedKey)) {
      const property = await fetchPropertyById(decodedKey);
      if (!property?.slug) {
        notFound(res);
        return;
      }
      redirect(res, canonicalPath(property.slug));
      return;
    }

    const normalizedSlug = decodedKey.toLowerCase();
    const property = await fetchPropertyBySlug(normalizedSlug);
    if (!property?.slug) {
      notFound(res);
      return;
    }

    if (decodedKey !== property.slug || hasTrailingSlash || hasQueryNoise) {
      redirect(res, canonicalPath(property.slug));
      return;
    }

    const related = await fetchRelatedProperties(property);
    const html = injectPropertyMeta(readIndexHtml(), property, property.slug, related);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.end(html);
  } catch (error) {
    console.error("Property route handler failed", error);
    notFound(res);
  }
}
