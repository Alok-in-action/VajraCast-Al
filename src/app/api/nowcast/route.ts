import { NextResponse } from "next/server";
import { fetchWeatherByCoords, buildNowcastFromWeather } from "@/lib/weather/openweather";
import { getDemoNowcast } from "@/lib/nowcast/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const nameParam = searchParams.get("name") || "Unknown Location";

  if (!latParam || !lonParam) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);
  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  // Try to get live weather data first
  const weather = await fetchWeatherByCoords(lat, lon);

  // Build nowcast from real weather or fallback to demo
  const nowcast = weather
    ? buildNowcastFromWeather(weather, lat, lon, weather.name || nameParam)
    : getDemoNowcast(lat, lon, nameParam);

  return NextResponse.json({
    nowcast,
    weather,
  });
}
