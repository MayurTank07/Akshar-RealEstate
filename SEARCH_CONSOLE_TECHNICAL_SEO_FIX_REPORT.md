# Akshar Estate Search Console Technical SEO Fix Report

Date: 2026-07-22

Production property checked in Google Search Console: `https://www.aksharestate.in/`

## Screenshot Diagnosis

The screenshot shows URL Inspection for `https://www.aksharestate.in/sitemap.xml`, with:

- `URL is not on Google`
- `Page is not indexed: URL is unknown to Google`
- `No referring sitemaps detected`
- `Oops! Something went wrong` after requesting indexing

This is not evidence that the sitemap is broken. `sitemap.xml` is an XML discovery file, not a normal webpage that should be indexed in Google Search. The correct workflow is to submit it in the Sitemaps report, not request indexing for the sitemap URL itself.

Search Console verified state:

- Property type visible: URL-prefix property for `https://www.aksharestate.in/`
- Submitted sitemap: `/sitemap.xml`
- Sitemap type: Sitemap index
- Last read: July 22, 2026
- Status: Success
- Discovered pages: 20
- Performance report: No data yet
- Manual actions: No issues detected
- Security issues: No issues detected

## Problems Found

| Issue | Severity | Details | Fix |
|---|---|---|---|
| Sitemap URL inspected as indexable page | High | `sitemap.xml` should not be requested for indexing through URL Inspection | Documented correct GSC workflow and confirmed sitemap submission success |
| Static SPA routes inherited homepage canonical | High | `/properties`, `/about`, `/contact` and other static routes served initial HTML with homepage canonical | Added `api/page-route.js` and Vercel rewrites for route-specific metadata |
| Private routes were indexable in initial HTML | High | `/admin`, `/login`, `/register`, `/profile` and similar pages inherited `index,follow` | Added noindex/nofollow serverless shells for private/low-value routes |
| Unknown URLs returned homepage-like 200 | High | Unknown paths could appear as soft 404s because the SPA catch-all returned `index.html` | Changed catch-all to return a true 404 noindex response |
| Old query-style property URL returned homepage canonical | Medium | `/property?id=...` returned a generic SPA page instead of redirecting | Added query-param handling and a Vercel rewrite for `/property` |
| Empty blog index was in static sitemap | Medium | `/blog` had no published blog entries, making it a thin indexable page | Removed `/blog` from static sitemap and set it `noindex,follow` until published guides exist |
| Empty blog child sitemap was submitted in GSC | Medium | `/sitemap-blog.xml` had 0 URLs and Search Console reported `1 error` | Removed the child sitemap submission in GSC and excluded empty child sitemaps from `/sitemap.xml` |
| New C.G. Road live test returned Soft 404 | High | Search Console live test said `Page cannot be indexed: Soft 404` even though the page had one matching listing | Marked New C.G. Road as duplicate/noindex and removed duplicate/soft-404 pages from location sitemap generation |

## URL Inventory

| URL | Page Type | Crawlable | Indexable | In Sitemap | Canonical | Search Console Status | Action Taken |
|---|---|---:|---:|---:|---|---|---|
| `https://www.aksharestate.in/` | Homepage | Yes | Yes | Yes | Self | Not enough performance data yet | Already valid |
| `https://www.aksharestate.in/properties` | Public listing page | Yes | Yes | Yes | Self after fix | Not individually inspected | Added route-specific metadata |
| `https://www.aksharestate.in/about` | Static page | Yes | Yes | Yes | Self after fix | Not individually inspected | Added route-specific metadata |
| `https://www.aksharestate.in/contact` | Static page | Yes | Yes | Yes | Self after fix | Not individually inspected | Added route-specific metadata |
| `https://www.aksharestate.in/blog` | Empty blog index | Yes | No | No | Self | Not individually inspected | Set noindex until published blog inventory exists |
| `https://www.aksharestate.in/sitemap.xml` | Sitemap index | Yes | Not applicable | Submitted sitemap | Not applicable | Sitemap report: Success | Do not request indexing for this XML URL |
| `https://www.aksharestate.in/property/agriculture-land-for-sale-dhanap-gandhinagar-0027` | Property page | Yes | Yes | Yes | Self | Not individually inspected | Already valid |
| `https://www.aksharestate.in/properties-for-sale/gandhinagar/dhanap` | Location page | Yes | Yes | Yes | Self | Not individually inspected | Already valid |
| `https://www.aksharestate.in/properties-for-sale/ahmedabad/new-cg-road` | Duplicate/thin location page | Yes | No after fix | No after fix | Self | Live test: Soft 404 | Kept crawlable but noindex and removed from sitemap |
| `https://www.aksharestate.in/properties-for-sale/ahmedabad/dholera` | Prepared noinventory page | Yes | No | No | Self | Not individually inspected | Kept noindex until inventory exists |
| `https://www.aksharestate.in/login` | Auth page | Blocked by robots and noindex | No | No | Self after fix | Not individually inspected | Added noindex/nofollow initial HTML |
| `https://www.aksharestate.in/admin` | Private admin page | Blocked by robots and noindex | No | No | Self after fix | Not individually inspected | Added noindex/nofollow initial HTML |
| Unknown paths | 404 page | Yes | No | No | Requested path | Not individually inspected | Changed catch-all to true 404 |

## Keyword-To-Page Mapping

| Target Search | Target URL | Title | H1 | Current Status |
|---|---|---|---|---|
| Property in Gandhinagar | `/properties-for-sale/gandhinagar` | Properties for Sale in Gandhinagar \| Akshar Estate | Properties for Sale in Gandhinagar | Indexable |
| Flats for sale in Gandhinagar | `/properties-for-sale/gandhinagar` | Properties for Sale in Gandhinagar \| Akshar Estate | Properties for Sale in Gandhinagar | Indexable, but add flat inventory for stronger relevance |
| Residential property in Gandhinagar | `/properties-for-sale/gandhinagar` | Properties for Sale in Gandhinagar \| Akshar Estate | Properties for Sale in Gandhinagar | Indexable |
| 2 BHK in Gandhinagar | `/properties-for-sale/gandhinagar` | Properties for Sale in Gandhinagar \| Akshar Estate | Properties for Sale in Gandhinagar | Needs active 2 BHK Gandhinagar inventory before a clean BHK page should index |
| 3 BHK in Gandhinagar | `/properties-for-sale/gandhinagar` | Properties for Sale in Gandhinagar \| Akshar Estate | Properties for Sale in Gandhinagar | Needs active 3 BHK Gandhinagar inventory before a clean BHK page should index |
| Properties near Gift City | `/properties-for-sale/gandhinagar/gift-city` | Properties for Sale in GIFT City, Gandhinagar \| Akshar Estate | Properties for Sale in GIFT City, Gandhinagar | Noindex until matching inventory exists |
| Flats in Kudasan | `/properties-for-sale/gandhinagar/kudasan` | Properties for Sale in Kudasan, Gandhinagar \| Akshar Estate | Properties for Sale in Kudasan, Gandhinagar | Noindex until matching inventory exists |
| Property in Sargasan | `/properties-for-sale/gandhinagar/sargasan` | Properties for Sale in Sargasan, Gandhinagar \| Akshar Estate | Properties for Sale in Sargasan, Gandhinagar | Noindex until matching inventory exists |
| Property in Dhanap | `/properties-for-sale/gandhinagar/dhanap` | Properties for Sale in Dhanap, Gandhinagar \| Akshar Estate | Properties for Sale in Dhanap, Gandhinagar | Indexable |

## Testing Results

- `vercel.json` JSON validation: passed
- `api/page-route.js` syntax: passed
- `api/property-route.js` syntax: passed
- Frontend lint: passed
- Frontend production build: passed
- Static public route handler checks: passed
- Private noindex route handler checks: passed
- Unknown 404 route handler check: passed
- Old `/property?id=` redirect check: passed
- Sitemap handler check: passed
- Empty `/blog` noindex and sitemap-exclusion check: passed locally
- Empty child sitemap exclusion check: passed locally
- Duplicate/Soft-404 landing page sitemap exclusion check: passed locally

## Production Verification After Deployment

Commits verified on production: `7a530a3`, `1662cdf`, `453b639`, `7e18de1`

| URL | Status | Robots | Canonical / Redirect |
|---|---:|---|---|
| `https://www.aksharestate.in/` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/` |
| `https://www.aksharestate.in/properties` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/properties` |
| `https://www.aksharestate.in/about` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/about` |
| `https://www.aksharestate.in/contact` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/contact` |
| `https://www.aksharestate.in/login` | 200 | `noindex,nofollow` | `https://www.aksharestate.in/login` |
| `https://www.aksharestate.in/admin` | 200 | `noindex,nofollow` | `https://www.aksharestate.in/admin` |
| `https://www.aksharestate.in/no-such-page-seo-audit` | 404 | `noindex,follow` | `https://www.aksharestate.in/no-such-page-seo-audit` |
| `https://www.aksharestate.in/sitemap.xml` | 200 | XML sitemap index | No page canonical needed |
| `https://www.aksharestate.in/properties-for-sale/gandhinagar/dhanap` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/properties-for-sale/gandhinagar/dhanap` |
| `https://www.aksharestate.in/properties-for-sale/ahmedabad/dholera` | 200 | `noindex,follow` | `https://www.aksharestate.in/properties-for-sale/ahmedabad/dholera` |
| `https://www.aksharestate.in/properties-for-sale/ahmedabad/new-cg-road` | 200 | `noindex,follow` | Removed from `sitemap-locations.xml`; Chandkheda remains in sitemap |
| `https://www.aksharestate.in/property/agriculture-land-for-sale-dhanap-gandhinagar-0027` | 200 | `index,follow,max-image-preview:large` | `https://www.aksharestate.in/property/agriculture-land-for-sale-dhanap-gandhinagar-0027` |
| `https://www.aksharestate.in/property?id=agriculture-land-for-sale-dhanap-gandhinagar-0027` | 301 | Not applicable | Redirects to `/property/agriculture-land-for-sale-dhanap-gandhinagar-0027` |
| `https://www.aksharestate.in/blog` | 200 | `noindex,follow` | Removed from `sitemap-pages.xml` |
| `https://www.aksharestate.in/sitemap.xml` | 200 | XML sitemap index | Excludes empty child sitemaps; 4 child sitemap entries live |

## Google Search Console Actions Completed

- Confirmed visible property: `https://www.aksharestate.in/`
- Created and verified Domain Property: `aksharestate.in`
- Verified Domain Property through GoDaddy Domain Connect DNS authorization
- Submitted `https://www.aksharestate.in/sitemap.xml` in the Domain Property
- Confirmed submitted sitemap: `/sitemap.xml`
- Confirmed sitemap status: Success
- Confirmed sitemap discovered pages: 23
- Removed separate `/sitemap-blog.xml` submission because it was empty and Search Console reported `1 error`
- Search Console live-tested New C.G. Road and found `Page cannot be indexed: Soft 404`; indexing was not requested for that URL
- Requested indexing after successful live tests for `/properties`, `/property/agriculture-land-for-sale-dhanap-gandhinagar-0027`, `/property/apartments-for-sale-memnagar-ahmedabad-0026` and `/property/plot-for-sale-palaj-gandhinagar-0025`
- Confirmed Performance report currently has no data
- Confirmed Page Indexing report is still processing data
- Confirmed Core Web Vitals report has not enough usage data for mobile or desktop
- Confirmed Product snippets: 5 valid items, 0 invalid critical issues
- Confirmed Manual Actions: No issues detected
- Confirmed Security Issues: No issues detected
- Confirmed Settings: Mayur Tank is a verified owner for the selected URL-prefix property

No indexing request was submitted for `sitemap.xml` because sitemap XML files are not normal indexable pages. Indexing requests should be used only for important public HTML URLs after a successful live test.

## Pending External Actions

1. In Search Console, inspect representative public HTML pages:
   - `https://www.aksharestate.in/properties`
   - `https://www.aksharestate.in/properties-for-sale/gandhinagar`
   - `https://www.aksharestate.in/properties-for-sale/gandhinagar/dhanap`
   - `https://www.aksharestate.in/property/agriculture-land-for-sale-dhanap-gandhinagar-0027`
2. Do not request indexing for `sitemap.xml`.
3. Wait for Google to process the successful sitemap submission; this can take days or weeks.
4. Add active verified 2 BHK, 3 BHK, Kudasan, Sargasan and GIFT City inventory before indexing those long-tail pages.
5. Publish real editorial blog posts before making `/blog` indexable or adding it back to `sitemap-pages.xml`.

## Monitoring Plan

- Check the Sitemaps report after 24-72 hours.
- Monitor Page Indexing for `Crawled - currently not indexed`, `Discovered - currently not indexed`, duplicate canonical and soft 404 issues.
- Watch Performance for impressions, clicks, average position and CTR once data appears.
- Inspect Dhanap and active property URLs after deployment.
- Keep noinventory location pages noindex until they have real inventory or genuinely useful standalone content.
