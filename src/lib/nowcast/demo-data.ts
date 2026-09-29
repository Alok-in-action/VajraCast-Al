import { NowcastData } from "./types";

export const getDemoNowcast = (lat: number, lon: number, name: string): NowcastData => {
  // Generate realistic-looking deterministic mock data based on location hash
  const seed = (Math.abs(lat) * Math.abs(lon)) % 100;
  
  const generateTrend = (base: number, volatility: number) => {
    return [0, 15, 30, 60, 90, 120].map((leadTime, i) => {
      const modifier = Math.sin(seed + i) * volatility;
      return {
        leadTime,
        thunderstormProb: Math.max(0, Math.min(100, Math.round(base + modifier * 1.5))),
        lightningProb: Math.max(0, Math.min(100, Math.round((base - 10) + modifier * 2))),
        rainfallIntensity: Math.max(0, +( (base / 10) + modifier / 10 ).toFixed(1)),
        cloudCover: Math.max(0, Math.min(100, Math.round(base + 20 + modifier))),
      };
    });
  };

  // If seed > 50, it's a storm scenario. Otherwise, clear.
  const isStorm = seed > 30;
  const baseProb = isStorm ? 70 : 10;
  
  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon, name },
    forecasts: generateTrend(baseProb, isStorm ? 20 : 5),
    confidence: isStorm ? "High" : "Medium",
    source: "mock"
  };
};
