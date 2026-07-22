# Akshar Estate Phase 16 Location Rollout Audit

Date: 2026-07-22

Website: Akshar Estate: The Property Hub

## Rollout Summary

Phase 16 adds the second-month priority locations to the SEO landing-page system while keeping the publishing rule strict: a page is indexable only when it has verified locality copy and active matching inventory.

Published/indexable from this batch:

- Ognaj
- Memnagar
- New C.G. Road

Held as noindex and excluded from the sitemap until active inventory exists:

- Zundal
- Tragad
- Chharodi
- Bodakdev
- Sola
- Chandlodia
- Ghatlodia
- Gurukul
- C.G. Road
- Naroda
- Odhav
- Kathwada
- Vatva
- Maninagar
- Changodar
- Moraiya
- Sanathal
- Shantipura
- Godhavi
- Vaishnodevi
- Kalol
- Kadi

## First-Month Page Review

No Google Search Console export, Search Console API connection or production impression/click data was available in the local project. The local analytics database was empty during the Phase 16 verification run, so there were no call, WhatsApp or inquiry conversion events to compare. Because of that, Phase 16 did not make impression/click or conversion-driven ranking changes.

Local review findings:

- First-month pages are internally linked through parent-region links, nearby-area links, all-properties links and sitemap inclusion where inventory exists.
- Empty or thin first-month pages remain noindex and are excluded from `sitemap-locations.xml`.
- The location configuration continues to generate unique titles and descriptions per locality.
- No local evidence was available for "crawled, currently not indexed", "high impressions and low clicks" or low-conversion CTAs.

## Implementation Notes

- Clean canonical URL format is `/properties-for-sale/{region}/{location}`.
- `New C.G. Road` uses the canonical slug `/properties-for-sale/ahmedabad/new-cg-road`.
- Existing inventory text `New c g road Chandkheda` is matched to `new-cg-road` through a controlled alias.
- `C.G. Road` intentionally does not share that alias, so it remains noindex with zero inventory and is excluded from the sitemap.
- Dynamic SEO responses now remove the homepage noscript fallback before injecting page-specific content, preventing duplicate initial-HTML H1 headings on property, blog and location routes.

## Location SEO Audit Table

| Location | URL | Property count | SEO title | Meta description | Indexable status | Sitemap status | Internal links | Validation result |
|---|---|---:|---|---|---|---|---|---|
| Zundal | `/properties-for-sale/ahmedabad/zundal` | 0 | Properties for Sale in Zundal, Ahmedabad \| Akshar Estate | Explore properties for sale in Zundal, Ahmedabad with active listings, nearby areas like Chandkheda, Tragad, Vaishnodevi, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Chandkheda, Tragad, Vaishnodevi | Held noindex until active inventory exists |
| Tragad | `/properties-for-sale/ahmedabad/tragad` | 0 | Properties for Sale in Tragad, Ahmedabad \| Akshar Estate | Explore properties for sale in Tragad, Ahmedabad with active listings, nearby areas like Chandkheda, Zundal, Vaishnodevi, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Chandkheda, Zundal, Vaishnodevi | Held noindex until active inventory exists |
| Chharodi | `/properties-for-sale/ahmedabad/chharodi` | 0 | Properties for Sale in Chharodi, Ahmedabad \| Akshar Estate | Explore properties for sale in Chharodi, Ahmedabad with active listings, nearby areas like Vaishnodevi, Tragad, Gota, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Vaishnodevi, Tragad, Gota | Held noindex until active inventory exists |
| Bodakdev | `/properties-for-sale/ahmedabad/bodakdev` | 0 | Properties for Sale in Bodakdev, Ahmedabad \| Akshar Estate | Explore properties for sale in Bodakdev, Ahmedabad with active listings, nearby areas like Thaltej, S.G. Highway, Gurukul, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Thaltej, S.G. Highway, Gurukul | Held noindex until active inventory exists |
| Sola | `/properties-for-sale/ahmedabad/sola` | 0 | Properties for Sale in Sola, Ahmedabad \| Akshar Estate | Explore properties for sale in Sola, Ahmedabad with active listings, nearby areas like Science City, Gota, Thaltej, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Science City, Gota, Thaltej | Held noindex until active inventory exists |
| Ognaj | `/properties-for-sale/ahmedabad/ognaj` | 1 | Properties for Sale in Ognaj, Ahmedabad \| Akshar Estate | Explore properties for sale in Ognaj, Ahmedabad with active listings, nearby areas like Gota, Sola, Science City, FAQs and Akshar Estate contact. | Indexable | Included | Parent Ahmedabad, Gota, Sola, Science City | Published with active inventory and unique content |
| Chandlodia | `/properties-for-sale/ahmedabad/chandlodia` | 0 | Properties for Sale in Chandlodia, Ahmedabad \| Akshar Estate | Explore properties for sale in Chandlodia, Ahmedabad with active listings, nearby areas like Gota, Ghatlodia, Sola, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Gota, Ghatlodia, Sola | Held noindex until active inventory exists |
| Ghatlodia | `/properties-for-sale/ahmedabad/ghatlodia` | 0 | Properties for Sale in Ghatlodia, Ahmedabad \| Akshar Estate | Explore properties for sale in Ghatlodia, Ahmedabad with active listings, nearby areas like Memnagar, Chandlodia, Sola, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Memnagar, Chandlodia, Sola | Held noindex until active inventory exists |
| Memnagar | `/properties-for-sale/ahmedabad/memnagar` | 1 | Properties for Sale in Memnagar, Ahmedabad \| Akshar Estate | Explore properties for sale in Memnagar, Ahmedabad with active listings, nearby areas like Gurukul, Ghatlodia, Bodakdev, FAQs and Akshar Estate contact. | Indexable | Included | Parent Ahmedabad, Gurukul, Ghatlodia, Bodakdev | Published with active inventory and unique content |
| Gurukul | `/properties-for-sale/ahmedabad/gurukul` | 0 | Properties for Sale in Gurukul, Ahmedabad \| Akshar Estate | Explore properties for sale in Gurukul, Ahmedabad with active listings, nearby areas like Memnagar, Bodakdev, Thaltej, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Memnagar, Bodakdev, Thaltej | Held noindex until active inventory exists |
| C.G. Road | `/properties-for-sale/ahmedabad/cg-road` | 0 | Properties for Sale in C.G. Road, Ahmedabad \| Akshar Estate | Explore properties for sale in C.G. Road, Ahmedabad with active listings, nearby areas like Navrangpura, Gurukul, Memnagar, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Navrangpura, Gurukul, Memnagar | Held noindex until active inventory exists |
| New C.G. Road | `/properties-for-sale/ahmedabad/new-cg-road` | 1 | Properties for Sale in New C.G. Road, Ahmedabad \| Akshar Estate | Explore properties for sale in New C.G. Road, Ahmedabad with active listings, nearby areas like Chandkheda, Motera, Tragad, FAQs and Akshar Estate contact. | Indexable | Included | Parent Ahmedabad, Chandkheda, Motera, Tragad | Published with active inventory and unique content |
| Naroda | `/properties-for-sale/ahmedabad/naroda` | 0 | Properties for Sale in Naroda, Ahmedabad \| Akshar Estate | Explore properties for sale in Naroda, Ahmedabad with active listings, nearby areas like Kathwada, Odhav, Bapunagar, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Kathwada, Odhav, Bapunagar | Held noindex until active inventory exists |
| Odhav | `/properties-for-sale/ahmedabad/odhav` | 0 | Properties for Sale in Odhav, Ahmedabad \| Akshar Estate | Explore properties for sale in Odhav, Ahmedabad with active listings, nearby areas like Naroda, Kathwada, Bapunagar, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Naroda, Kathwada, Bapunagar | Held noindex until active inventory exists |
| Kathwada | `/properties-for-sale/ahmedabad/kathwada` | 0 | Properties for Sale in Kathwada, Ahmedabad \| Akshar Estate | Explore properties for sale in Kathwada, Ahmedabad with active listings, nearby areas like Naroda, Odhav, Singarva, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Naroda, Odhav, Singarva | Held noindex until active inventory exists |
| Vatva | `/properties-for-sale/ahmedabad/vatva` | 0 | Properties for Sale in Vatva, Ahmedabad \| Akshar Estate | Explore properties for sale in Vatva, Ahmedabad with active listings, nearby areas like Odhav, Maninagar, Lambha, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Odhav, Maninagar, Lambha | Held noindex until active inventory exists |
| Maninagar | `/properties-for-sale/ahmedabad/maninagar` | 0 | Properties for Sale in Maninagar, Ahmedabad \| Akshar Estate | Explore properties for sale in Maninagar, Ahmedabad with active listings, nearby areas like Isanpur, Vatva, Khokhra, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Isanpur, Vatva, Khokhra | Held noindex until active inventory exists |
| Changodar | `/properties-for-sale/ahmedabad/changodar` | 0 | Properties for Sale in Changodar, Ahmedabad \| Akshar Estate | Explore properties for sale in Changodar, Ahmedabad with active listings, nearby areas like Sanand, Bavla, Moraiya, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Sanand, Bavla, Moraiya | Held noindex until active inventory exists |
| Moraiya | `/properties-for-sale/ahmedabad/moraiya` | 0 | Properties for Sale in Moraiya, Ahmedabad \| Akshar Estate | Explore properties for sale in Moraiya, Ahmedabad with active listings, nearby areas like Changodar, Sanand, Bavla, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Changodar, Sanand, Bavla | Held noindex until active inventory exists |
| Sanathal | `/properties-for-sale/ahmedabad/sanathal` | 0 | Properties for Sale in Sanathal, Ahmedabad \| Akshar Estate | Explore properties for sale in Sanathal, Ahmedabad with active listings, nearby areas like Shela, Shantipura, South Bopal, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Shela, Shantipura, South Bopal | Held noindex until active inventory exists |
| Shantipura | `/properties-for-sale/ahmedabad/shantipura` | 0 | Properties for Sale in Shantipura, Ahmedabad \| Akshar Estate | Explore properties for sale in Shantipura, Ahmedabad with active listings, nearby areas like South Bopal, Shela, Sanathal, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, South Bopal, Shela, Sanathal | Held noindex until active inventory exists |
| Godhavi | `/properties-for-sale/ahmedabad/godhavi` | 0 | Properties for Sale in Godhavi, Ahmedabad \| Akshar Estate | Explore properties for sale in Godhavi, Ahmedabad with active listings, nearby areas like Bopal, Ghuma, Sanand, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Bopal, Ghuma, Sanand | Held noindex until active inventory exists |
| Vaishnodevi | `/properties-for-sale/ahmedabad/vaishnodevi` | 0 | Properties for Sale in Vaishnodevi, Ahmedabad \| Akshar Estate | Explore properties for sale in Vaishnodevi, Ahmedabad with active listings, nearby areas like Zundal, Tragad, Chharodi, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Ahmedabad, Zundal, Tragad, Chharodi | Held noindex until active inventory exists |
| Kalol | `/properties-for-sale/gandhinagar/kalol` | 0 | Properties for Sale in Kalol, Gandhinagar \| Akshar Estate | Explore properties for sale in Kalol, Gandhinagar with active listings, nearby areas like Gandhinagar, Kadi, Chhatral, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Gandhinagar, Gandhinagar, Kadi, Chhatral | Held noindex until active inventory exists |
| Kadi | `/properties-for-sale/gandhinagar/kadi` | 0 | Properties for Sale in Kadi, Gandhinagar \| Akshar Estate | Explore properties for sale in Kadi, Gandhinagar with active listings, nearby areas like Kalol, Chhatral, Gandhinagar, FAQs and Akshar Estate contact. | Noindex | Excluded | Parent Gandhinagar, Kalol, Chhatral, Gandhinagar | Held noindex until active inventory exists |

## Remaining Work

- Import Search Console performance data after the domain is verified, then prioritize high-impression, low-click pages.
- Add or improve inventory for held locations before allowing sitemap inclusion.
- Review CTA conversion events after more call, WhatsApp and inquiry events are collected.
- Continue Phase 17 only after production deployment and sitemap recrawl checks.
