export function parseINRAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value || "").toLowerCase();
  const amount = Number.parseFloat(text.replace(/[^\d.]/g, "")) || 0;
  if (!amount) return 0;
  if (text.includes("cr") || text.includes("crore")) return amount * 10000000;
  if (text.includes("l") || text.includes("lakh") || text.includes("lac")) return amount * 100000;
  if (text.includes("k")) return amount * 1000;
  return amount;
}

export function formatINR(value) {
  const amount = parseINRAmount(value);
  if (!amount) return "₹0";
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${Number(crores.toFixed(crores >= 10 ? 1 : 2)).toString()} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${Number(lakhs.toFixed(lakhs >= 10 ? 1 : 2)).toString()} Lakh`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function moneyInputValue(value) {
  const amount = parseINRAmount(value);
  return amount ? String(amount) : "";
}

export function stripINRFormatting(displayValue) {
  return String(displayValue || "").replace(/[^\d]/g, "");
}

export function formatINRForInput(rawDigits) {
  if (!rawDigits && rawDigits !== 0) return "";
  const num = Number(stripINRFormatting(rawDigits)) || 0;
  if (!num) return "";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function countDigitsBeforeCaret(value, caretIndex) {
  return String(value || "").slice(0, caretIndex ?? 0).replace(/[^\d]/g, "").length;
}

export function caretIndexForDigitCount(value, digitCount) {
  if (!digitCount) return 0;
  let seen = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    if (/\d/.test(text[index])) {
      seen += 1;
      if (seen >= digitCount) return index + 1;
    }
  }
  return text.length;
}
