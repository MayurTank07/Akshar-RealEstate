import { parseINRAmount } from "./currency.js";
import { getPropertyCity } from "./propertyData.js";

const numberWords = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
};

const synonyms = [
  ["flat", "apartment"],
  ["flats", "apartment"],
  ["apartments", "apartment"],
  ["villa", "villas"],
  ["commercials", "commercial"],
  ["land", "plot"],
  ["lands", "plot"],
  ["plots", "plot"],
  ["shop", "retail"],
  ["office space", "office"],
  ["sale", "buy"],
  ["sell", "buy"],
  ["rental", "rent"],
  ["lease", "rent"],
  ["fully furnished", "furnished"],
  ["semi furnished", "semi-furnished"],
  ["un furnished", "unfurnished"],
  ["new projects", "new launch"],
  ["new project", "new launch"],
];

function normalizeText(value = "") {
  let text = String(value || "").toLowerCase();
  Object.entries(numberWords).forEach(([word, number]) => {
    text = text.replace(new RegExp(`\\b${word}\\s+bhk\\b`, "g"), `${number}bhk`);
  });
  text = text
    .replace(/\b(\d+)\s*b\s*h\s*k\b/g, "$1bhk")
    .replace(/\b(\d+)\s+bed(room)?s?\b/g, "$1bhk")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  synonyms.forEach(([from, to]) => {
    text = text.replace(new RegExp(`\\b${from.replace(/\s+/g, "\\s+")}\\b`, "g"), to);
  });
  return text;
}

function compact(value = "") {
  return normalizeText(value).replace(/\s+/g, "");
}

function tokens(value = "") {
  return normalizeText(value).split(" ").filter((token) => token.length > 1);
}

function textDistance(a, b) {
  const left = compact(a);
  const right = compact(b);
  if (!left || !right) return 99;
  const dp = Array.from({ length: left.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= right.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      dp[i][j] = left[i - 1] === right[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp[left.length][right.length];
}

function fuzzyIncludes(haystack, needle) {
  const text = normalizeText(haystack);
  const query = normalizeText(needle);
  if (!query) return true;
  if (text.includes(query) || compact(text).includes(compact(query))) return true;
  const words = text.split(" ").filter(Boolean);
  return tokens(query).every((queryToken) =>
    words.some((word) => {
      if (/^\d+bhk$/.test(queryToken)) return word === queryToken;
      return word.includes(queryToken) || queryToken.includes(word) || (queryToken.length > 3 && textDistance(word, queryToken) <= 1);
    })
  );
}

function arrayText(values = []) {
  return Array.isArray(values) ? values.join(" ") : "";
}

function stripLocationPhrase(query = "") {
  return normalizeText(query)
    .replace(/\b(in|near|at)\s+.+$/i, "")
    .trim();
}

function extractLocationPhrase(query = "") {
  const normalized = normalizeText(query);
  const match = normalized.match(/\b(?:in|near|at)\s+(.+)$/i);
  if (!match) return "";
  return match[1]
    .replace(/\b(for|sale|rent|buy|lease|properties|property|flat|flats|apartment|apartments|office|shop|villa|plot|land)\b/g, " ")
    .replace(/\b\d+\s*bhk\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchIntentParts(query = "") {
  const normalized = normalizeText(query);
  const location = extractLocationPhrase(query);
  const withoutLocation = location ? stripLocationPhrase(query) : normalized;
  const bhk = normalized.match(/\b(\d+)bhk\b/)?.[1] || "";
  const core = withoutLocation || normalized.replace(location, "").trim();
  const typeWords = tokens(core).filter((token) =>
    ["apartment", "flat", "villa", "plot", "land", "office", "shop", "retail", "commercial", "residential", "farmhouse"].includes(token)
  );
  const dealWords = tokens(core).filter((token) =>
    ["rent", "sale", "buy", "lease", "preleased", "roi", "barter"].includes(token)
  );
  return {
    normalized,
    location,
    core,
    bhk,
    typeWords,
    dealWords,
    hasStructuredIntent: Boolean(location || bhk || typeWords.length || dealWords.length),
  };
}

export function analyzePropertySearchQuery(query = "") {
  return searchIntentParts(query);
}

export function propertySearchText(property = {}) {
  const measurement = property.measurement || {};
  return [
    property.title,
    property.propertyCode,
    property.location,
    property.city,
    property.type,
    property.category,
    property.dealType,
    property.price,
    property.priceUnit,
    property.status,
    property.propertyStatus,
    property.availability,
    property.constructionStatus,
    property.possessionStatus,
    property.developerName,
    property.developer,
    property.builder,
    property.topProject,
    property.topDeveloper,
    property.furnishing,
    property.facing,
    property.ownership,
    property.parking,
    property.description,
    property.area,
    measurement.unit,
    property.beds ? `${property.beds}bhk ${property.beds} bhk` : "",
    property.isPreLeased ? "pre leased preleased roi investment" : "",
    property.isBarter ? "barter" : "",
    arrayText(property.amenities),
    arrayText(property.features),
    arrayText(property.facilities),
    arrayText(property.highlights),
    arrayText(property.propertyTags),
  ].filter(Boolean).join(" ");
}

export function matchesPropertySearch(property, query) {
  const cleanQuery = String(query || "").trim();
  if (!cleanQuery) return true;
  const priceIntent = parsePriceIntent(cleanQuery);
  if (priceIntent && !matchesPriceIntent(property, priceIntent)) return false;
  const textQuery = priceIntent ? normalizeText(cleanQuery).replace(priceIntent.raw, " ").trim() : cleanQuery;
  return !textQuery || fuzzyIncludes(propertySearchText(property), textQuery);
}

export function rankedPropertySearch(properties = [], query = "") {
  const cleanQuery = String(query || "").trim();
  if (!cleanQuery) return properties.map((property, index) => ({ property, rank: 0, index }));

  const intent = searchIntentParts(cleanQuery);
  const priceIntent = parsePriceIntent(cleanQuery);
  const coreQuery = intent.core || cleanQuery;

  return properties
    .map((property, index) => {
      if (priceIntent && !matchesPriceIntent(property, priceIntent)) return null;

      const searchText = propertySearchText(property);
      const typeTargetText = normalizeText([
        property.type,
        property.category,
        property.title,
        arrayText(property.propertyTags),
      ].filter(Boolean).join(" "));
      const locationText = [property.location, property.city, property.map?.area, property.map?.city].filter(Boolean).join(" ");
      const hasBhk = Boolean(intent.bhk);
      const bhkMatch = !hasBhk || Number(property.beds || 0) === Number(intent.bhk);
      const locationMatch = !intent.location || fuzzyIncludes(locationText, intent.location);
      const coreMatch = !coreQuery || matchesPropertySearch(property, coreQuery);
      const fullMatch = matchesPropertySearch(property, cleanQuery);
      const typeMatch = !intent.typeWords.length || intent.typeWords.some((word) => typeTargetText.includes(normalizeText(word)));
      const dealMatch = !intent.dealWords.length || intent.dealWords.some((word) => fuzzyIncludes(searchText, word));
      const hasTypeOrDeal = Boolean(intent.typeWords.length || intent.dealWords.length);
      const actualTypeMatch = Boolean(intent.typeWords.length && typeMatch);
      const actualDealMatch = Boolean(intent.dealWords.length && dealMatch);
      const genericLocationSearch = intent.location && !hasBhk && !hasTypeOrDeal && tokens(coreQuery).every((token) => ["property", "properties", "home", "homes"].includes(token));
      const structuredMatch = (!hasBhk || bhkMatch) && (!intent.typeWords.length || typeMatch) && (!intent.dealWords.length || dealMatch);
      const strongFullMatch = fullMatch && structuredMatch;

      const relevant =
        strongFullMatch ||
        (hasBhk && bhkMatch && (typeMatch || dealMatch || locationMatch || true)) ||
        (coreMatch && (actualTypeMatch || actualDealMatch || !intent.hasStructuredIntent)) ||
        (locationMatch && (genericLocationSearch || (hasTypeOrDeal && (actualTypeMatch || actualDealMatch)) || (hasBhk && bhkMatch)));

      if (!relevant) return null;

      let rank = 0;
      if (strongFullMatch) rank += 120;
      if (locationMatch && (bhkMatch || typeMatch || dealMatch || coreMatch)) rank += 100;
      if (locationMatch) rank += 45;
      if (bhkMatch && hasBhk) rank += 45;
      if (typeMatch && intent.typeWords.length) rank += 35;
      if (dealMatch && intent.dealWords.length) rank += 30;
      if (coreMatch) rank += 20;
      if (intent.location && !locationMatch) rank -= 25;

      return { property, rank, index };
    })
    .filter(Boolean)
    .sort((a, b) => b.rank - a.rank || new Date(b.property.createdAt || 0) - new Date(a.property.createdAt || 0) || a.index - b.index);
}

export function numericPrice(property) {
  return Number(property.priceAmount || 0) || parseINRAmount(property.price) || 0;
}

function parsePriceIntent(query) {
  const normalized = normalizeText(query);
  const match = normalized.match(/\b(under|below|less than|upto|up to|above|over|greater than|from|min|max)?\s*(\d+(?:\.\d+)?)\s*(cr|crore|crores|lakh|lakhs|lac|lacs|k|thousand)?\b/);
  if (!match || !/(under|below|less|upto|up to|above|over|greater|from|min|max|cr|crore|lakh|lac|thousand)/.test(match[0])) return null;
  const unit = match[3] || "";
  const amount = Number(match[2]) * (
    unit.startsWith("cr") || unit.startsWith("crore") ? 10000000 :
    unit.startsWith("lakh") || unit.startsWith("lac") ? 100000 :
    unit.startsWith("k") || unit.startsWith("thousand") ? 1000 :
    1
  );
  return { raw: match[0], operator: match[1] || "around", amount };
}

function matchesPriceIntent(property, intent) {
  const price = numericPrice(property);
  if (!price || !intent.amount) return true;
  if (["under", "below", "less than", "upto", "up to", "max"].includes(intent.operator)) return price <= intent.amount;
  if (["above", "over", "greater than", "from", "min"].includes(intent.operator)) return price >= intent.amount;
  const tolerance = intent.amount * 0.2;
  return price >= intent.amount - tolerance && price <= intent.amount + tolerance;
}

export function propertyAreaValue(property) {
  return Number(property.measurement?.value || property.sqft || String(property.area || "").replace(/[^\d.]/g, "") || 0);
}

export function propertyUnit(property) {
  return property.measurement?.unit || (property.sqft ? "sqft" : "");
}

export function getFieldValue(property, field) {
  if (field === "areaWise") return property.location || property.map?.area || "";
  if (field === "city") return getPropertyCity(property);
  if (field === "projectDeveloper") return property.topProject || property.developerName || property.topDeveloper || "";
  if (field === "measurementUnit") return propertyUnit(property);
  if (field === "landType") return property.ownership || property.category || property.type || "";
  return property[field] || "";
}

export function collectOptions(properties, field) {
  const values = new Set();
  properties.forEach((property) => {
    const value = getFieldValue(property, field);
    if (Array.isArray(value)) value.forEach((item) => item && values.add(String(item)));
    else if (value) values.add(String(value));
  });
  return [...values].sort((a, b) => a.localeCompare(b));
}

export function matchesAdvancedFilters(property, filters = {}) {
  const checks = [
    ["areaWise", getFieldValue(property, "areaWise")],
    ["propertyType", property.type],
    ["propertyCategory", property.category],
    ["dealType", property.dealType],
    ["landType", getFieldValue(property, "landType")],
    ["furnishing", property.furnishing],
    ["measurementUnit", getFieldValue(property, "measurementUnit")],
    ["projectDeveloper", getFieldValue(property, "projectDeveloper")],
    ["status", property.propertyStatus || property.status],
    ["facing", property.facing],
  ];

  const scalarMatch = checks.every(([key, value]) => {
    const filterValue = filters[key];
    return !filterValue || filterValue === "Any" || filterValue === "All" || fuzzyIncludes(value, filterValue);
  });
  if (!scalarMatch) return false;

  if (filters.amenity && !fuzzyIncludes(arrayText(property.amenities), filters.amenity)) return false;
  if (filters.bhk && filters.bhk !== "Any" && Number(property.beds || 0) !== Number(filters.bhk)) return false;

  const price = numericPrice(property);
  if (filters.minPrice && price < Number(filters.minPrice)) return false;
  if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

  const area = propertyAreaValue(property);
  if (filters.minArea && area < Number(filters.minArea)) return false;
  if (filters.maxArea && area > Number(filters.maxArea)) return false;

  return true;
}

export function sortProperties(properties, sortBy = "latest") {
  const sorted = [...properties];
  if (sortBy === "price-asc") sorted.sort((a, b) => numericPrice(a) - numericPrice(b));
  else if (sortBy === "price-desc") sorted.sort((a, b) => numericPrice(b) - numericPrice(a));
  else sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return sorted;
}

function capitalizeWord(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function generateSearchSuggestions(query = "", properties = []) {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const intent = searchIntentParts(query);
  const suggestions = [];
  const seen = new Set();

  const add = (s) => {
    if (s && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      suggestions.push(s);
    }
  };

  const bhkValues = [...new Set(properties.map((p) => p.beds).filter((n) => n != null))]
    .map(Number)
    .sort((a, b) => a - b);
  const allCities = [...new Set(properties.map((p) => p.city || "").filter(Boolean))].sort();
  const allTypes = [...new Set(properties.map((p) => p.type || "").filter(Boolean))].sort();

  const bhks = bhkValues.length ? bhkValues.slice(0, 5) : [1, 2, 3, 4, 5];
  const cities = allCities.length ? allCities.slice(0, 6) : ["Surat", "Ahmedabad", "Vadodara", "Rajkot", "Gandhinagar"];
  const types = allTypes.length ? allTypes.slice(0, 5) : ["Apartment", "Villa", "Plot", "Office", "Shop"];

  const bareNumber = normalized.match(/^(\d+)$/);
  if (bareNumber) {
    const n = bareNumber[1];
    add(`${n} BHK`);
    cities.slice(0, 3).forEach((c) => add(`${n} BHK in ${c}`));
    types.slice(0, 2).forEach((t) => add(`${n} BHK ${t}`));
    return suggestions.slice(0, 8);
  }

  if (intent.bhk) {
    const n = intent.bhk;
    if (intent.location) {
      const matchCities = cities.filter(
        (c) => fuzzyIncludes(c, intent.location) || c.toLowerCase().startsWith(intent.location.toLowerCase())
      );
      const targetCities = matchCities.length ? matchCities.slice(0, 3) : cities.slice(0, 3);
      targetCities.forEach((c) => add(`${n} BHK in ${c}`));
      types.slice(0, 2).forEach((t) => add(`${n} BHK ${t} in ${capitalizeWord(intent.location)}`));
    } else {
      add(`${n} BHK`);
      cities.slice(0, 4).forEach((c) => add(`${n} BHK in ${c}`));
      types.slice(0, 2).forEach((t) => add(`${n} BHK ${t}`));
    }
    return suggestions.slice(0, 8);
  }

  if (intent.location) {
    const matchCities = cities.filter(
      (c) => fuzzyIncludes(c, intent.location) || c.toLowerCase().startsWith(intent.location.toLowerCase())
    );
    const targetCities = matchCities.length ? matchCities.slice(0, 3) : cities.slice(0, 3);
    targetCities.forEach((c) => {
      bhks.slice(0, 2).forEach((n) => add(`${n} BHK in ${c}`));
      types.slice(0, 1).forEach((t) => add(`${t} in ${c}`));
    });
    return suggestions.slice(0, 8);
  }

  if (intent.typeWords.length) {
    const t = intent.typeWords[0];
    bhks.slice(0, 3).forEach((n) => add(`${n} BHK ${capitalizeWord(t)}`));
    cities.slice(0, 3).forEach((c) => add(`${capitalizeWord(t)} in ${c}`));
    return suggestions.slice(0, 8);
  }

  if (intent.dealWords.length) {
    const d = intent.dealWords[0];
    bhks.slice(0, 3).forEach((n) => add(`${n} BHK for ${d}`));
    cities.slice(0, 2).forEach((c) => add(`Property for ${d} in ${c}`));
    return suggestions.slice(0, 6);
  }

  const matchedCities = cities.filter((c) => fuzzyIncludes(c, normalized));
  if (matchedCities.length) {
    matchedCities.slice(0, 3).forEach((c) => {
      bhks.slice(0, 2).forEach((n) => add(`${n} BHK in ${c}`));
      add(`Properties in ${c}`);
    });
    return suggestions.slice(0, 8);
  }

  cities.slice(0, 3).forEach((c) => add(`Properties in ${c}`));
  return suggestions.slice(0, 6);
}

export function groupSearchResults(rankedItems = [], query = "") {
  const intent = searchIntentParts(query);
  const hasBhk = Boolean(intent.bhk);
  const hasLocation = Boolean(intent.location);

  if (!hasBhk && !hasLocation) {
    return { exact: rankedItems.map((r) => r.property || r), similar: [], alternatives: [] };
  }

  const exact = [];
  const similar = [];
  const alternatives = [];

  rankedItems.forEach((result) => {
    const property = result.property || result;
    const bhkMatch = !hasBhk || Number(property.beds || 0) === Number(intent.bhk);
    const locationText = [property.location, property.city, property.map?.area, property.map?.city]
      .filter(Boolean)
      .join(" ");
    const locationMatch = !hasLocation || fuzzyIncludes(locationText, intent.location);

    if (bhkMatch && locationMatch) {
      exact.push(property);
    } else if (locationMatch) {
      similar.push(property);
    } else {
      alternatives.push(property);
    }
  });

  return { exact, similar, alternatives };
}
