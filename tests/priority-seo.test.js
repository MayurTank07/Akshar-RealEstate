import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import propertyRoute from "../api/property-route.js";
import saleLandingRoute from "../api/sale-landing-route.js";
import sitemapRoute from "../api/sitemap.js";
import { getPropertyTypeIntentPage, landingStateForPage } from "../src/config/locationLandingPages.js";
import { priorityPropertySeo } from "../src/config/priorityPropertySeo.js";

const listings = [
  { _id: "0".repeat(24), propertyCode: "AETP-AHMD-0068", slug: "agriculture-land-for-sale-viramgam-viramgam-0068", type: "Agriculture land", category: "Agriculture land for sale", title: "Agricultural land", city: "Viramgam", location: "Viramgam", area: "2000 sq-yard", priceAmount: 4500000, status: "active", isIndexable: true },
  { _id: "1".repeat(24), propertyCode: "AETP-GNR-0029", slug: "agriculture-land-for-sale-dashela-gandhinagar-0029", type: "Agriculture land", category: "Agriculture land for sale", title: "Agricultural land", city: "Gandhinagar", location: "Dashela", area: "6 vigha", priceAmount: 240000000, status: "active", isIndexable: true },
  { _id: "a".repeat(24), propertyCode: "AETP-AHMD-0069", slug: "plot-for-sale-ahmedabad-ahmedabad-0069", type: "Plot", title: "Plot for sale", city: "Ahmedabad", location: "Ahmedabad", area: "1360 sq-yard", priceAmount: 8500000, status: "active", isIndexable: true },
  { _id: "2".repeat(24), propertyCode: "AETP-GNR-0028", slug: "agriculture-land-for-sale-jhakhora-gandhinagar-0028", type: "Agriculture land", category: "Agriculture land for sale", title: "Agricultural land", city: "Gandhinagar", location: "Jhakhora", area: "5.4 vigha", priceAmount: 110000000, status: "active", isIndexable: true },
  { _id: "b".repeat(24), propertyCode: "AETP-AHMD-0071", slug: "plot-for-sale-bakrol-ahmedabad-0071", type: "Plot", category: "Agriculture land for sale", title: "Agriculture land for sale", city: "Ahmedabad", location: "Bakrol", area: "300 sq-yard", priceAmount: 5000000, status: "active", isIndexable: true },
  { _id: "c".repeat(24), propertyCode: "AETP-AHMD-0059", slug: "2-bhk-apartments-for-sale-ahmedabad-ahmedabad-0059", type: "Apartments", title: "Apartment", city: "Ahmedabad", location: "Shela", bhk: 2, beds: 2, priceAmount: 8000000, status: "active", isIndexable: true },
  { _id: "d".repeat(24), propertyCode: "AETP-GNR-0060", slug: "2-bhk-apartments-for-sale-gandhinagar-gandhinagar-0060", type: "Apartments", title: "Apartment", city: "Gandhinagar", location: "Kudasan", bhk: 2, beds: 2, area: "170 Sqyd", builtUpArea: 12, priceAmount: 9000000, status: "active", isIndexable: true },
  { _id: "e".repeat(24), propertyCode: "AETP-GNR-0025", slug: "plot-for-sale-palaj-gandhinagar-0025", type: "Plot", title: "Plot for sale", city: "Gandhinagar", location: "Palaj", priceAmount: 8500000, status: "active", isIndexable: true },
  { _id: "f".repeat(24), propertyCode: "AETP-GNR-0027", slug: "agriculture-land-for-sale-dhanap-gandhinagar-0027", type: "Agriculture land", title: "Agricultural land", city: "Gandhinagar", location: "Dhanap", area: "2 vigha", priceAmount: 90000000, status: "active", isIndexable: true },
  { _id: "6".repeat(24), propertyCode: "AETP-GNR-0067", slug: "4-bhk-apartments-for-sale-palaj-gandhinagar-0067", type: "Apartment", title: "4 BHK apartment", city: "Gandhinagar", location: "Palaj", area: "345 sq-yard", bhk: 4, beds: 4, priceAmount: 12900000, status: "active", isIndexable: true },
  { _id: "3".repeat(24), propertyCode: "AETP-GNR-0021", slug: "agriculture-land-for-sale-gandhinagar-0021", type: "Agriculture land", category: "Agriculture land for sale", title: "Agricultural land", city: "Gandhinagar", location: "Gandhinagar", area: "1.61 vigha", priceAmount: 28500000, status: "active", isIndexable: true },
  { _id: "7".repeat(24), propertyCode: "AETP-VIRA-0072", slug: "plot-for-sale-viramgam-viramgam-0072", type: "Plot", title: "Plot for sale", city: "Viramgam", location: "Viramgam", area: "500 sq-yard", priceAmount: 1750000, status: "active", isIndexable: true },
  { _id: "9".repeat(24), propertyCode: "AETP-TEST-9999", slug: "inactive-test-listing-9999", type: "Plot", title: "Inactive listing", city: "Ahmedabad", location: "Test", area: "100 sq-yard", priceAmount: 1000000, status: "active", isIndexable: false },
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

test("homepage fallback has one sale-focused H1", () => {
  const shell = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.equal((shell.match(/<h1>/g) || []).length, 1);
  assert.match(shell, /<h1>Agricultural Land, Plots &amp; Properties for Sale in Gujarat<\/h1>/);
});

test("property-type landing state leaves inventory matching to the page intent", () => {
  for (const [prefix, location] of [
    ["agricultural-land-for-sale", "viramgam"],
    ["agricultural-land-for-sale", "dashela"],
    ["plots-for-sale", "viramgam"],
    ["plots-for-sale", "palaj"],
  ]) {
    const state = landingStateForPage(getPropertyTypeIntentPage(prefix, location));
    assert.equal(state.filters.activeCity, "All");
    assert.equal(state.filters.activeType, "All");
    assert.equal(state.filters.advancedFilters.propertyType, "");
  }
});

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
  return { status: res.statusCode, headers: res.headers, body: chunks.join("") };
}

test("priority category routes show matching inventory and a single SEO root", async () => {
  const cases = [
    ["/plots-for-sale/ahmedabad", "AETP-AHMD-0069"],
    ["/plots-for-sale/gandhinagar", "AETP-GNR-0025"],
    ["/flats-for-sale/ahmedabad", "AETP-AHMD-0059"],
    ["/flats-for-sale/gandhinagar", "AETP-GNR-0060"],
    ["/2-bhk-flats-for-sale/gandhinagar", "AETP-GNR-0060"],
    ["/agricultural-land-for-sale/gandhinagar", "AETP-GNR-0027"],
    ["/agricultural-land-for-sale/viramgam", "AETP-AHMD-0068"],
    ["/agricultural-land-for-sale/dashela", "AETP-GNR-0029"],
    ["/agricultural-land-for-sale/jhakhora", "AETP-GNR-0028"],
    ["/agricultural-land-for-sale/dhanap", "AETP-GNR-0027"],
    ["/plots-for-sale/viramgam", "AETP-VIRA-0072"],
    ["/properties-for-sale/gandhinagar/palaj/4-bhk", "AETP-GNR-0067"],
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
  assert.match(sitemap.body, /agricultural-land-for-sale\/viramgam/);
  assert.match(sitemap.body, /agricultural-land-for-sale\/dashela/);
  assert.match(sitemap.body, /agricultural-land-for-sale\/jhakhora/);
  assert.match(sitemap.body, /agricultural-land-for-sale\/dhanap/);
  assert.match(sitemap.body, /plots-for-sale\/viramgam/);
  assert.match(sitemap.body, /properties-for-sale\/gandhinagar\/palaj\/4-bhk/);
});

test("city pages summarize current inventory and link to active localities", async () => {
  const gandhinagar = await render(saleLandingRoute, "/properties-for-sale/gandhinagar");
  assert.equal(gandhinagar.status, 200);
  assert.match(gandhinagar.body, /Current Gandhinagar Listing Mix/);
  assert.match(gandhinagar.body, /href="\/properties-for-sale\/gandhinagar\/palaj"/);
  assert.match(gandhinagar.body, /href="\/properties-for-sale\/gandhinagar\/dhanap"/);
});

test("Kudasan pages answer the observed flat and 2 BHK search intent", async () => {
  const locality = await render(saleLandingRoute, "/properties-for-sale/gandhinagar/kudasan");
  const twoBhk = await render(saleLandingRoute, "/properties-for-sale/gandhinagar/kudasan/2-bhk");
  assert.match(locality.body, /<title>Flats &amp; Properties for Sale in Kudasan, Gandhinagar/);
  assert.match(locality.body, /parking, possession and GIFT City-side access/);
  assert.match(twoBhk.body, /<title>2 BHK Flats &amp; Homes for Sale in Kudasan/);
  assert.match(twoBhk.body, /usable area, asking price, parking/);
  assert.match(twoBhk.body, /170 Sqyd/);
  assert.doesNotMatch(twoBhk.body, /12 sq.ft built-up area/);
  assert.match(twoBhk.body, /<meta name="robots" content="index,follow/);
});

test("single-listing plot pages show readable price and area in search copy", async () => {
  const page = await render(saleLandingRoute, "/plots-for-sale/ahmedabad");
  assert.match(page.body, /<meta name="description" content="Plots for Sale in Ahmedabad: compare 1360 sq-yard at ₹85,00,000/);
  assert.match(page.body, /1360 sq-yard \| Ahmedabad/);
  assert.doesNotMatch(page.body, /Ahmedabad \| Ahmedabad|Ahmedabad Ahmedabad/);
  assert.doesNotMatch(page.body, /\| 8500000 \|/);
});

test("old priority property slugs redirect to current live slugs", async () => {
  const legacy = [
    ["agriculture-land-for-sale-viramgam-ahmedabad-0068", "agriculture-land-for-sale-viramgam-viramgam-0068"],
    ["4-bhk-apartment-for-sale-palaj-gandhinagar-0067", "4-bhk-apartments-for-sale-palaj-gandhinagar-0067"],
    ["agriculture-land-for-sale-gandhinagar-gandhinagar-0021", "agriculture-land-for-sale-gandhinagar-0021"],
    ["plot-for-sale-viramgam-ahmedabad-0072", "plot-for-sale-viramgam-viramgam-0072"],
  ];
  for (const [oldSlug, currentSlug] of legacy) {
    const page = await render(propertyRoute, `/property/${oldSlug}`);
    assert.equal(page.status, 301, oldSlug);
    assert.equal(page.headers.Location, `/property/${currentSlug}`);
  }
});

test("all nine priority listings have unique, indexable, answer-ready property pages", async () => {
  const priorityListings = listings.filter((item) => /^AETP-(?:AHMD|GNR|VIRA)-/.test(item.propertyCode) && !["AETP-AHMD-0071", "AETP-AHMD-0059", "AETP-GNR-0060"].includes(item.propertyCode));
  assert.equal(priorityListings.length, 9);
  const titles = new Set();
  for (const property of priorityListings) {
    const page = await render(propertyRoute, `/property/${property.slug}`);
    assert.equal(page.status, 200, property.propertyCode);
    assert.match(page.body, /<meta name="robots" content="index,follow/, property.propertyCode);
    assert.match(page.body, new RegExp(`<link rel="canonical" href="https://www.aksharestate.in/property/${property.slug}"`), property.propertyCode);
    assert.match(page.body, /Quick Answer/, property.propertyCode);
    assert.match(page.body, /Documents to Check/, property.propertyCode);
    assert.match(page.body, /Site Visit Guidance/, property.propertyCode);
    assert.match(page.body, /Frequently Asked Questions/, property.propertyCode);
    assert.match(page.body, /"@type":"FAQPage"/, property.propertyCode);
    assert.match(page.body, /"@type":"Offer"/, property.propertyCode);
    assert.ok(page.body.includes(`<h1 style="font-size:32px;line-height:1.2;margin:0 0 12px">${priorityPropertySeo(property).heading}</h1>`), property.propertyCode);
    const title = page.body.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, property.propertyCode);
    titles.add(title);
  }
  assert.equal(titles.size, 9);

  const sitemap = await render(sitemapRoute, "/sitemap-properties.xml");
  assert.equal(sitemap.status, 200);
  for (const property of priorityListings) assert.match(sitemap.body, new RegExp(property.slug), property.propertyCode);
  assert.doesNotMatch(sitemap.body, /inactive-test-listing-9999/);
});
