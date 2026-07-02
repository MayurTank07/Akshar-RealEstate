export const countryCodeOptions = [
  { label: "India +91", value: "+91" },
  { label: "USA +1", value: "+1" },
  { label: "UK +44", value: "+44" },
  { label: "UAE +971", value: "+971" },
  { label: "Canada +1", value: "+1" },
  { label: "Australia +61", value: "+61" },
];

export function normalizePhoneDigits(value = "") {
  return String(value).replace(/\D/g, "").slice(0, 15);
}

export function buildInternationalPhone(countryCode = "+91", phone = "") {
  const digits = normalizePhoneDigits(phone);
  return digits ? `${countryCode}${digits}` : "";
}
