import fs from "node:fs";
import path from "node:path";
import {
  INTENT_LANDING_PAGES,
  getBhkIntentPage,
  getPropertyTypeIntentPage,
  getSaleLandingPage,
  SITE_ORIGIN,
  slugifyLocation,
} from "../src/config/locationLandingPages.js";
import { THUMBNAIL_IMAGE_FALLBACK, imageSrcSet, optimizedImageUrl } from "../src/utils/imageSeo.js";
import { buildCollectionPageJsonLd, schemaScriptContent } from "../src/utils/structuredData.js";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://akshar-realestate-backend.onrender.com/api";
const PAGE_SIZE = 9;
const INDEXABLE_PROPERTY_STATUSES = ["active", "published", "available", "reserved"];
const PROPERTY_FETCH_LIMIT = 100;
const MAX_PROPERTY_PAGES = 25;
const SALE_PATH_RE = /^\/properties-for-sale\/([^/?#]+)(?:\/([^/?#]+))?(?:\/([^/?#]+))?\/?/i;
const TYPE_PATH_RE = /^\/(plots-for-sale|commercial-property|industrial-property)\/([^/?#]+)\/?/i;

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

function canonicalUrl(page) {
  return `${SITE_ORIGIN}${page.path}`;
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

function stripStaticSeo(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>\s*/gi, "");
}

async function fetchPublicProperties() {
  const properties = [];
  for (let page = 1; page <= MAX_PROPERTY_PAGES; page += 1) {
    const response = await fetch(`${API_BASE_URL}/public/properties?limit=${PROPERTY_FETCH_LIMIT}&page=${page}&sort=createdAt&order=desc`);
    if (!response.ok) break;
    const body = await response.json();
    const rows = Array.isArray(body?.data) ? body.data : [];
    properties.push(...rows);
    const totalPages = Number(body?.pagination?.pages || 1);
    if (!rows.length || page >= totalPages) break;
  }
  return properties;
}

async function fetchPublicBlogs(page) {
  const location = page.localityName || page.name || page.city || "";
  const response = await fetch(`${API_BASE_URL}/public/blogs?location=${encodeURIComponent(location)}&limit=4`);
  if (!response.ok) return [];
  const body = await response.json();
  return Array.isArray(body?.data) ? body.data : [];
}

function propertyLocationText(property = {}) {
  return [property.locationMaster?.name || property.location, property.city].filter(Boolean).join(" ");
}

function slugContainsLocation(haystackSlug = "", needleSlug = "") {
  if (!haystackSlug || !needleSlug) return false;
  return haystackSlug === needleSlug ||
    haystackSlug.startsWith(`${needleSlug}-`) ||
    haystackSlug.endsWith(`-${needleSlug}`) ||
    haystackSlug.includes(`-${needleSlug}-`);
}

function pageLocationSlugs(page, fallbackSlug = "") {
  return [fallbackSlug, ...(page.matchSlugs || [])].filter(Boolean);
}

function propertyMatchesPage(property, page) {
  const locationSlug = slugifyLocation(property.locationMaster?.name || property.location || property.map?.area || "");
  const citySlug = slugifyLocation(property.city || property.map?.city || "");
  if (page.kind === "bhk") return pageLocationSlugs(page, page.localitySlug).some((slug) => slugContainsLocation(locationSlug, slug)) && propertyBhk(property) === Number(page.bhk);
  if (page.kind === "property-type") return pageLocationSlugs(page, page.locationSlug).some((slug) => slugContainsLocation(locationSlug, slug)) && typeMatchesIntent(property, page);
  if (page.kind === "locality") return pageLocationSlugs(page, page.slug).some((slug) => slugContainsLocation(locationSlug, slug));
  if (page.locations?.length) {
    const allowed = page.locations.map(slugifyLocation);
    return allowed.some((slug) => slugContainsLocation(locationSlug, slug) || citySlug === slug);
  }
  return citySlug === slugifyLocation(page.city || page.name) || propertyLocationText(property).toLowerCase().includes(page.name.toLowerCase());
}

function propertyBhk(property = {}) {
  return Number(property.bhk || property.beds || 0);
}

function propertyType(property = {}) {
  return property.type || property.propertyType || "Property";
}

function typeMatchesIntent(property = {}, page = {}) {
  const haystack = [
    property.type,
    property.propertyType,
    property.category,
    property.title,
    property.description,
    ...(property.propertyTags || []),
  ].join(" ").toLowerCase();
  return (page.typeMatchers || []).some((matcher) => haystack.includes(String(matcher).toLowerCase()));
}

function isIndexableProperty(property = {}) {
  return Boolean(
    property.slug &&
    INDEXABLE_PROPERTY_STATUSES.includes(String(property.status || "").toLowerCase()) &&
    property.isIndexable !== false &&
    !property.deletedAt &&
    property.visibility !== "private"
  );
}

function propertyLink(property = {}) {
  return property.slug ? `/property/${property.slug}` : "/properties";
}

function propertyImage(property = {}) {
  return property.image || property.gallery?.[0] || property.images?.[0] || THUMBNAIL_IMAGE_FALLBACK;
}

function propertyImageAlt(property = {}) {
  const location = [property.location, property.city].filter(Boolean).join(" ");
  return `Exterior view of ${propertyType(property).toLowerCase()} in ${location || "Gujarat"}`;
}

function propertyImageAttributes(property = {}) {
  const src = propertyImage(property);
  const alt = propertyImageAlt(property);
  return [
    `src="${escapeHtml(optimizedImageUrl(src, { width: 360, height: 260 }))}"`,
    `srcset="${escapeHtml(imageSrcSet(src, { widths: [240, 360, 520], aspectRatio: 360 / 260 }))}"`,
    `sizes="(max-width: 768px) 100vw, 280px"`,
    `width="360"`,
    `height="260"`,
    `loading="lazy"`,
    `decoding="async"`,
    `alt="${escapeHtml(alt)}"`,
  ].join(" ");
}

function formatPrice(property = {}) {
  return property.price || "Price on request";
}

function propertyArea(property = {}) {
  if (property.carpetArea) return `${property.carpetArea} sq.ft carpet area`;
  if (property.builtUpArea) return `${property.builtUpArea} sq.ft built-up area`;
  if (property.sqft) return `${property.sqft} sq.ft`;
  return property.area || "Area on request";
}

function uniqueValues(items, selector) {
  return [...new Set(items.map(selector).filter(Boolean).map(String))].sort((a, b) => a.localeCompare(b));
}

function pageMetaDescription(page, count) {
  return compact(
    `${count ? `Explore ${count} verified properties` : "Explore verified property options"} for sale in ${page.name}. Compare local listings, property types, BHK options, nearby areas, landmarks and supervisor contact with Akshar Estate.`,
    160
  );
}

function pagePlace(page = {}) {
  if (page.kind === "bhk") return `${page.localityName}, ${page.city}`;
  if (page.kind === "property-type") return `${page.locationName}, ${page.city}`;
  if (page.kind === "locality") return `${page.name}, ${page.city}`;
  return page.name || page.city || "Gujarat";
}

function buyerIntentText(page = {}) {
  const place = pagePlace(page);
  if (page.kind === "bhk") {
    return `${page.bhk} BHK buyers in ${place} usually compare usable carpet area, society quality, commute to work, parking, possession status and the final all-inclusive price before booking a visit.`;
  }
  if (page.kind === "property-type") {
    if (page.prefix === "plots-for-sale") return `Plot buyers in ${place} should verify title clarity, road access, zoning, plot dimensions, water/electricity availability, boundary status and resale demand.`;
    if (page.prefix === "commercial-property") return `Commercial property buyers in ${place} should compare frontage, footfall, parking, road width, signage visibility, ownership documents and tenant or business suitability.`;
    if (page.prefix === "industrial-property") return `Industrial property buyers in ${place} should check road width, loading access, power load, zoning, water supply, labour access and logistics connectivity.`;
  }
  return `Property buyers in ${place} usually compare location strength, active inventory, price, area, nearby services, site access, documentation and Akshar Estate supervisor guidance before shortlisting.`;
}

function priceContextText(page = {}, listings = []) {
  const prices = listings
    .map((property) => Number(property.priceAmount || 0))
    .filter((amount) => amount > 0)
    .sort((a, b) => a - b);
  if (prices.length >= 2) {
    const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    return `Current matching Akshar Estate listings in ${pagePlace(page)} range from ${formatter.format(prices[0])} to ${formatter.format(prices.at(-1))}. Confirm final price, payment terms and availability before a site visit.`;
  }
  if (prices.length === 1) {
    const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    return `The current matching Akshar Estate listing signal for ${pagePlace(page)} is around ${formatter.format(prices[0])}. Ask the team to confirm latest price and fresh alternatives.`;
  }
  return `Price movement in ${pagePlace(page)} depends on exact locality, road access, building age, project quality, plot dimensions, possession, documentation and negotiation room. Contact Akshar Estate for fresh inventory and current quote checks.`;
}

function documentChecklist(page = {}) {
  const base = ["property title and ownership chain", "sale deed or allotment details", "approved plan or layout where applicable", "tax or maintenance dues", "identity and authority of seller", "latest availability and price confirmation"];
  if (page.kind === "property-type" && page.prefix === "plots-for-sale") return [...base, "7/12 or land record extracts where applicable", "zoning and NA/NOC status", "road access proof"];
  if (page.kind === "property-type" && page.prefix === "commercial-property") return [...base, "use permission", "parking rights", "frontage and signage permissions", "tenant or lease terms if pre-leased"];
  return [...base, "RERA or project details where applicable", "society NOC where needed", "loan and possession documents"];
}

function answerSummary(page = {}, listings = []) {
  const count = listings.length;
  const place = pagePlace(page);
  const inventoryText = count ? `${count} active matching Akshar Estate ${count === 1 ? "listing" : "listings"}` : "fresh inventory support from Akshar Estate";
  return `${page.h1} is best evaluated through ${inventoryText}, locality context, document checks, supervisor contact and a confirmed site visit. Akshar Estate helps buyers compare verified options in ${place}.`;
}

function buildAnswerBlock(page, listings) {
  return `
      <section aria-label="Direct answer">
        <h2>Quick Answer</h2>
        <p><strong>${escapeHtml(answerSummary(page, listings))}</strong></p>
      </section>`;
}

function buildDepthSections(page, listings) {
  return `
      <section><h2>Buyer Intent</h2><p>${escapeHtml(buyerIntentText(page))}</p></section>
      <section><h2>Price Guidance</h2><p>${escapeHtml(priceContextText(page, listings))}</p></section>
      <section><h2>Documents to Check</h2>${plainList(documentChecklist(page))}</section>
      <section><h2>Site Visit Guidance</h2><p>Before visiting property in ${escapeHtml(pagePlace(page))}, share your budget, preferred property type, timeline and visit slot with Akshar Estate. The team can confirm availability, supervisor contact, meeting point and comparable nearby options.</p></section>`;
}

function contentClusterLinks(page) {
  const core = [
    { label: "Gandhinagar property guide", href: "/properties-for-sale/gandhinagar" },
    { label: "Ahmedabad property guide", href: "/properties-for-sale/ahmedabad" },
    { label: "Kudasan property guide", href: "/properties-for-sale/gandhinagar/kudasan" },
    { label: "Palaj property guide", href: "/properties-for-sale/gandhinagar/palaj" },
    { label: "Dhanap land and property guide", href: "/properties-for-sale/gandhinagar/dhanap" },
    { label: "GIFT City corridor property guide", href: "/properties-for-sale/gandhinagar/gift-city" },
    { label: "Shela property guide", href: "/properties-for-sale/ahmedabad/shela" },
    { label: "Ahmedabad West property guide", href: "/properties-for-sale/ahmedabad-west" },
    { label: "Commercial property on S.G. Highway", href: "/commercial-property/sg-highway" },
    { label: "Plots for sale in Palaj", href: "/plots-for-sale/palaj" },
    { label: "Sell or list your property", href: "/contact" },
  ];
  return core.filter((item) => item.href !== page.path);
}

function buildContentClusters(page) {
  return `<section><h2>Related Property Guides</h2><p>Continue research with nearby locality, property type and seller-intent pages from Akshar Estate.</p>${linkList(contentClusterLinks(page))}</section>`;
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
  res.end("<!doctype html><html lang=\"en-IN\"><head><title>Location Page Not Found | Akshar Estate</title><meta name=\"robots\" content=\"noindex\" /></head><body><h1>Location Page Not Found</h1><p>This location landing page is not available.</p></body></html>");
}

function linkList(items) {
  const links = items.filter(Boolean);
  if (!links.length) return "";
  return `<ul>${links.map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}</ul>`;
}

function plainList(items) {
  const values = items.filter(Boolean);
  if (!values.length) return "";
  return `<ul>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function breadcrumbItems(page) {
  return [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    ["locality", "bhk"].includes(page.kind) && { label: page.regionName || page.city, href: `/properties-for-sale/${page.regionSlug}` },
    page.kind === "bhk" && { label: page.localityName, href: `/properties-for-sale/${page.regionSlug}/${page.localitySlug}` },
    page.kind === "property-type" && { label: page.city, href: `/properties-for-sale/${slugifyLocation(page.city)}` },
    { label: page.name, href: page.path },
  ].filter(Boolean);
}

function buildBreadcrumbs(page) {
  const crumbs = breadcrumbItems(page);
  return `<nav aria-label="Breadcrumb">${crumbs.map((item, index) => `${index ? " / " : ""}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}</nav>`;
}

function buildFilterLinks(page, propertyTypes, bhkOptions) {
  const typeLinks = propertyTypes.map((type) => cleanTypeFilterLink(page, type)).filter(Boolean);
  const bhkLinks = bhkOptions.map((bhk) => cleanBhkFilterLink(page, bhk)).filter(Boolean);
  return `
    <section>
      <h2>Property Type Filters</h2>
      ${linkList(typeLinks) || "<p>Clean property type landing pages will appear here only when the combination has active inventory and unique SEO value.</p>"}
    </section>
    <section>
      <h2>Available BHK Options</h2>
      ${linkList(bhkLinks) || "<p>Clean BHK landing pages will appear here only when the combination has active inventory and search demand.</p>"}
    </section>`;
}

function cleanBhkFilterLink(page, bhk) {
  const label = `${bhk} BHK`;
  const baseRegion = page.regionSlug || slugifyLocation(page.city || "");
  const baseLocality = page.localitySlug || slugifyLocation(page.name || page.locationName || "");
  const clean = getBhkIntentPage(baseRegion, baseLocality, `${bhk}-bhk`);
  return clean ? { label, href: clean.path } : null;
}

function cleanTypeFilterLink(page, type) {
  const label = type;
  const locationSlug = page.localitySlug || page.locationSlug || slugifyLocation(page.name || page.locationName || "");
  const normalizedType = slugifyLocation(type);
  if (/plot|land/.test(normalizedType)) {
    const clean = getPropertyTypeIntentPage("plots-for-sale", locationSlug);
    if (clean) return { label, href: clean.path };
  }
  if (/commercial|office|shop|retail/.test(normalizedType)) {
    const clean = getPropertyTypeIntentPage("commercial-property", locationSlug);
    if (clean) return { label, href: clean.path };
  }
  if (/industrial|warehouse|factory/.test(normalizedType)) {
    const clean = getPropertyTypeIntentPage("industrial-property", locationSlug);
    if (clean) return { label, href: clean.path };
  }
  return null;
}

function cleanIntentFromQuery({ locationParam = "", bhkParam = "", typeParam = "" }) {
  const locationSlug = slugifyLocation(locationParam);
  if (locationSlug && bhkParam) {
    const bhk = String(bhkParam).replace(/[^0-9]/g, "");
    const page = INTENT_LANDING_PAGES.bhk.find((item) => item.localitySlug === locationSlug && String(item.bhk) === bhk);
    if (page) return page;
  }
  if (locationSlug && typeParam) {
    const normalizedType = slugifyLocation(typeParam);
    const prefix = /plot|land/.test(normalizedType)
      ? "plots-for-sale"
      : /commercial|office|shop|retail/.test(normalizedType)
        ? "commercial-property"
        : /industrial|warehouse|factory/.test(normalizedType)
          ? "industrial-property"
          : "";
    if (prefix) {
      const page = getPropertyTypeIntentPage(prefix, locationSlug);
      if (page) return page;
    }
  }
  return null;
}

function buildListings(listings) {
  if (!listings.length) {
    return "<p>No active matching properties are available right now. Contact Akshar Estate for fresh inventory in this location.</p>";
  }
  return `<ol>${listings.map((property) => `
    <li>
      <article>
        <img ${propertyImageAttributes(property)} style="max-width:280px;height:auto" />
        <h3><a href="${escapeHtml(propertyLink(property))}">${escapeHtml(property.title || `${propertyType(property)} in ${property.location || property.city}`)}</a></h3>
        <p>${escapeHtml([formatPrice(property), propertyArea(property), property.location, property.city].filter(Boolean).join(" | "))}</p>
      </article>
    </li>`).join("")}</ol>`;
}

function buildPagination(page, currentPage, totalPages) {
  if (totalPages <= 1) return "";
  const links = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    const href = pageNumber === 1 ? page.path : `${page.path}?page=${pageNumber}`;
    return { label: pageNumber === currentPage ? `Page ${pageNumber} current` : `Page ${pageNumber}`, href };
  });
  return `<nav aria-label="Pagination">${linkList(links)}</nav>`;
}

function buildNearbyLinks(page) {
  return (page.nearbyAreas || []).map((name) => ({
    label: `Properties in ${name}`,
    href: nearbyHref(page, name),
  }));
}

function buildRelatedBlogLinks(blogs = []) {
  return blogs.map((blog) => ({
    label: blog.title,
    href: `/blog/${blog.slug}`,
  }));
}

function nearbyHref(page, name) {
  const slug = slugifyLocation(name);
  if (page.kind === "locality" && getSaleLandingPage(page.regionSlug, slug)) {
    return `/properties-for-sale/${page.regionSlug}/${slug}`;
  }
  const regionSlug = page.regionSlug || slugifyLocation(page.city || page.name);
  const clean = getSaleLandingPage(regionSlug, slug);
  return clean?.path || `/properties-for-sale/${regionSlug}`;
}

function buildFaqs(page) {
  const faqs = [
    [`Is ${pagePlace(page)} a good location for property buyers?`, buyerIntentText(page)],
    [`Are there properties for sale in ${page.name}?`, `Yes. Active inventory is shown on this page when available, and empty or thin pages are kept noindex until useful listings exist.`],
    [`What should I check before buying property in ${page.name}?`, `Check ${documentChecklist(page).slice(0, 5).join(", ")} and latest availability before making a decision.`],
    [`Which property types are available in ${page.name}?`, `The property type filters on this page are generated from live Akshar Estate inventory for this location.`],
    [`How do I book a site visit in ${page.name}?`, "Use the contact CTA or open an individual property page. Akshar Estate can confirm availability, supervisor contact and visit timing."],
    [`What nearby areas should I compare with ${page.name}?`, `Common nearby areas include ${(page.nearbyAreas || []).slice(0, 4).join(", ") || "nearby localities in Gujarat"}.`],
  ];
  return `<section><h2>FAQs</h2>${faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</section>`;
}

function buildFaqSchema(page) {
  const questions = [
    [`Is ${pagePlace(page)} a good location for property buyers?`, buyerIntentText(page)],
    [`Are there properties for sale in ${page.name}?`, `Active inventory is shown when available, and empty or thin pages are noindex until useful listings exist.`],
    [`What should I check before buying property in ${page.name}?`, `Check ${documentChecklist(page).slice(0, 6).join(", ")} before shortlisting.`],
    [`Which areas are near ${page.name}?`, `Nearby areas include ${(page.nearbyAreas || []).join(", ") || "connected Gujarat localities"}.`],
    [`How can I contact Akshar Estate for ${page.name}?`, "Use the contact CTA or open an individual property page for assigned supervisor contact details."],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
  };
}

function jsonLd(data, id) {
  const idAttribute = id ? ` id="${escapeHtml(id)}"` : "";
  return `<script${idAttribute} type="application/ld+json">${schemaScriptContent(data)}</script>`;
}

function injectHtml(shell, page, context) {
  const { allListings, visibleListings, propertyTypes, bhkOptions, currentPage, totalPages, filtered, shouldIndex, relatedBlogs = [] } = context;
  const title = page.title;
  const description = page.metaDescription || pageMetaDescription(page, allListings.length);
  const robots = shouldIndex ? "index,follow,max-image-preview:large" : "noindex,follow";
  const firstImage = propertyImage(allListings[0]);
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<meta http-equiv="content-language" content="en-IN" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl(page))}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl(page))}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    firstImage ? `<meta property="og:image" content="${escapeHtml(firstImage)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    jsonLd(buildCollectionPageJsonLd(page, allListings, { breadcrumbs: breadcrumbItems(page) }), "akshar-schema-location-page"),
    jsonLd(buildFaqSchema(page), "akshar-schema-location-faq"),
  ].filter(Boolean).join("\n    ");

  const body = `
    <main class="akshar-location-seo" style="max-width:1120px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      ${buildBreadcrumbs(page)}
      <header>
        <p style="margin:16px 0 8px;color:#2563eb;font-weight:700">Akshar Estate: The Property Hub location guide</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        <p>${escapeHtml(allListings.length ? `${allListings.length} active matching listings found.` : "No active matching listings are available right now.")}</p>
        ${filtered ? "<p>This filtered view is noindex and points canonical signals to the main location page.</p>" : ""}
      </header>
      ${buildAnswerBlock(page, allListings)}
      ${buildFilterLinks(page, propertyTypes, bhkOptions)}
      <section><h2>Local Property Listings</h2>${buildListings(visibleListings)}${buildPagination(page, currentPage, totalPages)}</section>
      ${page.regionSlug ? `<section><h2>Parent Region</h2>${linkList([{ label: `Properties for sale in ${page.regionName || page.city || page.name}`, href: `/properties-for-sale/${page.regionSlug}` }])}</section>` : ""}
      <section><h2>Genuine Locality Introduction</h2><p>${escapeHtml(page.intro)}</p></section>
      ${buildDepthSections(page, allListings)}
      <section><h2>Nearby Areas</h2>${linkList(buildNearbyLinks(page))}</section>
      <section><h2>Important Landmarks</h2>${linkList((page.landmarks || []).map((name) => ({ label: `Properties near ${name}`, href: page.path })))}</section>
      <section><h2>Connectivity Information</h2><p>${escapeHtml(page.connectivity)}</p></section>
      ${buildContentClusters(page)}
      <section><h2>Internal Links</h2>${linkList([
        { label: "All properties", href: "/properties" },
        { label: `Properties for sale in ${page.city || page.name}`, href: `/properties-for-sale/${page.regionSlug || slugifyLocation(page.city || page.name)}` },
        ...buildNearbyLinks(page),
      ])}</section>
      <section><h2>Related Blog Posts</h2>${linkList(buildRelatedBlogLinks(relatedBlogs)) || "<p>Related Akshar Estate property guides will appear here after editorial review.</p>"}</section>
      ${buildFaqs(page)}
      <section><h2>Contact Akshar Estate</h2><p>Speak with Akshar Estate for verified property options, supervisor contact and fresh inventory in ${escapeHtml(page.name)}.</p><p><a href="/contact">Contact Akshar Estate for ${escapeHtml(page.name)} property enquiries</a></p></section>
    </main>`;

  return stripStaticSeo(shell)
    .replace(/<html([^>]*)>/i, '<html lang="en-IN">')
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || "", "https://www.aksharestate.in");
    const pathMatch = SALE_PATH_RE.exec(url.pathname);
    const typePathMatch = TYPE_PATH_RE.exec(url.pathname);
    const rawPrefix = firstQueryValue(req.query?.prefix) || typePathMatch?.[1] || "";
    const rawTypeLocation = firstQueryValue(req.query?.typeLocation) || typePathMatch?.[2] || "";
    const rawRegion = firstQueryValue(req.query?.region) || pathMatch?.[1] || "";
    const rawLocality = firstQueryValue(req.query?.locality) || pathMatch?.[2] || "";
    const rawIntent = firstQueryValue(req.query?.intent) || pathMatch?.[3] || "";
    const decodedPrefix = decodeURIComponent(String(rawPrefix));
    const decodedTypeLocation = rawTypeLocation ? decodeURIComponent(String(rawTypeLocation)) : "";
    const decodedRegion = decodeURIComponent(String(rawRegion));
    const decodedLocality = rawLocality ? decodeURIComponent(String(rawLocality)) : "";
    const decodedIntent = rawIntent ? decodeURIComponent(String(rawIntent)) : "";
    const prefix = slugifyLocation(decodedPrefix);
    const typeLocation = decodedTypeLocation ? slugifyLocation(decodedTypeLocation) : "";
    const region = slugifyLocation(decodedRegion);
    const locality = decodedLocality ? slugifyLocation(decodedLocality) : "";
    const intent = decodedIntent ? slugifyLocation(decodedIntent) : "";
    const page = prefix
      ? getPropertyTypeIntentPage(prefix, typeLocation)
      : intent
        ? getBhkIntentPage(region, locality, intent)
        : getSaleLandingPage(region, locality);
    if (!page) {
      notFound(res);
      return;
    }

    const expectedPath = page.path;
    const requestPath = prefix
      ? `/${prefix}/${typeLocation}`
      : `/properties-for-sale/${region}${locality ? `/${locality}` : ""}${intent ? `/${intent}` : ""}`;
    const pageParam = Math.max(1, Number(firstQueryValue(req.query?.page) || url.searchParams.get("page") || 1));
    const typeParam = firstQueryValue(req.query?.type) || url.searchParams.get("type") || "";
    const bhkParam = firstQueryValue(req.query?.bhk) || url.searchParams.get("bhk") || "";
    const locationParam = firstQueryValue(req.query?.location) || url.searchParams.get("location") || "";
    const allowedQueryKeys = new Set(["region", "locality", "intent", "prefix", "typeLocation", "page", "type", "bhk", "location"]);
    const hasNoise = [...url.searchParams.keys()].some((key) => !allowedQueryKeys.has(key));
    const cleanFromQuery = cleanIntentFromQuery({ locationParam, bhkParam, typeParam });
    if (cleanFromQuery && cleanFromQuery.path !== expectedPath) {
      redirect(res, cleanFromQuery.path);
      return;
    }
    if (cleanFromQuery && cleanFromQuery.path === expectedPath && (url.searchParams.has("location") || url.searchParams.has("bhk") || url.searchParams.has("type"))) {
      redirect(res, expectedPath);
      return;
    }
    const hasCaseOrSlugVariant =
      Boolean(prefix && (decodedPrefix !== prefix || decodedTypeLocation !== typeLocation)) ||
      Boolean(!prefix && (decodedRegion !== region || (decodedLocality && decodedLocality !== locality) || (decodedIntent && decodedIntent !== intent)));
    if (requestPath !== expectedPath || hasCaseOrSlugVariant || url.pathname.endsWith("/") || hasNoise || String(firstQueryValue(req.query?.slash) || "") === "1" || pageParam === 1 && url.searchParams.has("page")) {
      redirect(res, expectedPath);
      return;
    }

    const allProperties = (await fetchPublicProperties()).filter(isIndexableProperty);
    const relatedBlogs = await fetchPublicBlogs(page);
    const pageListings = allProperties.filter((property) => propertyMatchesPage(property, page));
    const propertyTypes = uniqueValues(pageListings, propertyType);
    const bhkOptions = uniqueValues(pageListings, propertyBhk).filter((value) => Number(value) > 0);
    const filteredListings = pageListings.filter((property) => {
      const typeMatches = !typeParam || propertyType(property).toLowerCase() === String(typeParam).toLowerCase();
      const bhkMatches = !bhkParam || propertyBhk(property) === Number(bhkParam);
      return typeMatches && bhkMatches;
    });
    const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));
    const safePage = Math.min(pageParam, totalPages);
    const visibleListings = filteredListings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const filtered = Boolean(typeParam || bhkParam || pageParam > 1);
    const shouldIndex = Boolean(page.verified && page.intro && pageListings.length > 0 && visibleListings.length > 0 && !filtered && !page.duplicateOf);

    const html = injectHtml(readIndexHtml(), page, {
      allListings: pageListings,
      visibleListings,
      propertyTypes,
      bhkOptions,
      currentPage: safePage,
      totalPages,
      filtered,
      shouldIndex,
      relatedBlogs,
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.end(html);
  } catch (error) {
    console.error("Sale landing route failed", error);
    notFound(res);
  }
}
