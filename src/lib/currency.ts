export function currencySymbol(code?: string | null): string {
  const original = code || "";
  const key = original.toUpperCase();
  let symbol: string | undefined;
  switch (key) {
    case "EUR":
      symbol = "€"; break;
    case "USD":
      symbol = "$"; break;
    case "GBP":
      symbol = "£"; break;
    case "JPY":
      symbol = "¥"; break;
    case "CHF":
      symbol = "CHF"; break;
    case "AUD":
      symbol = "A$"; break;
    case "CAD":
      symbol = "C$"; break;
    case "SEK":
      symbol = "kr"; break;
    case "NOK":
      symbol = "kr"; break;
    case "DKK":
      symbol = "kr"; break;
    case "PLN":
      symbol = "zł"; break;
    case "CZK":
      symbol = "Kč"; break;
    case "CNY":
      symbol = "¥"; break;
    case "INR":
      symbol = "₹"; break;
    case "BRL":
      symbol = "R$"; break;
    case "TRY":
      symbol = "₺"; break;
    case "ZAR":
      symbol = "R"; break;
    default: {
      // No mapping: return the original code as provided
      return original;
    }
  }

  // If the mapped symbol is just the uppercased code (alphabetic only),
  // return the original code to preserve its casing from the backend.
  if (symbol && /^[A-Za-z]+$/.test(symbol) && symbol.toUpperCase() === key) {
    return original;
  }
  return symbol || original;
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
