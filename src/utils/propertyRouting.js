const knownCities = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Bharuch",
];

const knownTypes = [
  "Apartments",
  "Apartment",
  "Villas",
  "Villa",
  "Plots",
  "Plot",
  "Commercial",
  "Commercials",
  "Farmhouse",
  "Lands",
];

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function parsePropertyIntent(label = "", navKey = "buyers") {
  const text = String(label).replace(/\s+/g, " ").trim();
  const normalized = text.toLowerCase();
  if (normalized.includes("new project")) {
    return {
      category: "New Projects",
      city: "",
      type: "All",
      query: "",
      label: text,
      filters: {
        activeCity: "All",
        activeType: "All",
        query: "",
        searchType: "New Projects",
        newProject: true,
        intentLabel: "New Projects",
      },
    };
  }
  const category = navKey === "rentals" || normalized.includes(" rent ") || normalized.includes("for rent") ? "Rent" : "Buy";
  const city = knownCities.find((item) => normalized.includes(item.toLowerCase())) || "";
  const matchedType = knownTypes.find((item) => normalized.includes(item.toLowerCase()));
  const cleanType = matchedType
    ? matchedType.replace(/^Apartment$/, "Apartments").replace(/^Villa$/, "Villas").replace(/^Plot$/, "Plots").replace(/^Commercial$/, "Commercials")
    : "All";

  const isRoutedCitySearch =
    city &&
    (normalized.includes("for sale") ||
      normalized.includes("for rent") ||
      normalized.includes("properties for") ||
      normalized.includes("property for") ||
      Boolean(matchedType));
  const query = isRoutedCitySearch ? "" : text;

  return {
    category,
    city,
    type: cleanType,
    query,
    label: text,
    filters: {
      activeCity: city || "All",
      activeType: cleanType,
      query,
      searchType: category,
    },
  };
}

export function parsePurchaseRoute(category, slug) {
  const navKey = category === "rentals" ? "rentals" : "buyers";
  return parsePropertyIntent(titleCase(slug || ""), navKey);
}

export function pricingStateFromLabel(label, navKey = "buyers") {
  const intent = parsePropertyIntent(label, navKey);
  return {
    category: intent.category,
    type: intent.type,
    city: intent.city,
    filters: intent.filters,
  };
}

export function pricingPathFor(label, navKey = "buyers") {
  const section = navKey === "rentals" ? "rentals" : "buyers";
  return `/purchase/${section}/${slugify(label)}`;
}
