import fs from "node:fs";
import path from "node:path";
import { PROPERTY_IMAGE_FALLBACK, optimizedImageUrl } from "../src/utils/imageSeo.js";
import { buildBlogPostingJsonLd, buildBreadcrumbSchema, schemaScriptContent } from "../src/utils/structuredData.js";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://akshar-realestate-backend.onrender.com/api";
const SITE_ORIGIN = (process.env.SITE_ORIGIN || process.env.FRONTEND_URL || "https://www.aksharestate.in").replace(/\/$/, "");
const BLOG_PATH_RE = /^\/blog\/([^/?#]+)\/?/i;

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
  return `/blog/${slug}`;
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

async function fetchBlog(slug) {
  const response = await fetch(`${API_BASE_URL}/public/blogs/${encodeURIComponent(slug)}`);
  if (!response.ok) return null;
  const body = await response.json();
  return body?.data || null;
}

function jsonLdScript(data, id) {
  return `<script id="${escapeHtml(id)}" type="application/ld+json">${schemaScriptContent(data)}</script>`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function linkList(items) {
  const links = items.filter(Boolean);
  if (!links.length) return "";
  return `<ul>${links.map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}</ul>`;
}

function locationHref(name) {
  const slug = String(name || "").toLowerCase().trim().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (slug === "gandhinagar") return "/properties-for-sale/gandhinagar";
  if (slug === "ahmedabad") return "/properties-for-sale/ahmedabad";
  if (["kudasan", "sargasan", "vavol", "pethapur", "gift-city"].includes(slug)) return `/properties-for-sale/gandhinagar/${slug}`;
  return `/properties-for-sale/ahmedabad/${slug}`;
}

function buildBlogPage(blog) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Property Guides", href: "/blog" },
    { label: blog.title, href: canonicalPath(blog.slug) },
  ];
  return `
    <main class="akshar-blog-seo" style="max-width:900px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;line-height:1.7;color:#0f172a">
      <nav aria-label="Breadcrumb" style="font-size:14px;margin-bottom:16px">
        ${breadcrumbs.map((item, index) => `${index ? " / " : ""}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
      </nav>
      <article>
        <header>
          <p style="margin:0 0 8px;color:#2563eb;font-weight:700">${escapeHtml(blog.category || "Property Guide")}</p>
          <h1 style="font-size:36px;line-height:1.2;margin:0 0 12px">${escapeHtml(blog.title)}</h1>
          <p>${escapeHtml([blog.author, formatDate(blog.publishedAt)].filter(Boolean).join(" | "))}</p>
          ${blog.excerpt ? `<p>${escapeHtml(blog.excerpt)}</p>` : ""}
        </header>
        ${blog.featuredImage ? `<img src="${escapeHtml(optimizedImageUrl(blog.featuredImage, { width: 1200, height: 675 }))}" width="1200" height="675" loading="eager" alt="${escapeHtml(`${blog.title} featured image`)}" style="width:100%;height:auto;border-radius:12px" />` : ""}
        <section><h2>Guide Details</h2><div style="white-space:pre-line">${escapeHtml(blog.body)}</div></section>
        <section><h2>Related Property Locations</h2>${linkList((blog.relatedLocations || []).map((name) => ({ label: `Properties for sale in ${name}`, href: locationHref(name) })))}</section>
      </article>
    </main>`;
}

function injectBlogHtml(shell, blog) {
  const url = `${SITE_ORIGIN}${canonicalPath(blog.slug)}`;
  const title = compact(blog.metaTitle || blog.title, 70);
  const description = compact(blog.metaDescription || blog.excerpt, 160);
  const image = blog.featuredImage || PROPERTY_IMAGE_FALLBACK;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Property Guides", href: "/blog" },
    { label: blog.title, href: canonicalPath(blog.slug) },
  ];
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${blog.isIndexable === false ? "noindex,follow" : "index,follow,max-image-preview:large"}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    jsonLdScript(buildBreadcrumbSchema(breadcrumbs), "akshar-schema-blog-breadcrumb"),
    jsonLdScript(buildBlogPostingJsonLd(blog, { url }), "akshar-schema-blog-post"),
  ].join("\n    ");
  return shell
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<html([^>]*)>/i, '<html lang="en-IN">')
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${buildBlogPage(blog)}</div>`);
}

function redirect(res, location) {
  res.writeHead(301, { Location: location, "Cache-Control": "public, max-age=3600" });
  res.end();
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end("<!doctype html><html lang=\"en-IN\"><head><title>Blog Not Found | Akshar Estate</title><meta name=\"robots\" content=\"noindex\" /></head><body><h1>Blog Not Found</h1><p>This property guide is unavailable.</p></body></html>");
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || "", "https://www.aksharestate.in");
    const rawSlug = firstQueryValue(req.query?.slug) || BLOG_PATH_RE.exec(url.pathname)?.[1] || "";
    const slug = decodeURIComponent(String(rawSlug)).trim().replace(/^\/+|\/+$/g, "").toLowerCase();
    if (!slug) return notFound(res);
    const blog = await fetchBlog(slug);
    if (!blog?.slug) return notFound(res);
    const hasTrailingSlash = url.pathname.endsWith("/") || firstQueryValue(req.query?.slash) === "1";
    const hasQueryNoise = [...url.searchParams.keys()].some((key) => !["slug", "slash"].includes(key));
    if (slug !== blog.slug || hasTrailingSlash || hasQueryNoise) return redirect(res, canonicalPath(blog.slug));
    const html = injectBlogHtml(readIndexHtml(), blog);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.end(html);
  } catch (error) {
    console.error("Blog route handler failed", error);
    notFound(res);
  }
}
