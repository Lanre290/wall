/**
 * Currency conversion service for Thoughtboard
 * Automatically fetches and caches live USD -> NGN exchange rates.
 */

interface CachedRate {
  rate: number;
  lastUpdated: number;
}

let cachedRate: CachedRate = {
  rate: 1550, // Safe default fallback
  lastUpdated: 0
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache

export async function getLiveUsdToNgnRate(): Promise<number> {
  const now = Date.now();
  
  // Return cached rate if still fresh
  if (cachedRate.lastUpdated && now - cachedRate.lastUpdated < CACHE_DURATION_MS) {
    return cachedRate.rate;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 } // Next.js cache for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates.NGN === "number") {
        cachedRate = {
          rate: Math.round(data.rates.NGN),
          lastUpdated: now
        };
        return cachedRate.rate;
      }
    }
  } catch (err) {
    console.warn("Live currency fetch failed, using fallback rate:", err);
  }

  return cachedRate.rate;
}

/**
 * Format a number into standard Nigerian Naira display with thousands separators
 */
export function formatNgn(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}
