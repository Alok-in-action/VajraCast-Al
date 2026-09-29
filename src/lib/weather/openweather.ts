import { WeatherData, NowcastData } from "@/lib/nowcast/types";
import { getDemoNowcast } from "@/lib/nowcast/demo-data";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn("No OPENWEATHER_API_KEY set, skipping live weather fetch.");
    return null;
  }

  try {
    const res = await fetch(
      `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`OWM error: ${res.status}`);

    const d = await res.json();
    return {
      name: d.name || "Unknown",
      country: d.sys?.country || "IN",
      lat: d.coord.lat,
      lon: d.coord.lon,
      temp: d.main.temp,
      feelsLike: d.main.feels_like,
      humidity: d.main.humidity,
      windSpeed: d.wind.speed,
      windDeg: d.wind.deg,
      description: d.weather[0]?.description || "",
      icon: d.weather[0]?.icon || "01d",
      weatherId: d.weather[0]?.id || 800,
      visibility: d.visibility || 10000,
      pressure: d.main.pressure,
      cloudiness: d.clouds?.all || 0,
    };
  } catch (err) {
    console.error("OpenWeather fetch failed:", err);
    return null;
  }
}

/**
 * Build a NowcastData object enriched by OpenWeather conditions.
 * If no API key, falls back to demo heuristics.
 */
export function buildNowcastFromWeather(weather: WeatherData | null, lat: number, lon: number, name: string): NowcastData {
  if (!weather) return getDemoNowcast(lat, lon, name);

  // OWM thunderstorm IDs are in range 200-232
  const isThunderstorm = weather.weatherId >= 200 && weather.weatherId < 300;
  // Drizzle/Rain: 300-531, heavy convective potential
  const isRainy = weather.weatherId >= 300 && weather.weatherId < 600;

  const baseProb = isThunderstorm ? 85 : isRainy ? 35 : weather.cloudiness > 70 ? 20 : 5;
  const lightningBase = isThunderstorm ? 75 : 3;

  const forecasts = [0, 15, 30, 60, 90, 120].map((leadTime, i) => {
    const decay = isThunderstorm ? (1 - i * 0.05) : (1 + i * 0.02);
    return {
      leadTime,
      thunderstormProb: Math.max(0, Math.min(100, Math.round(baseProb * decay))),
      lightningProb: Math.max(0, Math.min(100, Math.round(lightningBase * decay))),
      rainfallIntensity: isThunderstorm ? +(10 * decay).toFixed(1) : isRainy ? +(3 * decay).toFixed(1) : 0,
      cloudCover: weather.cloudiness,
    };
  });

  return {
    timestamp: new Date().toISOString(),
    location: { lat, lon, name },
    forecasts,
    confidence: isThunderstorm ? "High" : "Medium",
    source: "openweather",
  };
}
