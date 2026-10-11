import fs from "node:fs";
import path from "node:path";
import { BUSINESS_INFO } from "../src/config/businessInfo.js";
import { SITE_ORIGIN } from "../src/config/locationLandingPages.js";
import { buildBreadcrumbSchema, buildBusinessSchemas, schemaScriptContent } from "../src/utils/structuredData.js";

const PUBLIC_PAGES = {
  "/": {
    title: "Akshar Estate | Real Estate in Ahmedabad and Gandhinagar",
    description: "Find verified property in Ahmedabad and Gandhinagar with Akshar Estate: flats, plots, shops, offices, houses and commercial real estate leads.",
    h1: "Akshar Estate The Property HUB",
    body: "Find verified residential, commercial, rental and land opportunities across Ahmedabad, Gandhinagar and nearby Gujarat property markets.",
    answer: "Akshar Estate The Property HUB is a Gandhinagar-based real estate agency helping buyers, sellers, renters and investors find verified flats, plots, land, shops, offices and new project opportunities across Gandhinagar, Ahmedabad and nearby Gujarat markets.",
    links: [
      ["/properties-for-sale/ahmedabad", "Property in Ahmedabad"],
      ["/properties-for-sale/gandhinagar", "Properties for sale in Gandhinagar"],
      ["/properties-for-sale/gandhinagar/palaj", "Properties in Palaj"],
      ["/properties-for-sale/gandhinagar/dhanap", "Properties in Dhanap"],
      ["/properties-for-sale/ahmedabad/memnagar", "Properties in Memnagar"],
      ["/properties", "All properties"],
    ],
  },
  "/properties": {
    title: "Property in Ahmedabad and Gandhinagar | Akshar Estate",
    description: "Browse verified flats, plots, shops, offices, houses and commercial property in Ahmedabad, Gandhinagar and nearby Akshar Estate locations.",
    h1: "Properties for Sale and Rent in Gujarat",
    body: "Browse active Akshar Estate listings by location, property type, BHK, price and availability.",
    answer: "Use Akshar Estate to compare active property listings with photos, price, area, locality, property code, supervisor contact and site-visit support before shortlisting.",
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
    answer: "Akshar Estate helps buyers review new project options by location, possession status, amenities, pricing, documentation and site-visit availability.",
    links: [["/properties", "Browse all properties"]],
  },
  "/about": {
    title: "About Akshar Estate The Property HUB | Gandhinagar Real Estate",
    description: "Learn about Akshar Estate The Property HUB, a Gandhinagar-based real estate team serving buyers, sellers and investors across Gujarat.",
    h1: "About Akshar Estate The Property HUB",
    body: "Akshar Estate supports property buyers, sellers, renters and investors with verified real estate opportunities across Gujarat.",
    answer: "Akshar Estate The Property HUB is a local real estate team in Gandhinagar serving property buyers, sellers, renters and investors across Gandhinagar, Ahmedabad and nearby Gujarat locations.",
    links: [["/contact", "Contact Akshar Estate"], ["/properties", "Browse properties"]],
  },
  "/services": {
    title: "Real Estate Services in Gandhinagar and Ahmedabad | Akshar Estate",
    description: "Akshar Estate offers buying, selling, rental, investment and supervisor-assisted real estate services in Ahmedabad, Gandhinagar and Gujarat.",
    h1: "Real Estate Services",
    body: "Get support for buying, selling, renting and evaluating real estate opportunities across Gandhinagar, Ahmedabad and nearby markets.",
    answer: "Akshar Estate provides property buying, selling, rental, commercial property, plot and land, investment and site-visit coordination services in Gandhinagar, Ahmedabad and nearby Gujarat markets.",
    links: [["/contact", "Ask for property assistance"], ["/properties-for-sale/gandhinagar", "Gandhinagar properties"]],
  },
  "/contact": {
    title: "Contact Akshar Estate | Ahmedabad and Gandhinagar Property Experts",
    description: "Contact Akshar Estate for verified property options, WhatsApp enquiries, supervisor details and real estate guidance in Ahmedabad and Gandhinagar.",
    h1: "Contact Akshar Estate",
    body: `${BUSINESS_INFO.name} can help with property enquiries across Gandhinagar, Ahmedabad and nearby Gujarat locations.`,
    answer: `Contact ${BUSINESS_INFO.name} by phone, email or website enquiry for verified property options, seller support, commercial property enquiries and supervised site visits in Gandhinagar and Ahmedabad.`,
    links: [["/properties", "Browse properties"], ["/properties-for-sale/gandhinagar", "Gandhinagar properties"]],
  },
  "/privacy-policy": {
    title: "Privacy Policy | Akshar Estate",
    description: "Read the Akshar Estate privacy policy for website users, property enquiries and communication handling.",
    h1: "Privacy Policy",
    body: "Akshar Estate handles website and enquiry information according to its privacy policy.",
    answer: "The Akshar Estate privacy policy explains how website, enquiry and communication information is handled for property users.",
    links: [["/contact", "Contact Akshar Estate"]],
  },
  "/terms-of-service": {
    title: "Terms of Service | Akshar Estate",
    description: "Read the Akshar Estate website terms for property browsing, enquiries and use of the platform.",
    h1: "Terms of Service",
    body: "These terms apply to use of the Akshar Estate website and property enquiry features.",
    answer: "The Akshar Estate terms apply to website browsing, property enquiries, user submissions and platform communication.",
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

const NOINDEX_FOLLOW_PAGES = {
  "/blog": ["Property Guides | Akshar Estate", "The blog index is noindex until published editorial guides are available."],
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

function replaceRoot(html, body) {
  const root = `<div id="root">${body}</div>`;
  if (/<div id="root">[\s\S]*?<\/div>\s*(?=<script|<noscript|<\/body>)/i.test(html)) {
    return html.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<script|<noscript|<\/body>)/i, root);
  }
  return html.replace("</body>", `${root}</body>`);
}

function normalizedPath(req) {
  const rawPath = Array.isArray(req.query?.path) ? req.query.path[0] : req.query?.path || "";
  if (rawPath === "__root") return "/";
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

function answerBlock(page) {
  return `
      <section aria-label="Direct answer">
        <h2>Quick Answer</h2>
        <p><strong>${escapeHtml(page.answer || page.body)}</strong></p>
      </section>`;
}

function serviceClusterLinks(pathname) {
  const links = [
    ["/properties-for-sale/gandhinagar", "Verified property in Gandhinagar"],
    ["/properties-for-sale/ahmedabad", "Verified property in Ahmedabad"],
    ["/properties-for-sale/gandhinagar/kudasan", "Kudasan property guide"],
    ["/properties-for-sale/gandhinagar/palaj", "Palaj property guide"],
    ["/properties-for-sale/gandhinagar/dhanap", "Dhanap property guide"],
    ["/properties-for-sale/gandhinagar/gift-city", "GIFT City corridor property"],
    ["/properties-for-sale/ahmedabad/shela", "Shela property guide"],
    ["/commercial-property/sg-highway", "Commercial property on S.G. Highway"],
    ["/plots-for-sale/palaj", "Plots for sale in Palaj"],
    ["/contact", "Sell or list your property"],
  ];
  return links.filter(([href]) => href !== pathname);
}

function contentClusters(pathname) {
  return `
      <section aria-label="Property topic clusters">
        <h2>Property Topic Clusters</h2>
        <p>Explore Akshar Estate guides and active inventory by city, locality, property type and seller intent.</p>
        ${linkList(serviceClusterLinks(pathname))}
      </section>`;
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
    ;
  return { statusCode, html: replaceRoot(html, pageBody) };
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
      ${answerBlock(page)}
      ${linkList(page.links)}
      ${contentClusters(pathname)}
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
      jsonLd(buildBusinessSchemas({ path: pathname, pageName: page.h1, includeBreadcrumbs: false }), "akshar-schema-business-entity"),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: page.title,
        description: page.description,
        url: `${SITE_ORIGIN}${pathname}`,
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        about: { "@id": `${SITE_ORIGIN}/#realestateagent` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".akshar-static-seo h1", ".akshar-static-seo section[aria-label='Direct answer']"],
        },
      }, "akshar-schema-webpage"),
    ],
  });
}

function privatePage(shell, pathname, [title, description]) {
  const body = `<main style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif"><h1>${escapeHtml(title.replace(" | Akshar Estate", ""))}</h1><p>${escapeHtml(description)}</p></main>`;
  return injectShell({ shell, pathname, title, description, robots: "noindex,nofollow", statusCode: 200, pageBody: body });
}

function noindexFollowPage(shell, pathname, [title, description]) {
  const body = `<main style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif"><h1>${escapeHtml(title.replace(" | Akshar Estate", ""))}</h1><p>${escapeHtml(description)}</p><p><a href="/properties">Browse active properties</a></p></main>`;
  return injectShell({ shell, pathname, title, description, robots: "noindex,follow", statusCode: 200, pageBody: body });
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
    : NOINDEX_FOLLOW_PAGES[pathname]
      ? noindexFollowPage(shell, pathname, NOINDEX_FOLLOW_PAGES[pathname])
    : privateMatch(pathname)
      ? privatePage(shell, pathname, privateMatch(pathname))
      : notFoundPage(shell, pathname);
  res.statusCode = result.statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", result.statusCode === 404 ? "no-store" : "public, max-age=0, must-revalidate");
  res.end(result.html);
}
