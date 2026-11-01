import assert from "node:assert/strict";
import test from "node:test";
import blogRoute from "../api/blog-route.js";
import sitemapRoute from "../api/sitemap.js";
import { activeBlogLocationLinks, isEditoriallyIndexableBlog, relevantPropertyLinksForBlog } from "../src/utils/blogEditorial.js";

const draft = {
  slug: "2-bhk-vs-3-bhk-in-gandhinagar",
  title: "2 BHK vs 3 BHK in Gandhinagar",
  body: "This draft is intended for the Akshar Estate content team.\nSuggested coverage",
  isIndexable: true,
};
const published = {
  slug: "how-to-buy-plot-in-ahmedabad",
  title: "How to Buy a Plot in Ahmedabad",
  body: "A plot requires title and land-use checks before purchase.",
  isIndexable: true,
  relatedLocations: ["Ahmedabad", "Shela", "GIFT City"],
};

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input) => {
  const url = new URL(input);
  if (url.pathname.endsWith("/public/blogs")) return Response.json({ data: [draft, published] });
  if (url.pathname.includes("/public/blogs/")) {
    const blog = [draft, published].find((item) => item.slug === url.pathname.split("/").at(-1));
    return Response.json({ data: blog || null }, { status: blog ? 200 : 404 });
  }
  return Response.json({ data: [], pagination: { pages: 1 } });
};
test.after(() => { globalThis.fetch = originalFetch; });

async function render(handler, url) {
  const chunks = [];
  const res = {
    statusCode: 200,
    setHeader() {},
    end(value = "") { chunks.push(value); },
    writeHead(status) { this.statusCode = status; },
  };
  await handler({ url, query: {} }, res);
  return { status: res.statusCode, body: chunks.join("") };
}

test("internal draft guides stay out of public SEO surfaces", async () => {
  assert.equal(isEditoriallyIndexableBlog(draft), false);
  assert.equal(isEditoriallyIndexableBlog(published), true);
  const sitemap = await render(sitemapRoute, "/sitemap-blog.xml");
  assert.doesNotMatch(sitemap.body, /2-bhk-vs-3-bhk-in-gandhinagar/);
  assert.match(sitemap.body, /how-to-buy-plot-in-ahmedabad/);
  const draftPage = await render(blogRoute, `/blog/${draft.slug}`);
  assert.equal(draftPage.status, 404);
  assert.match(draftPage.body, /noindex/);
});

test("published plot guide links to active, relevant property pages", async () => {
  const page = await render(blogRoute, `/blog/${published.slug}`);
  assert.equal(page.status, 200);
  assert.match(page.body, /<meta name="robots" content="index,follow/);
  assert.match(page.body, /href="\/plots-for-sale\/ahmedabad"/);
  assert.deepEqual(activeBlogLocationLinks(published).map((item) => item[1]), [
    "/properties-for-sale/ahmedabad",
    "/properties-for-sale/ahmedabad/shela",
  ]);
  assert.ok(relevantPropertyLinksForBlog(published).length > 0);
});
