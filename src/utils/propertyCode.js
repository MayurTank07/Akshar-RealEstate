const readablePropertyCodePattern = /^AETP-[A-Z0-9]{2,4}-\d{4,6}$/;

export function isReadablePropertyCode(propertyCode = "") {
  return readablePropertyCodePattern.test(String(propertyCode || "").trim().toUpperCase());
}

export function displayPropertyCode(propertyCode = "", fallback = "Not assigned") {
  const code = String(propertyCode || "").trim().toUpperCase();
  return isReadablePropertyCode(code) ? code : fallback;
}
