import assert from "node:assert/strict";
import test from "node:test";
import propertyRoute from "../api/property-route.js";
import saleLandingRoute from "../api/sale-landing-route.js";
import sitemapRoute from "../api/sitemap.js";

const listings = [
  { _id: "a".repeat(24), propertyCode: "AETP-AHMD-0069", slug: "plot-for-sale-ahmedabad-ahmedabad-0069", type: "Plot", title: "Plot for sale", city: "Ahmedabad", location: "Ahmedabad", area: "1360 sq-yard", priceAmount: 8500000, status: "active", isIndexable: true },
  { _id: "b".repeat(24), propertyCode: "AETP-AHMD-0071", slug: "plot-for-sale-bakrol-ahmedabad-0071", type: "Plot", category: "Agriculture land for sale", title: "Agriculture land for sale", city: "Ahmedabad", location: "Bakrol", area: "300 sq-yard", priceAmount: 5000000, status: "active", isIndexable: true },
  { _id: "c".repeat(24), propertyCode: "AETP-AHMD-0059", slug: "2-bhk-apartments-for-sale-ahmedabad-ahmedabad-0059", type: "Apartments", title: "Apartment", city: "Ahmedabad", location: "Shela", bhk: 2, beds: 2, priceAmount: 8000000, status: "active", isIndexable: true },
  { _id: "d".repeat(24), propertyCode: "AETP-GNR-0060", slug: "2-bhk-apartments-for-sale-gandhinagar-gandhinagar-0060", type: "Apartments", title: "Apartment", city: "Gandhinagar", location: "Kudasan", bhk: 2, beds: 2, priceAmount: 9000000, status: "active", isIndexable: true },
  { _id: "e".repeat(24), propertyCode: "AETP-GNR-0025", slug: "plot-for-sale-palaj-gandhinagar-0025", type: "Plot", title: "Plot for sale", city: "Gandhinagar", location: "Palaj", priceAmount: 8500000, status: "active", isIndexable: true },
  { _id: "f".repeat(24), propertyCode: "AETP-GNR-0027", slug: "agriculture-land-for-sale-dhanap-gandhinagar-0027", type: "Agriculture land", title: "Agricultural land", city: "Gandhinagar", location: "Dhanap", area: "2 vigha", priceAmount: 90000000, status: "active", isIndexable: true },
  { _id: "1".repeat(24), propertyCode: "AETP-GNR-0029", slug: "agriculture-land-for-sale-dashela-gandhinagar-0029", type: "Agriculture land", title: "Agricultural land", city: "Gandhinagar", location: "Dashela", area: "6 vigha", priceAmount: 240000000, status: "active", isIndexable: false },
];

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input) => {
  const url = new URL(input);
  if (url.pathname.endsWith("/public/blogs")) return Response.json({ data: [] });
  if (url.pathname.includes("/public/properties/slug/")) {
    const property = listings.find((item) => item.slug === decodeURIComponent(url.pathname.split("/").at(-1)));
    return Response.json({ data: property || null }, { status: property ? 200 : 404 });
  }
  return Response.json({ data: listings, pagination: { pages: 1 } });
};

test.after(() => { globalThis.fetch = originalFetch; });

async function render(handler, url) {
  const chunks = [];
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(value = "") { chunks.push(value); },
    writeHead(status, headers) { this.statusCode = status; Object.assign(this.headers, headers); },
  };
  await handler({ url, query: {} }, res);
  return { status: res.statusCode, body: chunks.join("") };
}

test("priority category routes show matching inventory and a single SEO root", async () => {
  const cases = [
    ["/plots-for-sale/ahmedabad", "AETP-AHMD-0069"],
    ["/plots-for-sale/gandhinagar", "AETP-GNR-0025"],
    ["/flats-for-sale/ahmedabad", "AETP-AHMD-0059"],
    ["/flats-for-sale/gandhinagar", "AETP-GNR-0060"],
    ["/2-bhk-flats-for-sale/gandhinagar", "AETP-GNR-0060"],
    ["/agricultural-land-for-sale/gandhinagar", "AETP-GNR-0027"],
  ];
  for (const [pathname, ...codes] of cases) {
    const { status, body } = await render(saleLandingRoute, pathname);
    assert.equal(status, 200, pathname);
    assert.match(body, /<meta name="robots" content="index,follow/, pathname);
    assert.match(body, new RegExp(`<link rel="canonical" href="https://www.aksharestate.in${pathname}"`), pathname);
    assert.equal((body.match(/<div id="root">/g) || []).length, 1, pathname);
    for (const code of codes) assert.match(body, new RegExp(code.slice(-4)), pathname);
    if (pathname === "/plots-for-sale/ahmedabad") assert.doesNotMatch(body, /bakrol-ahmedabad-0071/);
    assert.doesNotMatch(body, /Property Topic Clusters/, pathname);
  }
  const sitemap = await render(sitemapRoute, "/sitemap-property-types.xml");
  assert.match(sitemap.body, /plots-for-sale\/ahmedabad/);
  assert.match(sitemap.body, /flats-for-sale\/ahmedabad/);
  assert.match(sitemap.body, /2-bhk-flats-for-sale\/gandhinagar/);
  assert.match(sitemap.body, /agricultural-land-for-sale\/gandhinagar/);
});

test("a listing marked noindex stays out of the sitemap", async () => {
  const page = await render(propertyRoute, "/property/agriculture-land-for-sale-dashela-gandhinagar-0029");
  assert.equal(page.status, 200);
  assert.match(page.body, /<meta name="robots" content="noindex,follow"/);
  assert.match(page.body, /6 vigha/);
  assert.doesNotMatch(page.body, /Property Topic Clusters/);
  assert.doesNotMatch(page.body, /Quick Answer|Documents to Check|Site Visit Guidance|Property Research Clusters/);

  const sitemap = await render(sitemapRoute, "/sitemap-properties.xml");
  assert.equal(sitemap.status, 200);
  assert.doesNotMatch(sitemap.body, /dashela-gandhinagar-0029/);
  assert.match(sitemap.body, /dhanap-gandhinagar-0027/);
});
