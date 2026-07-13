export function publicPropertyMapQuery(property = {}) {
  const map = property.map || {};
  return [
    map.area || property.location,
    map.city || property.city,
    map.state,
    "India",
  ].filter(Boolean).join(", ");
}

export function publicGoogleMapsEmbedUrl(property = {}) {
  const query = publicPropertyMapQuery(property);
  if (!query) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
}

export function publicMapLabel(property = {}) {
  const map = property.map || {};
  return [map.area || property.location, map.city || property.city, map.state].filter(Boolean).join(", ") || "Approximate property area";
}
