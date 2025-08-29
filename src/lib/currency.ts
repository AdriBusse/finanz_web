export function currencySymbol(code?: string | null): string {
  const key = (code || "").toUpperCase();
  switch (key) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "CHF":
      return "CHF";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    case "SEK":
      return "kr";
    case "NOK":
      return "kr";
    case "DKK":
      return "kr";
    case "PLN":
      return "zł";
    case "CZK":
      return "Kč";
    case "CNY":
      return "¥";
    case "INR":
      return "₹";
    case "BRL":
      return "R$";
    case "TRY":
      return "₺";
    case "ZAR":
      return "R";
    default:
      return key || "";
  }
}

export function formatAmount(amount: number, code?: string | null): string {
  const sym = currencySymbol(code);
  if (!Number.isFinite(amount)) {
    const raw = String(amount);
    return sym ? `${raw} ${sym}` : raw;
  }
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(rounded);
  return sym ? `${formatted} ${sym}` : formatted;
}
