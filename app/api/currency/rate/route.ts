import { NextResponse } from "next/server";
import { getLiveUsdToNgnRate } from "../../../../lib/currency";

export async function GET(req: Request) {
  // Detect country from Vercel / Cloudflare edge headers
  const countryHeader = 
    req.headers.get("x-vercel-ip-country") || 
    req.headers.get("cf-ipcountry") || 
    req.headers.get("x-country-code") || 
    "";
    
  const detectedCountry = countryHeader.toUpperCase();
  const isNigeria = detectedCountry === "NG";
  const suggestedCurrency = isNigeria ? "NGN" : "USD";

  try {
    const rate = await getLiveUsdToNgnRate();
    return NextResponse.json({
      base: "USD",
      target: "NGN",
      rate,
      country: detectedCountry || "GLOBAL",
      isNigeria,
      suggestedCurrency,
      celebrationNgn: Math.round(7 * rate),
      plusNgn: Math.round(6 * rate),
      timestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({
      base: "USD",
      target: "NGN",
      rate: 1550,
      country: detectedCountry || "GLOBAL",
      isNigeria,
      suggestedCurrency,
      celebrationNgn: 10850,
      plusNgn: 9300,
      fallback: true
    });
  }
}
