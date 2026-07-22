import fs from "node:fs";
import path from "node:path";
import { BUSINESS_INFO } from "../src/config/businessInfo.js";
import { SITE_ORIGIN } from "../src/config/locationLandingPages.js";
import { buildBreadcrumbSchema, schemaScriptContent } from "../src/utils/structuredData.js";

const PUBLIC_PAGES = {
  "/": {
    title: "Akshar Estate The Property HUB",
    description: "Discover verified residential, commercial, rental and land opportunities across Gujarat with Akshar Estate The Property HUB.",
    h1: "Akshar Estate The Property HUB",
    body: "Find verified residential, commercial, rental and land opportunities across Gandhinagar, Ahmedabad and nearby Gujarat property markets.",
    links: [
      ["/properties-for-sale/gandhinagar", "Properties for sale in Gandhinagar"],
      ["/properties-for-sale/gandhinagar/dhanap", "Properties in Dhanap"],
      ["/properties-for-sale/ahmedabad/memnagar", "Properties in Memnagar"],
      ["/properties", "All properties"],
    ],
  },
  "/properties": {
    title: "Properties for Sale and Rent in Gujarat | Akshar Estate",
    description: "Browse verified Akshar Estate property listings across Gandhinagar, Ahmedabad and nearby Gujarat locations with supervisor contact and fresh inventory.",
    h1: "Properties for Sale and Rent in Gujarat",
    body: "Browse active Akshar Estate listings by location, property type, BHK, price and availability.",
    links: [
      ["/properties-for-sale/gandhinagar", "Properties for sale in Gandhinagar"],
      ["/properties-for-sale/ahmedabad", "Properties for sale in Ahmedabad"],
      ["/properties-for-sale/gandhinagar/dhanap", "Properties for sale in Dhanap"],
    ],
  },
  "/new-projects": {
    title: "New Property Projects in Gujarat | Akshar Estate",
    description: "Explore new project property options across Gandhinagar, Ahmedabad and nearby Gujarat locations with Akshar Estate.",
    h1: "New Property Projects in Gujarat",
    body: "Track new project opportunities and contact Akshar Estate for verified project details.",
    links: [["/properties", "Browse all properties"]],
  },
  "/about": {
    title: "About Akshar Estate The Property HUB | Gandhinagar Real Estate",
    description: "Learn about Akshar Estate The Property HUB, a Gandhinagar-based real estate team serving buyers, sellers and investors across Gujarat.",
    h1: "About Akshar Estate The Property HUB",
    body: "Akshar Estate supports property buyers, sellers, renters and investors with verified real estate opportunities across Gujarat.",
    links: [["/contact", "Contact Akshar Estate"], ["/properties", "Browse properties"]],
  },
  "/services": {
    title: "Real Estate Services in Gandhinagar and Ahmedabad | Akshar Estate",
    description: "Akshar Estate offers property buying, selling, rental, investment and supervisor-assisted real estate services across Gujarat.",
    h1: "Real Estate Services",
    body: "Get support for buying, selling, renting and evaluating real estate opportunities across Gandhinagar, Ahmedabad and nearby markets.",
    links: [["/contact", "Ask for property assistance"], ["/properties-for-sale/gandhinagar", "Gandhinagar properties"]],
  },
  "/contact": {
    title: "Contact Akshar Estate | Property Experts in Gandhinagar",
    description: "Contact Akshar Estate The Property HUB for verified property options, supervisor details and real estate guidance in Gujarat.",
    h1: "Contact Akshar Estate",
    body: `${BUSINESS_INFO.name} can help with property enquiries across Gandhinagar, Ahmedabad and nearby Gujarat locations.`,
    links: [["/properties", "Browse properties"], ["/properties-for-sale/gandhinagar", "Gandhinagar properties"]],
  },
  "/blog": {
    title: "Property Guides and Real Estate Articles | Akshar Estate",
    description: "Read Akshar Estate property guides for Gandhinagar, Ahmedabad, localities, BHK choices and real estate planning.",
    h1: "Property Guides",
    body: "Akshar Estate property guides will appear here after editorial review.",
    links: [["/properties", "Browse properties"], ["/properties-for-sale/gandhinagar", "Properties in Gandhinagar"]],
  },
  "/privacy-policy": {
    title: "Privacy Policy | Akshar Estate",
    description: "Read the Akshar Estate privacy policy for website users, property enquiries and communication handling.",
    h1: "Privacy Policy",
    body: "Akshar Estate handles website and enquiry information according to its privacy policy.",
    links: [["/contact", "Contact Akshar Estate"]],
  },
  "/terms-of-service": {
    title: "Terms of Service | Akshar Estate",
    description: "Read the Akshar Estate website terms for property browsing, enquiries and use of the platform.",
    h1: "Terms of Service",
    body: "These terms apply to use of the Akshar Estate website and property enquiry features.",
    links: [["/contact", "Contact Akshar Estate"]],
  },
};

const PRIVATE_PAGES = {
  "/login": ["Login | Akshar Estate", "Staff and user login is not intended for search indexing."],
  "/register": ["Register | Akshar Estate", "Registration is not intended for search indexing."],
  "/stafflogin": ["Staff Login | Akshar Estate", "Staff login is not intended for search indexing."],
  "/admin-dashboard": ["Admin Dashboard Login | Akshar Estate", "Admin dashboard access is private."],
  "/supervisor-dashboard": ["Supervisor Dashboard Login | Akshar Estate", "Supervisor dashboard access is private."],
  "/saved": ["Saved Properties | Akshar Estate", "Saved-property account pages are private."],
  "/profile": ["Profile | Akshar Estate", "Profile account pages are private."],
  "/admin": ["Admin Panel | Akshar Estate", "Admin pages are private."],
  "/supervisor": ["Supervisor Panel | Akshar Estate", "Supervisor pages are private."],
  "/purchase": ["Filtered Property Search | Akshar Estate", "Filtered property-search URLs are noindex to avoid duplicate SEO pages."],
  "/home": ["Akshar Estate Home Preview", "This duplicate home route is noindex."],
  "/pricing": ["Property Search | Akshar Estate", "This filtered search surface is noindex unless represented by a clean SEO landing page."],
  "/enquiry": ["Property Enquiry | Akshar Estate", "Enquiry form pages are noindex and available to users."],
};

function readIndexHtml() {
  const candidates = [
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  return "<!doctype html><html lang=\"en-IN\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /></head><body><div id=\"root\"></div></body></html>";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function normalizedPath(req) {
  const rawPath = Array.isArray(req.query?.path) ? req.query.path[0] : req.query?.path || "";
  const pathFromQuery = rawPath ? `/${String(rawPath).replace(/^\/+|\/+$/g, "")}` : "";
  const url = new URL(req.url || "/", SITE_ORIGIN);
  const pathFromUrl = url.pathname.replace(/\/+$/g, "") || "/";
  return pathFromQuery || pathFromUrl;
}

function jsonLd(data, id) {
  return `<script id="${escapeHtml(id)}" type="application/ld+json">${schemaScriptContent(data)}</script>`;
}

function linkList(links = []) {
  return links.length
    ? `<ul>${links.map(([href, label]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join("")}</ul>`
    : "";
}

function injectShell({ shell, pathname, title, description, robots, statusCode, pageBody, extraJsonLd = [] }) {
  const canonical = `${SITE_ORIGIN}${pathname}`;
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<meta http-equiv="content-language" content="en-IN" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(BUSINESS_INFO.logo)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    ...extraJsonLd,
  ].join("\n    ");
  const html = stripStaticSeo(shell)
    .replace(/<html([^>]*)>/i, '<html lang="en-IN">')
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${pageBody}</div>`);
  return { statusCode, html };
}

function publicPage(shell, pathname, page) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    pathname !== "/" && { label: page.h1, href: pathname },
  ].filter(Boolean);
  const body = `
    <main class="akshar-static-seo" style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <nav aria-label="Breadcrumb">${breadcrumbs.map((item, index) => `${index ? " / " : ""}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}</nav>
      <h1>${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.body)}</p>
      ${linkList(page.links)}
    </main>`;
  return injectShell({
    shell,
    pathname,
    title: page.title,
    description: page.description,
    robots: "index,follow,max-image-preview:large",
    statusCode: 200,
    pageBody: body,
    extraJsonLd: [
      jsonLd(buildBreadcrumbSchema(breadcrumbs), "akshar-schema-page-breadcrumb"),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${SITE_ORIGIN}${pathname}`,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      }, "akshar-schema-webpage"),
    ],
  });
}

function privatePage(shell, pathname, [title, description]) {
  const body = `<main style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif"><h1>${escapeHtml(title.replace(" | Akshar Estate", ""))}</h1><p>${escapeHtml(description)}</p></main>`;
  return injectShell({ shell, pathname, title, description, robots: "noindex,nofollow", statusCode: 200, pageBody: body });
}

function notFoundPage(shell, pathname) {
  const title = "Page Not Found | Akshar Estate";
  const description = "This Akshar Estate page could not be found. Browse active properties or contact the team for property assistance.";
  const body = `<main style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif"><h1>Page Not Found</h1><p>${escapeHtml(description)}</p><p><a href="/properties">Browse active properties</a></p></main>`;
  return injectShell({ shell, pathname, title, description, robots: "noindex,follow", statusCode: 404, pageBody: body });
}

function privateMatch(pathname) {
  const match = Object.entries(PRIVATE_PAGES).find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match?.[1] || null;
}

export default function handler(req, res) {
  const shell = readIndexHtml();
  const pathname = normalizedPath(req);
  const result = PUBLIC_PAGES[pathname]
    ? publicPage(shell, pathname, PUBLIC_PAGES[pathname])
    : privateMatch(pathname)
      ? privatePage(shell, pathname, privateMatch(pathname))
      : notFoundPage(shell, pathname);
  res.statusCode = result.statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", result.statusCode === 404 ? "no-store" : "public, max-age=0, must-revalidate");
  res.end(result.html);
}
