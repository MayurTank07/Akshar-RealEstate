export function getPropertyCity(property) {
  if (property.city) return property.city;
  const parts = String(property.location || "").split(",");
  return parts[parts.length - 1]?.trim() || "";
}

const PUBLIC_PRIVATE_FIELDS = [
  "ownerName",
  "contact",
  "dealCustomerName",
  "dealCustomerPhone",
  "dealCustomerEmail",
  "dealCustomerAddress",
  "dealDate",
  "dealSource",
  "dealEnquiryId",
  "finalPrice",
  "finalPriceAmount",
  "commission",
  "commissionAmount",
  "paymentDetails",
  "statusRemarks",
  "ownerUserId",
  "ownerRequestId",
  "assignedTo",
  "createdBy",
  "updatedBy",
  "statusUpdatedBy",
];

export function sanitizePublicProperty(property) {
  if (!property || typeof property !== "object") return property;
  const safe = { ...property };
  PUBLIC_PRIVATE_FIELDS.forEach((field) => delete safe[field]);
  const map = property.map || {};
  return {
    ...safe,
    map: {
      area: map.area || property.location || "",
      city: map.city || property.city || "",
      state: map.state || "",
    },
    broker: property.broker && typeof property.broker === "object"
      ? {
          name: property.broker.name || "Akshar Estate Expert",
          phone: property.broker.phone || "+91 1800-123-4567",
          designation: property.broker.designation || "Real Estate Expert",
          avatar: property.broker.avatar || "",
        }
      : {
          name: "Akshar Estate Expert",
          phone: "+91 1800-123-4567",
          designation: "Real Estate Expert",
          avatar: "",
        },
  };
}

export function normalizeProperty(property, source = "pricing") {
  property = sanitizePublicProperty(property);
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
