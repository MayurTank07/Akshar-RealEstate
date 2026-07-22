import {
  INTENT_LANDING_PAGES,
  SALE_LANDING_PAGES,
  SITE_ORIGIN,
  slugifyLocation,
} from "../src/config/locationLandingPages.js";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://akshar-realestate-backend.onrender.com/api";

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchPublicProperties() {
  const response = await fetch(`${API_BASE_URL}/public/properties?limit=100&sort=updatedAt&order=desc`);
  if (!response.ok) return [];
  const body = await response.json();
  return Array.isArray(body?.data) ? body.data : [];
}

function propertyBhk(property = {}) {
  return Number(property.bhk || property.beds || 0);
}

function propertyTypeText(property = {}) {
  return [
    property.type,
    property.propertyType,
    property.category,
    property.title,
    property.description,
    ...(property.propertyTags || []),
  ].join(" ").toLowerCase();
}

function slugContainsLocation(haystackSlug = "", needleSlug = "") {
  if (!haystackSlug || !needleSlug) return false;
  return haystackSlug === needleSlug ||
    haystackSlug.startsWith(`${needleSlug}-`) ||
    haystackSlug.endsWith(`-${needleSlug}`) ||
    haystackSlug.includes(`-${needleSlug}-`);
}

function propertyLocationSlug(property = {}) {
  return slugifyLocation(property.locationMaster?.name || property.location || property.map?.area || "");
}

function propertyMatchesPage(property, page) {
  const locationSlug = propertyLocationSlug(property);
  const citySlug = slugifyLocation(property.city || property.map?.city || "");
  if (page.kind === "locality") return slugContainsLocation(locationSlug, page.slug);
  if (page.kind === "region" && page.locations?.length) {
    return page.locations.map(slugifyLocation).some((slug) => slugContainsLocation(locationSlug, slug) || citySlug === slug);
  }
  if (page.kind === "region") return citySlug === slugifyLocation(page.city || page.name);
  if (page.kind === "bhk") return slugContainsLocation(locationSlug, page.localitySlug) && propertyBhk(property) === Number(page.bhk);
  if (page.kind === "property-type") {
    return slugContainsLocation(locationSlug, page.locationSlug) &&
      (page.typeMatchers || []).some((matcher) => propertyTypeText(property).includes(String(matcher).toLowerCase()));
  }
  return false;
}

function urlEntry(path, lastmod = "") {
  return [
    "  <url>",
    `    <loc>${escapeXml(`${SITE_ORIGIN}${path}`)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

function salePages() {
  return [
    ...SALE_LANDING_PAGES.regions.map((page) => ({ ...page, kind: "region", path: `/properties-for-sale/${page.slug}` })),
    ...SALE_LANDING_PAGES.localities.map((page) => ({ ...page, kind: "locality", path: `/properties-for-sale/${page.regionSlug}/${page.slug}` })),
  ];
}

export default async function handler(req, res) {
  const properties = await fetchPublicProperties();
  const urls = new Map();

  properties
    .filter((property) => property.slug && property.isIndexable !== false)
    .forEach((property) => urls.set(`/property/${property.slug}`, property.lastModifiedAt || property.updatedAt));

  [...salePages(), ...INTENT_LANDING_PAGES.all].forEach((page) => {
    const matches = properties.filter((property) => propertyMatchesPage(property, page));
    if (page.verified && page.intro && matches.length > 0) {
      const newest = matches.map((property) => property.lastModifiedAt || property.updatedAt).filter(Boolean).sort().at(-1);
      urls.set(page.path, newest);
    }
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...urls.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([path, lastmod]) => urlEntry(path, lastmod)),
    '</urlset>',
  ].join("\n");

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.end(xml);
}
