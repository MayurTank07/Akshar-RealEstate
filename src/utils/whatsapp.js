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

export function generateWhatsAppLink(phoneNumber, message = DEFAULT_WHATSAPP_MESSAGE) {
  const phone = normalizeWhatsAppNumber(phoneNumber);
  if (!phone) return "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsAppMessage(property) {
  const label = displayPropertyCode(property?.propertyCode, property?.propertyId || property?.title || "this property");
  return `Hello Akshar Estate : The Property Hub, I am interested in this property: ${label}. Please share more details.`;
}
