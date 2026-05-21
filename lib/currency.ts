import { CURRENCIES } from "./config";

const FALLBACK_RATES: Record<string, number> = {
  AED: 1,
  USD: 0.272,
  EUR: 0.249,
  GBP: 0.214,
  SAR: 1.02,
  INR: 22.7,
  PKR: 76.0,
  CAD: 0.371,
  AUD: 0.412,
  SGD: 0.367,
  JPY: 40.5,
  CHF: 0.243,
  CNY: 1.96,
  MYR: 1.21,
  KWD: 0.083,
};

export async function fetchRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/AED", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    if (data?.rates && typeof data.rates === "object") return data.rates;
  } catch {
    // fall through
  }
  return FALLBACK_RATES;
}

export function convertFromAED(amount: number, targetCurrency: string, rates: Record<string, number>): number {
  const rate = rates[targetCurrency] ?? FALLBACK_RATES[targetCurrency] ?? 1;
  return amount * rate;
}

export function formatCurrency(amount: number, currency: string): string {
  const cur = CURRENCIES.find((c) => c.code === currency);
  const symbol = cur?.symbol ?? currency;
  const rounded = currency === "JPY" || currency === "INR" || currency === "PKR"
    ? Math.round(amount)
    : Math.round(amount * 100) / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: rounded % 1 === 0 ? 0 : 2,
  }).format(rounded);
  return `${symbol} ${formatted}`;
}
