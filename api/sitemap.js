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

const STATIC_PAGES = [
  { path: "/", lastmod: "2026-07-22" },
  { path: "/properties", lastmod: "2026-07-22" },
  { path: "/new-projects", lastmod: "2026-07-22" },
  { path: "/about", lastmod: "2026-07-22" },
  { path: "/services", lastmod: "2026-07-22" },
  { path: "/contact", lastmod: "2026-07-22" },
  { path: "/privacy-policy", lastmod: "2026-07-22" },
  { path: "/terms-of-service", lastmod: "2026-07-22" },
];

const SITEMAP_FILES = [
  "sitemap-pages.xml",
  "sitemap-properties.xml",
  "sitemap-locations.xml",
  "sitemap-property-types.xml",
  "sitemap-blog.xml",
];
const SITEMAP_PROPERTY_STATUSES = ["active", "published", "available", "reserved", "sold", "rented"];

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(pathname) {
  return `${SITE_ORIGIN}${pathname}`;
}

function cleanDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

async function fetchPublicProperties() {
  const response = await fetch(`${API_BASE_URL}/public/properties?limit=100&sort=updatedAt&order=desc`);
  if (!response.ok) return [];
  const body = await response.json();
  return Array.isArray(body?.data) ? body.data : [];
}

async function fetchPublicBlogs() {
  const response = await fetch(`${API_BASE_URL}/public/blogs?limit=50`);
  if (!response.ok) return [];
  const body = await response.json();
  return Array.isArray(body?.data) ? body.data : [];
}

function propertyBhk(property = {}) {
  return Number(property.bhk || property.beds || 0);
}

function propertyText(property = {}) {
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

function pageLocationSlugs(page, fallbackSlug = "") {
  return [fallbackSlug, ...(page.matchSlugs || [])].filter(Boolean);
}

function propertyLocationSlug(property = {}) {
  return slugifyLocation(property.locationMaster?.name || property.location || property.map?.area || "");
}

function propertyMatchesPage(property, page) {
  const locationSlug = propertyLocationSlug(property);
  const citySlug = slugifyLocation(property.city || property.map?.city || "");
  if (page.kind === "locality") return pageLocationSlugs(page, page.slug).some((slug) => slugContainsLocation(locationSlug, slug));
  if (page.kind === "region" && page.locations?.length) {
    return page.locations.map(slugifyLocation).some((slug) => slugContainsLocation(locationSlug, slug) || citySlug === slug);
  }
  if (page.kind === "region") return citySlug === slugifyLocation(page.city || page.name);
  if (page.kind === "bhk") return pageLocationSlugs(page, page.localitySlug).some((slug) => slugContainsLocation(locationSlug, slug)) && propertyBhk(property) === Number(page.bhk);
  if (page.kind === "property-type") {
    return pageLocationSlugs(page, page.locationSlug).some((slug) => slugContainsLocation(locationSlug, slug)) &&
      (page.typeMatchers || []).some((matcher) => propertyText(property).includes(String(matcher).toLowerCase()));
  }
  return false;
}

function salePages() {
  return [
    ...SALE_LANDING_PAGES.regions.map((page) => ({ ...page, kind: "region", path: `/properties-for-sale/${page.slug}` })),
    ...SALE_LANDING_PAGES.localities.map((page) => ({ ...page, kind: "locality", path: `/properties-for-sale/${page.regionSlug}/${page.slug}` })),
  ];
}

function newestLastmod(matches) {
  return matches
    .map((property) => property.lastModifiedAt || property.updatedAt || property.publishedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || "";
}

function dedupe(entries) {
  const seen = new Map();
  entries.forEach((entry) => {
    if (!entry?.path || entry.path.includes("?") || entry.path.includes("/admin") || entry.path.includes("/supervisor")) return;
    seen.set(entry.path, entry);
  });
  return [...seen.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function activeInventoryPageEntries(properties, pages) {
  return pages.flatMap((page) => {
    const matches = properties.filter((property) => propertyMatchesPage(property, page));
    if (!page.verified || !page.intro || !matches.length) return [];
    return [{ path: page.path, lastmod: newestLastmod(matches) }];
  });
}

function pageEntries() {
  return STATIC_PAGES;
}

function propertyEntries(properties) {
  return properties
    .filter((property) =>
      property.slug &&
      SITEMAP_PROPERTY_STATUSES.includes(String(property.status || "").toLowerCase()) &&
      property.isIndexable !== false &&
      !property.deletedAt &&
      property.visibility !== "private"
    )
    .map((property) => ({
      path: `/property/${property.slug}`,
      lastmod: property.lastModifiedAt || property.updatedAt || property.publishedAt,
    }));
}

function locationEntries(properties) {
  return activeInventoryPageEntries(properties, salePages());
}

function propertyTypeEntries(properties) {
  return activeInventoryPageEntries(properties, INTENT_LANDING_PAGES.all);
}

function blogEntries(blogs) {
  return blogs
    .filter((blog) => blog.slug && blog.isIndexable !== false && !blog.deletedAt)
    .map((blog) => ({
      path: `/blog/${blog.slug}`,
      lastmod: blog.updatedAt || blog.publishedAt,
    }));
}

function urlEntry({ path, lastmod }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(absoluteUrl(path))}</loc>`,
    cleanDate(lastmod) ? `    <lastmod>${escapeXml(cleanDate(lastmod))}</lastmod>` : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

function urlset(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...dedupe(entries).map(urlEntry),
    '</urlset>',
  ].join("\n");
}

function sitemapIndex(lastmod) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...SITEMAP_FILES.map((file) => [
      "  <sitemap>",
      `    <loc>${escapeXml(absoluteUrl(`/${file}`))}</loc>`,
      cleanDate(lastmod) ? `    <lastmod>${escapeXml(cleanDate(lastmod))}</lastmod>` : "",
      "  </sitemap>",
    ].filter(Boolean).join("\n")),
    '</sitemapindex>',
  ].join("\n");
}

function requestedSitemap(req) {
  const url = new URL(req.url || "/sitemap.xml", "https://www.aksharestate.in");
  return url.pathname.split("/").pop() || "sitemap.xml";
}

export default async function handler(req, res) {
  const file = requestedSitemap(req);
  const [properties, blogs] = await Promise.all([fetchPublicProperties(), fetchPublicBlogs()]);
  const blogLastmod = blogs.map((blog) => blog.updatedAt || blog.publishedAt).filter(Boolean).sort().at(-1);
  const lastmod = [newestLastmod(properties), blogLastmod, "2026-07-22"].filter(Boolean).sort().at(-1);
  const feeds = {
    "sitemap-pages.xml": pageEntries(),
    "sitemap-properties.xml": propertyEntries(properties),
    "sitemap-locations.xml": locationEntries(properties),
    "sitemap-property-types.xml": propertyTypeEntries(properties),
    "sitemap-blog.xml": blogEntries(blogs),
  };

  const xml = file === "sitemap.xml"
    ? sitemapIndex(lastmod)
    : urlset(feeds[file] || []);

  res.statusCode = SITEMAP_FILES.includes(file) || file === "sitemap.xml" ? 200 : 404;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.end(xml);
}
