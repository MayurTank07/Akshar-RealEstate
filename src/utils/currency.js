export const MAX_SUPPORTED_INR_AMOUNT = 9999999999;

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

const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function wordsBelowThousand(value) {
  const amount = Number(value) || 0;
  const parts = [];
  const hundreds = Math.floor(amount / 100);
  const remainder = amount % 100;
  if (hundreds) parts.push(`${units[hundreds]} Hundred`);
  if (remainder) {
    if (remainder < 20) parts.push(units[remainder]);
    else parts.push(`${tens[Math.floor(remainder / 10)]}${remainder % 10 ? `-${units[remainder % 10]}` : ""}`);
  }
  return parts.join(" ");
}

export function validateINRAmount(value, { required = false, max = MAX_SUPPORTED_INR_AMOUNT } = {}) {
  const text = String(value ?? "").trim();
  if (!text) return required ? "Amount is required." : "";
  if (/^-/.test(text)) return "Amount cannot be negative.";
  if (/[^\d,\s₹.]/.test(text)) return "Use numbers only for the amount.";
  const digits = stripINRFormatting(text);
  if (!digits) return required ? "Amount is required." : "";
  const amount = Number(digits);
  if (!Number.isSafeInteger(amount) || amount <= 0) return required ? "Enter a valid amount." : "";
  if (amount > max) return `Amount must be ${formatINRForInput(max)} or less.`;
  return "";
}

export function amountToIndianCurrencyWords(value, { max = MAX_SUPPORTED_INR_AMOUNT } = {}) {
  const amount = Number(stripINRFormatting(value));
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > max) return "";
  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const remainder = amount % 1000;
  const parts = [
    crore ? `${wordsBelowThousand(crore)} Crore` : "",
    lakh ? `${wordsBelowThousand(lakh)} Lakh` : "",
    thousand ? `${wordsBelowThousand(thousand)} Thousand` : "",
    remainder ? wordsBelowThousand(remainder) : "",
  ].filter(Boolean);
  return parts.length ? `${parts.join(" ")} Rupees Only` : "";
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
