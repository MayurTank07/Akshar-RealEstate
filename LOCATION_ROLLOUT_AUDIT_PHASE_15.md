# Phase 15 Location Rollout Audit

Website: Akshar Estate: The Property Hub  
Preferred domain: `https://www.aksharestate.in`  
Audit date: July 22, 2026  
Inventory source: public active property API on local backend

This rollout publishes only priority location pages with real active inventory. Priority pages with no active matching properties are optimized with unique titles, H1s, local content, breadcrumbs, nearby links, FAQs, contact CTA and canonical handling, but they remain `noindex,follow` and are excluded from the sitemap until inventory exists.

## Rollout Summary

- Published/indexable now: Gandhinagar, Ahmedabad, Chandkheda.
- Held as noindex until inventory exists: Kudasan, Sargasan, Vavol, Pethapur, GIFT City, Ahmedabad West, Bopal, South Bopal, Shela, Ghuma, Science City, Thaltej, Gota, S.G. Highway, Motera, Adalaj, Sanand.
- Empty pages are not submitted in `sitemap-locations.xml`.
- No locality information was fabricated; content is limited to broad, stable local context already represented in the configured rollout pages.

## Location SEO Audit Table

| Location | URL | Property count | SEO title | Meta description | Indexable status | Sitemap status | Internal links | Validation result |
| --- | --- | ---: | --- | --- | --- | --- | ---: | --- |
| Gandhinagar | `/properties-for-sale/gandhinagar` | 5 | Properties for Sale in Gandhinagar \| Akshar Estate | Explore properties for sale in Gandhinagar with active listings, nearby areas like Kudasan, Sargasan, Vavol, FAQs and Akshar Estate contact. | Index | Included | 7 | Pass - published with inventory |
| Kudasan | `/properties-for-sale/gandhinagar/kudasan` | 0 | Properties for Sale in Kudasan, Gandhinagar \| Akshar Estate | Explore properties for sale in Kudasan, Gandhinagar with active listings, nearby areas like Sargasan, Raysan, GIFT City, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Sargasan | `/properties-for-sale/gandhinagar/sargasan` | 0 | Properties for Sale in Sargasan, Gandhinagar \| Akshar Estate | Explore properties for sale in Sargasan, Gandhinagar with active listings, nearby areas like Kudasan, Vavol, Raysan, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Vavol | `/properties-for-sale/gandhinagar/vavol` | 0 | Properties for Sale in Vavol, Gandhinagar \| Akshar Estate | Explore properties for sale in Vavol, Gandhinagar with active listings, nearby areas like Sargasan, Pethapur, Kudasan, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Pethapur | `/properties-for-sale/gandhinagar/pethapur` | 0 | Properties for Sale in Pethapur, Gandhinagar \| Akshar Estate | Explore properties for sale in Pethapur, Gandhinagar with active listings, nearby areas like Vavol, Randheja, Mahudi Road, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| GIFT City | `/properties-for-sale/gandhinagar/gift-city` | 0 | Properties for Sale in GIFT City, Gandhinagar \| Akshar Estate | Explore properties for sale in GIFT City, Gandhinagar with active listings, nearby areas like Kudasan, Raysan, Sargasan, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Ahmedabad | `/properties-for-sale/ahmedabad` | 4 | Properties for Sale in Ahmedabad \| Akshar Estate | Explore properties for sale in Ahmedabad with active listings, nearby areas like Bopal, South Bopal, Shela, FAQs and Akshar Estate contact. | Index | Included | 7 | Pass - published with inventory |
| Ahmedabad West | `/properties-for-sale/ahmedabad-west` | 0 | Properties for Sale in Ahmedabad West \| Akshar Estate | Explore properties for sale in Ahmedabad West with active listings, nearby areas like Bopal, South Bopal, Shela, FAQs and Akshar Estate contact. | Noindex | Excluded | 7 | Pass - noindex until active inventory |
| Bopal | `/properties-for-sale/ahmedabad/bopal` | 0 | Properties for Sale in Bopal, Ahmedabad \| Akshar Estate | Explore properties for sale in Bopal, Ahmedabad with active listings, nearby areas like South Bopal, Ghuma, Shela, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| South Bopal | `/properties-for-sale/ahmedabad/south-bopal` | 0 | Properties for Sale in South Bopal, Ahmedabad \| Akshar Estate | Explore properties for sale in South Bopal, Ahmedabad with active listings, nearby areas like Bopal, Shela, Ghuma, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Shela | `/properties-for-sale/ahmedabad/shela` | 0 | Properties for Sale in Shela, Ahmedabad \| Akshar Estate | Explore properties for sale in Shela, Ahmedabad with active listings, nearby areas like South Bopal, Ghuma, Shantipura, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Ghuma | `/properties-for-sale/ahmedabad/ghuma` | 0 | Properties for Sale in Ghuma, Ahmedabad \| Akshar Estate | Explore properties for sale in Ghuma, Ahmedabad with active listings, nearby areas like Bopal, South Bopal, Shela, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Science City | `/properties-for-sale/ahmedabad/science-city` | 0 | Properties for Sale in Science City, Ahmedabad \| Akshar Estate | Explore properties for sale in Science City, Ahmedabad with active listings, nearby areas like Sola, Thaltej, Gota, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Thaltej | `/properties-for-sale/ahmedabad/thaltej` | 0 | Properties for Sale in Thaltej, Ahmedabad \| Akshar Estate | Explore properties for sale in Thaltej, Ahmedabad with active listings, nearby areas like Science City, Sola, Bodakdev, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Gota | `/properties-for-sale/ahmedabad/gota` | 0 | Properties for Sale in Gota, Ahmedabad \| Akshar Estate | Explore properties for sale in Gota, Ahmedabad with active listings, nearby areas like Sola, Chandlodia, Science City, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| S.G. Highway | `/properties-for-sale/ahmedabad/sg-highway` | 0 | Properties for Sale in S.G. Highway, Ahmedabad \| Akshar Estate | Explore properties for sale in S.G. Highway, Ahmedabad with active listings, nearby areas like Thaltej, Bodakdev, Gota, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Chandkheda | `/properties-for-sale/ahmedabad/chandkheda` | 1 | Properties for Sale in Chandkheda, Ahmedabad \| Akshar Estate | Explore properties for sale in Chandkheda, Ahmedabad with active listings, nearby areas like Motera, Tragad, Zundal, FAQs and Akshar Estate contact. | Index | Included | 6 | Pass - published with inventory |
| Motera | `/properties-for-sale/ahmedabad/motera` | 0 | Properties for Sale in Motera, Ahmedabad \| Akshar Estate | Explore properties for sale in Motera, Ahmedabad with active listings, nearby areas like Chandkheda, Sabarmati, Bhat, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Adalaj | `/properties-for-sale/ahmedabad/adalaj` | 0 | Properties for Sale in Adalaj, Gandhinagar \| Akshar Estate | Explore properties for sale in Adalaj, Gandhinagar with active listings, nearby areas like Kudasan, Vaishnodevi, Zundal, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |
| Sanand | `/properties-for-sale/ahmedabad/sanand` | 0 | Properties for Sale in Sanand, Ahmedabad \| Akshar Estate | Explore properties for sale in Sanand, Ahmedabad with active listings, nearby areas like Shela, Changodar, Bavla, FAQs and Akshar Estate contact. | Noindex | Excluded | 6 | Pass - noindex until active inventory |

## Validation Notes

- Every priority page has a unique SEO title, generated unique meta description, H1, local introduction, breadcrumbs, nearby links, FAQs, contact CTA and canonical URL.
- Indexable pages have active matching inventory and are included in the location sitemap.
- Noindex priority pages are available for users/admin review but are not submitted to Google until active inventory exists.
- Dynamic SSR routes now remove static homepage metadata before injecting page-specific metadata, preventing duplicate canonical, robots, description and JSON-LD tags on property, location and blog pages.
