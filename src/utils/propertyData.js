export function getPropertyCity(property) {
  if (property.city) return property.city;
  const parts = String(property.location || "").split(",");
  return parts[parts.length - 1]?.trim() || "";
}

export function normalizeProperty(property, source = "pricing") {
  const city = getPropertyCity(property);
  return {
    ...property,
    city,
    type: property.type || "Apartments",
    sqft: property.sqft || Number.parseInt(String(property.area || "").replace(/[^\d]/g, ""), 10) || 0,
    area: property.area || (property.sqft ? `${property.sqft} sq.ft` : ""),
    badge: property.badge || property.tag || "Featured",
    badgeColor:
      property.badgeColor ||
      (property.tag === "New" ? "bg-emerald-500" : property.tag === "Hot" ? "bg-orange-600" : "bg-blue-600"),
    status: property.status || "active",
    source: property.source || source,
  };
}

export function mergeProperties(primary = [], fallback = [], source = "pricing") {
  const seen = new Set();
  const merged = [];

  [...primary, ...fallback].forEach((item) => {
    const property = normalizeProperty(item, source);
    const key = `${String(property.title).toLowerCase()}-${String(property.location).toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(property);
  });

  return merged;
}
