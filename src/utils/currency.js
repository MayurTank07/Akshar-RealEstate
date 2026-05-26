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
