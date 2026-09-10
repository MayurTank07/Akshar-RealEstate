import { formatINR } from "./currency.js";
import { displayPropertyCode } from "./propertyCode.js";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Akshar Estate : The Property Hub, I would like to make an enquiry about your property services. Please share more details.";

export function normalizeWhatsAppNumber(phoneNumber = "") {
  const digits = String(phoneNumber).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}

export function isValidWhatsAppNumber(phoneNumber = "") {
  const phone = normalizeWhatsAppNumber(phoneNumber);
  return phone.length >= 10 && phone.length <= 15;
}

export function generateWhatsAppLink(phoneNumber, message = DEFAULT_WHATSAPP_MESSAGE) {
  const phone = normalizeWhatsAppNumber(phoneNumber);
  if (!isValidWhatsAppNumber(phone)) return "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppShareLink(message = "") {
  const text = String(message || DEFAULT_WHATSAPP_MESSAGE).trim();
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function normalizeEnquirerName(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function validateEnquirerName(value = "") {
  const name = normalizeEnquirerName(value);
  if (!name) return "Please enter your name to continue.";
  if (/^\d+$/.test(name.replace(/\s+/g, ""))) return "Please enter a valid name, not only numbers.";
  if (name.length < 2) return "Please enter at least 2 characters.";
  if (name.length > 80) return "Please keep the name under 80 characters.";
  return "";
}

export function storedEnquirerName() {
  if (typeof localStorage === "undefined") return "";
  return normalizeEnquirerName(localStorage.getItem("aksharWhatsappEnquirerName") || "");
}

export function saveEnquirerName(value = "") {
  const name = normalizeEnquirerName(value);
  if (typeof localStorage !== "undefined" && name) {
    localStorage.setItem("aksharWhatsappEnquirerName", name);
  }
  return name;
}

export function userDisplayName(user) {
  return normalizeEnquirerName(user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.fullName || "");
}

function present(value) {
  const text = String(value ?? "").trim();
  return text || "Not specified";
}

function propertyPrice(property) {
  if (property?.priceAmount || property?.price) {
    return formatINR(property.priceAmount || property.price);
  }
  return "Price on request";
}

function propertyConfiguration(property) {
  if (property?.beds) return `${property.beds} BHK`;
  if (property?.type) return property.type;
  if (property?.category) return property.category;
  return "Not specified";
}

function propertyArea(property) {
  if (property?.area) return property.area;
  if (property?.measurement?.value) return `${property.measurement.value} ${property.measurement.unit || "sq.ft"}`;
  if (property?.plotArea) return `${property.plotArea} sq.ft`;
  if (property?.landArea) return property.landArea;
  if (property?.sqft) return `${property.sqft} sq.ft`;
  return "Not specified";
}

function propertyLocationLabel(property) {
  const map = property?.map || {};
  const locality = property?.location || map.area || "";
  const city = property?.city || map.city || "";
  const state = map.state || property?.state || "Gujarat";
  const location = [locality, city && city !== locality ? city : "", state].filter(Boolean).join(", ");
  return location || "Gujarat";
}

function propertyHighlights(property) {
  const items = [
    ...(property?.highlights || []),
    ...(property?.features || []),
    ...(property?.amenities || []),
  ].filter(Boolean);
  return Array.from(new Set(items)).slice(0, 5).join(" • ") || "Verified Listing";
}

export function propertyWhatsAppNumber(property) {
  const broker = property?.broker || {};
  if (broker.hasDirectContact === false) return "";
  return broker.whatsapp || broker.phone || "";
}

export function propertyWhatsAppMessage(property, options = {}) {
  const customerName = normalizeEnquirerName(options.customerName);
  const label = displayPropertyCode(property?.propertyCode, property?.propertyId || property?.title || "this property");
  const brokerName = property?.broker?.name || "Akshar Estate Team";
  const project = property?.topProject || property?.developerName || property?.title || "";
  const map = property?.map || {};
  const locality = property?.location || map.area || "";
  const city = property?.city || map.city || "";
  const state = map.state || property?.state || "";

  return [
    `Hello *${brokerName}*,`,
    "",
    `My name is ${customerName || "a prospective buyer"}, and I am interested in the following property listed on Akshar Estate: The Property Hub.`,
    "",
    "*Property Details*",
    `• *Property ID:* ${label}`,
    `• *Price:* ${propertyPrice(property)}`,
    `• *Property Type:* ${present(property?.type || property?.category)}`,
    `• *Configuration:* ${propertyConfiguration(property)}`,
    `• *Project:* ${present(project)}`,
    `• *Locality:* ${present(locality)}`,
    `• *City:* ${present(city)}`,
    `• *State:* ${present(state)}`,
    "",
    "Could you please share more details regarding availability, site visit, amenities, and payment options?",
    "",
    "Thank you.",
  ].join("\n");
}

export function propertyWhatsAppShareMessage(property, options = {}) {
  const pageUrl = options.url || "";
  const broker = property?.broker || {};
  const label = displayPropertyCode(property?.propertyCode, property?.propertyId || property?.title || "this property");
  const title = property?.title || `${propertyConfiguration(property)} Property`;
  const brokerName = broker.name || "Akshar Estate Team";
  const brokerPhone = broker.phone || broker.whatsapp || "";
  const contactLines = [
    `*${brokerName}*`,
    broker.designation || "",
    brokerPhone ? `*Call/WhatsApp:* ${brokerPhone}` : "",
  ].filter(Boolean);

  return [
    `*${title} - ${property?.city || property?.location || "Gujarat"}*`,
    "",
    "Dear Sir/Ma'am,",
    "",
    "We are pleased to share a verified property listing from Akshar Estate - The Property HUB.",
    "",
    "*Property Details*",
    `*Location:* ${propertyLocationLabel(property)}`,
    `*Area:* ${propertyArea(property)}`,
    `*Price:* ${propertyPrice(property)}`,
    `*Property ID:* ${label}`,
    "",
    "*Key Highlights*",
    propertyHighlights(property),
    "",
    "*View Complete Details*",
    pageUrl,
    "",
    "*For price discussion or site visit, please contact:*",
    contactLines.join("\n"),
    "",
    "*Akshar Estate - The Property HUB*",
    "Trusted Property Advisory & Verified Listings",
  ].filter((line) => line !== undefined && line !== null).join("\n");
}
