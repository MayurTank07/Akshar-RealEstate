# Structured Data Validation

Phase 9 adds JSON-LD for business, property and location pages. Validate the generated markup after every SEO change and after every production deployment.

## Local Checks

Run the frontend checks:

```bash
npm run lint
npm run build
node --check api/property-route.js
node --check api/sale-landing-route.js
```

Run a JSON-LD extraction check against local demo inventory:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5001/api node --input-type=module <<'NODE'
import propertyHandler from './api/property-route.js';
import locationHandler from './api/sale-landing-route.js';

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    writeHead(status, headers = {}) { this.statusCode = status; Object.entries(headers).forEach(([k, v]) => this.setHeader(k, v)); },
    end(value = '') { this.body += value; },
  };
}

async function render(handler, url, query = {}) {
  const res = createRes();
  await handler({ url, query }, res);
  return res;
}

function scripts(html) {
  return [...html.matchAll(/<script([^>]*)type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/g)]
    .map((match) => ({ attrs: `${match[1]}${match[2]}`, json: JSON.parse(match[3]) }));
}

const propertiesResponse = await fetch('http://127.0.0.1:5001/api/public/properties?limit=5');
const propertiesBody = await propertiesResponse.json();
const property = propertiesBody.data.find((item) => item.slug);
const propertyRes = await render(propertyHandler, `/property/${property.slug}`, { key: property.slug });
const locationRes = await render(locationHandler, '/properties-for-sale/gandhinagar/kudasan', { region: 'gandhinagar', locality: 'kudasan' });

console.log({
  propertyStatus: propertyRes.statusCode,
  propertySchemaCount: scripts(propertyRes.body).length,
  locationStatus: locationRes.statusCode,
  locationSchemaCount: scripts(locationRes.body).length,
});
NODE
```

## Production Validator Workflow

Validate representative production URLs with:

- Google Rich Results Test: `https://search.google.com/test/rich-results`
- Schema Markup Validator: `https://validator.schema.org/`

Test at minimum:

- Homepage: `https://www.aksharestate.in/`
- Business page: `https://www.aksharestate.in/contact`
- One active property URL from `/sitemap-properties.xml`
- One active location URL from `/sitemap-locations.xml`
- One active property intent URL from `/sitemap-property-types.xml`

## What To Fix

Fix any report showing:

- Invalid JSON-LD syntax.
- Duplicate schema scripts for the same page entity.
- `Product` schema on property pages.
- Fake or unsupported review, rating or aggregate rating fields.
- Price fields without a real numeric `priceAmount`.
- Address, geo, phone or social profile values that are not visible or not verified.
- Canonical URLs that do not match the page URL.
- Missing `BreadcrumbList` on property or location pages.
