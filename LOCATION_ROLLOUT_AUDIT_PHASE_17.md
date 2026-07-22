# Akshar Estate Phase 17 Inventory-Based Rollout Audit

Date: 2026-07-22

Website: Akshar Estate: The Property Hub

## Rollout Summary

Phase 17 reviewed the remaining and third-month candidate locations against the live local public inventory. SEO pages remain inventory-gated: a location page is indexable only when it is verified, has unique content, has active public inventory, is not a duplicate and supports user inquiry through the Akshar Estate contact flow.

New published and indexable page:

- Dhanap: `/properties-for-sale/gandhinagar/dhanap`

Prepared but noindex pages:

- Dehgam
- Mahudi
- Vijapur
- Viramgam
- Nadiad
- Anand
- Mahemdavad
- Dholera
- Bavla
- Bareja
- Bagodara
- Chhatral
- Prantij

Kept in draft or needs verification:

- Jhakhora
- Drive In Road
- Dashela / Deshela spelling conflict
- Naroda-area villages
- East Ahmedabad villages
- South Ahmedabad industrial areas
- Outer Ahmedabad land locations

## Category Table

| Location or group | URL | Inventory | Verification | Sitemap | Category | Notes |
|---|---|---:|---|---|---|---|
| Dehgam | `/properties-for-sale/north-gujarat/dehgam` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Mahudi | `/properties-for-sale/north-gujarat/mahudi` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Vijapur | `/properties-for-sale/north-gujarat/vijapur` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Viramgam | `/properties-for-sale/ahmedabad/viramgam` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Nadiad | `/properties-for-sale/central-gujarat/nadiad` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Anand | `/properties-for-sale/central-gujarat/anand` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Mahemdavad | `/properties-for-sale/central-gujarat/mahemdavad` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Dholera | `/properties-for-sale/ahmedabad/dholera` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Bavla | `/properties-for-sale/ahmedabad/bavla` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Bareja | `/properties-for-sale/ahmedabad/bareja` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Bagodara | `/properties-for-sale/ahmedabad/bagodara` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Chhatral | `/properties-for-sale/north-gujarat/chhatral` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Prantij | `/properties-for-sale/north-gujarat/prantij` | 0 | Verified rollout copy | Excluded | Published but noindex / no inventory | No matching active public inventory |
| Dhanap | `/properties-for-sale/gandhinagar/dhanap` | 1 | Verified rollout copy | Included | Published and indexable | Active public property: premium Agriculture Land For Sale |
| Jhakhora | Draft | 1 | Needs manual verification | Excluded | Needs verification | Active property exists, but location was not in the approved master rollout list |
| Drive In Road | Draft | 1 | Needs manual verification | Excluded | Needs verification | Active property exists, but location needs master-location cleanup |
| Dashela | Draft | 1 | Needs manual verification | Excluded | Needs verification | Active property spelling conflicts with master-list `Deshela` |
| Deshela | Draft | 0 | Needs manual verification | Excluded | Needs verification / no inventory | No matching active public inventory |
| Naroda-area villages | Draft | 0 | Needs manual verification | Excluded | Draft / needs verification | Broad grouping, not a single verified location page |
| East Ahmedabad villages | Draft | 0 | Needs manual verification | Excluded | Draft / needs verification | Broad grouping, not a single verified location page |
| South Ahmedabad industrial areas | Draft | 0 | Needs manual verification | Excluded | Draft / needs verification | Broad grouping, not a single verified location page |
| Outer Ahmedabad land locations | Draft | 0 | Needs manual verification | Excluded | Draft / needs verification | Broad grouping, not a single verified location page |

## Validation

- Dhanap route returned HTTP 200 with `index,follow,max-image-preview:large`.
- Dhanap route had one H1, one canonical and active listing HTML.
- Dhanap was included in `sitemap-locations.xml`.
- Dehgam, Nadiad and Dholera sample noinventory pages returned HTTP 200 with `noindex,follow`.
- Dehgam, Nadiad and Dholera remained excluded from `sitemap-locations.xml`.

## Remaining Work

- Manually verify Jhakhora, Drive In Road and Dashela/Deshela before creating indexable SEO pages.
- Add real inventory before indexing any noinventory third-month page.
- Clean the backend location master verification flags so admin status matches frontend rollout status.
