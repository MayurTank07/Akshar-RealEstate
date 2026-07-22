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

function readIndexHtml() {
  const candidates = [
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "index.html"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate, "utf8");
  }
  return "<!doctype html><html><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Akshar Estate: The Property Hub</title></head><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>";
}

function buildPropertyMeta(property, slug) {
  const title = compact(property.seoTitle || property.title || "Property for Sale | Akshar Estate", 70);
  const description = compact(
    property.metaDescription ||
      property.description ||
      `Explore this property in ${property.location || property.city || "Gujarat"}. View price, area, photos, location and contact details.`,
    160
  );
  const url = canonicalUrl(slug, property);
  const image = property.image || property.gallery?.[0] || "";

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  ].filter(Boolean).join("\n    ");
}

function injectPropertyMeta(html, property, slug) {
  const meta = buildPropertyMeta(property, slug);
  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  const withMeta = withoutTitle.includes("</head>")
    ? withoutTitle.replace("</head>", `    ${meta}\n  </head>`)
    : `${meta}\n${withoutTitle}`;
  const noscript = buildNoscriptProperty(property);
  return withMeta.includes('<div id="root"></div>')
    ? withMeta.replace('<div id="root"></div>', `<div id="root"></div>${noscript}`)
    : withMeta.replace("</body>", `${noscript}</body>`);
}

function buildNoscriptProperty(property) {
  const details = [
    property.priceLabel || property.price,
    property.location || property.city,
    property.carpetArea ? `${property.carpetArea} carpet area` : "",
    property.builtUpArea ? `${property.builtUpArea} built-up area` : "",
  ].filter(Boolean).join(" | ");

  return `<noscript><main style="max-width:960px;margin:40px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6;color:#0f172a"><h1>${escapeHtml(property.title || "Property Details")}</h1><p>${escapeHtml(details)}</p><p>${escapeHtml(property.description || property.metaDescription || "Contact Akshar Estate for property details.")}</p><p><a href="/properties">View more properties</a></p></main></noscript>`;
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

    const html = injectPropertyMeta(readIndexHtml(), property, property.slug);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.end(html);
  } catch (error) {
    console.error("Property route handler failed", error);
    notFound(res);
  }
}
