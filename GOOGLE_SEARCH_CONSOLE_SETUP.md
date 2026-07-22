# Google Search Console Setup

Website: Akshar Estate: The Property Hub  
Preferred production domain: `https://www.aksharestate.in`  
Backend API: `https://akshar-realestate-backend.onrender.com/api`  
Last readiness check: July 22, 2026

This checklist prepares the site for Google Search Console. It does not guarantee indexing, ranking, or a top-three position. Google decides whether and when to index pages based on crawlability, quality, duplication, demand, and many other signals.

## Current Production Readiness

| Check | Result |
| --- | --- |
| Production website crawlable | Pass. `https://www.aksharestate.in/` returns `200`. |
| HTTPS works | Pass. HTTPS returns `200` and Vercel sends HSTS. |
| Preferred domain works | Pass. Preferred domain is `https://www.aksharestate.in`. |
| Non-WWW to WWW | Pass. `https://aksharestate.in/` redirects to `https://www.aksharestate.in/`. |
| HTTP to HTTPS | Pass. `http://www.aksharestate.in/` redirects to HTTPS. `http://aksharestate.in/` redirects through HTTPS non-WWW, then WWW. |
| Sitemap accessible | Pass. `https://www.aksharestate.in/sitemap.xml` returns XML sitemap index. |
| Robots accessible | Pass. `https://www.aksharestate.in/robots.txt` returns `200` and references the sitemap. |
| Canonicals | Pass for property and location SSR pages. Homepage now has a self canonical in initial HTML. |
| Property pages | Pass. Sample sitemap property pages return `200`. |
| No accidental noindex | Pass for sampled active property pages. Some empty/thin location pages intentionally use `noindex,follow`. |
| Blocked resources | Pass. `robots.txt` does not block CSS, JavaScript, images, property pages, or location pages. Sample `/assets/` files return `200`. |
| Mobile pages | Pass basic mobile fetch. Priority location page returns `200` to mobile user agent. |
| Structured data | Present on property and location SSR pages. Homepage now includes Organization, RealEstateAgent, and WebSite JSON-LD in initial HTML. |
| Dynamic metadata | Present for property pages, location pages, blog pages, and sitemap routes. |
| Initial property HTML | Pass. Sample property pages include title, canonical, robots, JSON-LD, one H1, and property content in initial HTML. |
| Location internal links | Present through homepage priority links, breadcrumbs, property pages, and sale landing page links. |

## Search Console Setup Steps

1. Go to Google Search Console: `https://search.google.com/search-console`.
2. Click **Add property**.
3. Choose **Domain** property, not only URL prefix.
4. Enter `aksharestate.in`.
5. Copy the DNS TXT verification record Google provides.
6. Open the DNS manager for `aksharestate.in`.
7. Add the TXT record exactly as Google provides it.
8. Wait for DNS propagation.
9. Return to Search Console and click **Verify**.
10. Keep the TXT record in DNS after verification.

Google documentation:
- Domain verification: `https://support.google.com/webmasters/answer/9008080`
- Search Console start guide: `https://developers.google.com/search/docs/monitor-debug/search-console-start`

## Submit The Sitemap

1. Open the verified Domain Property in Search Console.
2. Go to **Sitemaps**.
3. Submit `https://www.aksharestate.in/sitemap.xml`.
4. Confirm Google shows the sitemap as successfully fetched.
5. Inspect the sitemap index and child sitemap files:
   - `https://www.aksharestate.in/sitemap-pages.xml`
   - `https://www.aksharestate.in/sitemap-properties.xml`
   - `https://www.aksharestate.in/sitemap-locations.xml`
   - `https://www.aksharestate.in/sitemap-property-types.xml`
   - `https://www.aksharestate.in/sitemap-blog.xml` only after at least one public, published, indexable blog post exists.

Empty child sitemaps should not be submitted separately or listed in the sitemap index. On July 22, 2026, `/sitemap-blog.xml` was removed from Search Console submissions and is excluded from `/sitemap.xml` until real blog URLs exist.

Important: do not use URL Inspection to request indexing for `https://www.aksharestate.in/sitemap.xml`. A sitemap is an XML discovery file, not a normal search-result page. Submit it in the Sitemaps report, then inspect and request indexing only for public HTML URLs such as the homepage, property pages and location pages after the live test passes.

Google documentation:
- Build and submit sitemap: `https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`
- Sitemaps report: `https://support.google.com/webmasters/answer/7451001`

## URL Inspection Checklist

Use **URL Inspection** for each URL below. For each one, click **Test Live URL**. If the page is indexable and important, click **Request Indexing**.

Homepage:
- `https://www.aksharestate.in/`

Priority city pages:
- `https://www.aksharestate.in/properties-for-sale/gandhinagar`
- `https://www.aksharestate.in/properties-for-sale/ahmedabad`

Priority location pages with current active inventory:
- `https://www.aksharestate.in/properties-for-sale/gandhinagar/dhanap`
- `https://www.aksharestate.in/properties-for-sale/ahmedabad/memnagar`
- `https://www.aksharestate.in/properties-for-sale/ahmedabad/ognaj`
- `https://www.aksharestate.in/properties-for-sale/ahmedabad/new-cg-road`

Do not request indexing for noinventory or intentionally noindex pages such as Kudasan, Sargasan, Bopal, South Bopal, Shela, GIFT City or Dholera until active verified inventory exists and the live URL test shows indexing is allowed.

Important property pages:
- Use the latest URLs from `https://www.aksharestate.in/sitemap-properties.xml`.
- Inspect at least 3 active/indexable property URLs.
- Do not request indexing for deleted, inactive, noindex, or empty/thin location pages.

Google documentation:
- URL Inspection tool: `https://support.google.com/webmasters/answer/9012289`
- Ask Google to recrawl URLs: `https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl`

## Reports To Check After Setup

Check these reports after Google has had time to crawl the site:

- **Page Indexing**: confirm important URLs are indexed or learn why they are excluded.
- **Core Web Vitals**: review mobile and desktop field data when available.
- **HTTPS**: confirm indexed URLs are served over HTTPS.
- **Enhancements**: check structured data items and fix invalid schema.
- **Manual Actions**: confirm there are no manual spam or policy actions.
- **Security Issues**: confirm Google has not detected malware, hacked content, or unsafe behavior.

## Page Inspection Acceptance Criteria

For an important indexable page, Search Console should show:

- URL is available to Google.
- Page fetch succeeds.
- Indexing allowed.
- User-declared canonical matches the production `https://www.aksharestate.in/...` URL.
- Google-selected canonical is the same URL or a clearly equivalent canonical.
- Page is not blocked by `robots.txt`.
- Page does not contain accidental `noindex`.
- Rendered HTML includes meaningful content.
- Structured data is valid or only has non-critical warnings.
- Mobile usability has no critical errors.

## Troubleshooting

### Crawled, Currently Not Indexed

Meaning: Google crawled the URL but chose not to index it yet.

Actions:
- Confirm the page has unique property/location content, not only template text.
- Make sure active property pages include price, location, description, images, supervisor contact, breadcrumbs, and similar properties.
- Add stronger internal links from homepage, city pages, location pages, and related properties.
- Check whether the page is low inventory, thin, duplicate, sold, inactive, or outdated.
- Improve content before requesting indexing again.

### Discovered, Currently Not Indexed

Meaning: Google knows the URL but has not crawled it yet.

Actions:
- Confirm the URL is in the correct sitemap.
- Add internal links from already indexed pages.
- Reduce unnecessary low-value sitemap URLs.
- Check server response time and backend availability.
- Use URL Inspection > Test Live URL for priority pages.

### Duplicate Without User-Selected Canonical

Meaning: Google found duplicates and did not see a clear canonical.

Actions:
- Confirm the page has exactly one canonical tag.
- Confirm canonical uses `https://www.aksharestate.in`.
- Remove duplicate internal links that use query URLs, uppercase slugs, trailing slash variants, or old ID URLs.
- Make sure old property slug URLs redirect to the current slug.

### Google Chose Different Canonical

Meaning: Google selected another URL as canonical.

Actions:
- Compare the inspected URL with Google's chosen canonical.
- Make sure the preferred page has stronger internal links.
- Ensure sitemap includes only the preferred canonical URL.
- Redirect duplicate paths when possible.
- Avoid near-duplicate location pages with only the locality name changed.

### Blocked By Robots.txt

Meaning: `robots.txt` prevents Google from crawling the URL or required resource.

Actions:
- Check `https://www.aksharestate.in/robots.txt`.
- Keep admin, supervisor, auth, API, preview and private routes blocked.
- Do not block `/property/`, `/properties-for-sale/`, `/blog/`, `/assets/`, CSS, JS, or images. Empty blog listing pages can use `noindex`, but crawl should remain allowed so Google can follow future published blog links.
- After editing robots, retest the live URL in Search Console.

### Excluded By Noindex

Meaning: Google crawled the page and found a `noindex` directive.

Actions:
- Confirm whether `noindex` is intentional.
- Keep `noindex` for deleted, inactive, empty, unverified, thin, or duplicate pages.
- Remove `noindex` only from active, public, useful, unique pages.
- Rebuild and redeploy, then run Test Live URL.

### Soft 404

Meaning: Google thinks a page behaves like a missing page even if it returns `200`.

Actions:
- For deleted properties, return `410 Gone` or `404` rather than a thin generic page.
- For sold properties kept live, show previous listing details and similar available properties.
- For empty location pages, use `noindex` until there is useful content and inventory.
- Do not redirect deleted or irrelevant properties to the homepage.

### Redirect Error

Meaning: Google could not follow the redirect path.

Actions:
- Avoid redirect chains.
- Confirm HTTP redirects to HTTPS.
- Confirm non-WWW redirects to `www`.
- Confirm old property slugs redirect once to the current canonical slug.
- Do not redirect every unavailable property to the homepage.

### Server Error

Meaning: Google received a `5xx` response.

Actions:
- Check Vercel deployment logs for frontend route errors.
- Check Render backend logs for API or MongoDB failures.
- Confirm `VITE_API_BASE_URL` points to the live backend.
- Confirm MongoDB Atlas allows Render access.
- Retest `/sitemap.xml`, `/robots.txt`, and a sample property URL.

### Sitemap Could Not Be Read

Meaning: Google could not fetch or parse the sitemap.

Actions:
- Open `https://www.aksharestate.in/sitemap.xml` in a browser.
- Confirm it returns `application/xml`.
- Confirm child sitemap URLs return `200`.
- Remove URLs that return `404`, `410`, private pages, noindex pages, query URLs, or non-canonical variants.
- Confirm the sitemap URL is listed in `robots.txt`.
- Resubmit the sitemap in Search Console.

## Ongoing Maintenance

- Submit only canonical, public, indexable URLs.
- Keep inactive, deleted, unverified, and empty location pages out of the sitemap.
- Recheck Search Console after property imports, slug changes, major deployments, or sitemap changes.
- Review Page Indexing and Enhancements weekly until the site stabilizes.
- Treat indexing issues as diagnostics, not ranking guarantees.
