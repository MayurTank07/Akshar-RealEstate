const SECTION_PRESETS = {
  basic: "Basic Details",
  price: "Price Details",
  location: "Location Details",
  features: "Property Features",
  rooms: "Room Details",
  land: "Land / Plot Details",
  commercial: "Commercial Details",
  amenities: "Amenities",
  nearby: "Nearby Landmarks",
  owner: "Owner Details",
  media: "Media / Images",
  legal: "Legal / Documents",
  seo: "SEO / Meta Details",
  description: "Description",
};

export const propertySectionOptions = Object.entries(SECTION_PRESETS).map(([key, label]) => ({ key, label }));

const sectionDefaults = {
  residential: ["basic", "price", "location", "rooms", "features", "amenities", "nearby", "owner", "media", "legal", "seo", "description"],
  land: ["basic", "price", "location", "land", "features", "nearby", "owner", "media", "legal", "seo", "description"],
  commercial: ["basic", "price", "location", "commercial", "features", "amenities", "nearby", "owner", "media", "legal", "seo", "description"],
  farmhouse: ["basic", "price", "location", "rooms", "land", "features", "amenities", "nearby", "owner", "media", "legal", "seo", "description"],
  mixed: ["basic", "price", "location", "rooms", "land", "commercial", "features", "amenities", "nearby", "owner", "media", "legal", "seo", "description"],
};

const textIncludes = (text, values) => values.some((value) => text.includes(value));

function kindFromText(value = "") {
  const normalized = String(value || "").toLowerCase().replace(/[_-]+/g, " ");
  if (!normalized.trim()) return "";
  if (textIncludes(normalized, ["farm house", "farmhouse"])) return "farmhouse";
  if (textIncludes(normalized, ["agriculture", "agricultural", "plot", "land"])) return "land";
  if (textIncludes(normalized, ["shop", "office", "warehouse", "commercial", "showroom", "godown", "industrial"])) return "commercial";
  if (textIncludes(normalized, ["flat", "apartment", "apartments", "house", "bungalow", "villa", "penthouse", "row house", "home"])) return "residential";
  return "";
}

export function propertyKind(propertyOrType = "") {
  if (typeof propertyOrType === "string") return kindFromText(propertyOrType) || "mixed";
  const typeKind = kindFromText(propertyOrType?.type);
  if (typeKind) return typeKind;
  const fallbackKind = kindFromText([propertyOrType?.category, propertyOrType?.title].filter(Boolean).join(" "));
  if (fallbackKind) return fallbackKind;
  return "mixed";
}

export function defaultSectionsForProperty(propertyOrType = "") {
  return sectionDefaults[propertyKind(propertyOrType)] || sectionDefaults.mixed;
}

export function supportsRooms(propertyOrType = "") {
  return ["residential", "farmhouse", "mixed"].includes(propertyKind(propertyOrType));
}

export function supportsLand(propertyOrType = "") {
  return ["land", "farmhouse", "mixed"].includes(propertyKind(propertyOrType));
}

export function supportsCommercial(propertyOrType = "") {
  return ["commercial", "mixed"].includes(propertyKind(propertyOrType));
}

export function compactSpecs(property = {}) {
  const area = property.area || (property.measurement?.value ? `${property.measurement.value} ${property.measurement.unit || "sqft"}` : property.sqft ? `${property.sqft} sq.ft` : "");
  const rows = [
    ["Property Type", property.type],
    ["Category", property.category],
    ["Availability", property.availability],
    ["Status", property.propertyStatus || property.status],
    ["Area", area],
    ["Facing", property.facing],
    ["Ownership", property.ownership],
    ["Property ID", property.propertyCode],
  ];

  if (supportsRooms(property)) {
    rows.push(
      ["Bedrooms", property.beds ? `${property.beds} BHK` : ""],
      ["Bathrooms", property.baths],
      ["Kitchen", property.kitchen],
      ["Balcony", property.balcony],
      ["Furnishing", property.furnishing],
      ["Floor", [property.floorNumber, property.totalFloors ? `of ${property.totalFloors}` : ""].filter(Boolean).join(" ")],
      ["Parking", property.parking],
      ["Year Built", property.yearBuilt]
    );
  }

  if (supportsLand(property)) {
    rows.push(
      ["Land Area", property.landArea],
      ["Plot Size", property.plotSize],
      ["Road Access", property.roadAccess],
      ["Water Availability", property.waterAvailability],
      ["Electricity", property.electricityAvailability],
      ["Zoning", property.zoning]
    );
  }

  if (supportsCommercial(property)) {
    rows.push(
      ["Frontage", property.frontage],
      ["Washrooms", property.washrooms],
      ["Pantry", property.pantry],
      ["Loading Access", property.loadingAccess],
      ["Business Suitability", property.businessSuitability],
      ["Floor", [property.floorNumber, property.totalFloors ? `of ${property.totalFloors}` : ""].filter(Boolean).join(" ")],
      ["Parking", property.parking]
    );
  }

  rows.push(["ROI", property.roi]);
  return rows.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");
}
