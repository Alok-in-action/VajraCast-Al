"use client";

import { useState, useCallback, useRef } from "react";
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import type { Map as MapLibreMap } from "maplibre-gl";
import {
  CloudLightning, Globe, X, Loader2, Wind, Droplets,
  Thermometer, Eye, Gauge, Zap, AlertTriangle, CheckCircle2,
  Info, MapPin, RefreshCw, Satellite,
} from "lucide-react";
import { NowcastData, WeatherData, AiSummaryResponse } from "@/lib/nowcast/types";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from "recharts";

// ── helpers ─────────────────────────────────────────────────────────────────

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    return (
      d.address?.city || d.address?.town || d.address?.village ||
      d.address?.county || d.display_name?.split(",")[0] ||
      `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`
    );
  } catch {
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  }
}

const alertColorClass = (alert: string) => {
  const a = alert.toLowerCase();
  if (a.includes("red"))    return "bg-red-500/20 text-red-400 border-red-500/30";
  if (a.includes("orange")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (a.includes("yellow")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-green-500/20 text-green-400 border-green-500/30";
};

const riskColor = (prob: number) =>
  prob >= 70 ? "text-red-400" : prob >= 40 ? "text-amber-400" : "text-green-400";

const owmIcon = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

// India-centric initial state
const INDIA_CENTER: [number, number] = [78.9629, 20.5937];
const INDIA_ZOOM = 4.5;

// ── types ────────────────────────────────────────────────────────────────────

interface ClickedPin {
  lat: number;
  lon: number;
}

// ── component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeView, setActiveView] = useState<"mapcn" | "ventusky">("mapcn");
  const [panelOpen, setPanelOpen]   = useState(false);
  const [pin, setPin]               = useState<ClickedPin | null>(null);
  // Ventusky iframe URL — updated to pin location when user requests it
  const [ventuskyUrl, setVentuskyUrl] = useState(
    "https://www.ventusky.com/?p=20;78;5&l=lightning"
  );

  // data state
  const [locationName, setLocationName] = useState("");
  const [weather,   setWeather]   = useState<WeatherData | null>(null);
  const [nowcast,   setNowcast]   = useState<NowcastData | null>(null);
  const [aiSummary, setAiSummary] = useState<AiSummaryResponse | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  // ── fetch pipeline ──────────────────────────────────────────────────────────

  const fetchLocationData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setAiLoading(true);
    setError(null);
    setPanelOpen(true);
    setWeather(null);
    setNowcast(null);
    setAiSummary(null);

    // 1. Reverse geocode
    const name = await reverseGeocode(lat, lon);
    setLocationName(name);

    try {
      // 2. Nowcast + weather (combined API)
      const res = await fetch(
        `/api/nowcast?lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&name=${encodeURIComponent(name)}`
      );
      if (!res.ok) throw new Error("Nowcast fetch failed");
      const { nowcast: nc, weather: wx } = await res.json();
      setNowcast(nc);
      setWeather(wx);
      setLoading(false);

      // 3. AI summary (async, non-blocking)
      const aiRes = await fetch("/api/summary", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(nc),
      });
      if (aiRes.ok) {
        setAiSummary(await aiRes.json());
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setLoading(false);
    } finally {
      setAiLoading(false);
    }
  }, []);

  // ── MapLibre click handler ──────────────────────────────────────────────────
  // We wire this through onViewportChange + mapRef approach to get map click
  // We'll use the Map's onClick via a wrapper div approach with the MapRef
  const mapRef = useRef<MapLibreMap | null>(null);

  const handleMapContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeView !== "mapcn") return;
      const map = mapRef.current;
      if (!map) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lngLat = map.unproject([x, y]);

      const lat = lngLat.lat;
      const lon = lngLat.lng;
      setPin({ lat, lon });
      fetchLocationData(lat, lon);
    },
    [activeView, fetchLocationData]
  );

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950">

      {/* ── MAP SWITCHER ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1
                       bg-slate-900/95 backdrop-blur border border-slate-700 rounded-full px-2 py-1.5 shadow-xl">
        <button
          onClick={() => setActiveView("mapcn")}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all
            ${activeView === "mapcn"
              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <Satellite size={14} />
          <span className="hidden sm:inline">Map</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Click to Analyze</span>
        </button>
        <div className="w-px h-4 bg-slate-700" />
        <button
          onClick={() => {
            setActiveView("ventusky");
            setPanelOpen(false); // hide panel – Ventusky has its own UI
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all
            ${activeView === "ventusky"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              : "text-slate-400 hover:text-slate-200"}`}
        >
          <CloudLightning size={14} />
          <span className="hidden sm:inline">Ventusky</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Live Layers</span>
        </button>
      </div>

      {/* ── STATUS BADGES ── */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-1.5">
        <Badge variant="outline" className="bg-slate-900/90 text-cyan-400 border-slate-700 backdrop-blur text-xs">
          {activeView === "mapcn"
            ? "✦ MapLibre GL — Click anywhere for live AI nowcast"
            : "✦ Ventusky embedded — Live global lightning & storm layers"}
        </Badge>
        {nowcast && (
          <Badge variant="outline" className="bg-slate-900/90 text-slate-400 border-slate-700 backdrop-blur text-xs">
            Source: {nowcast.source.toUpperCase()} · Confidence: {nowcast.confidence}
          </Badge>
        )}
      </div>

      {/* ── MAPCN NATIVE MAP ── */}
      {activeView === "mapcn" && (
        <div
          className="absolute inset-0 z-0 cursor-crosshair"
          onClick={handleMapContainerClick}
          title="Click to analyze this location"
        >
          <Map
            ref={mapRef as any}
            center={INDIA_CENTER}
            zoom={INDIA_ZOOM}
            theme="dark"
            className="h-full w-full"
          >
            <MapControls />

            {/* Dropped pin marker */}
            {pin && (
              <MapMarker longitude={pin.lon} latitude={pin.lat}>
                <MarkerContent>
                  <div className="relative">
                    {/* Pulsing ring */}
                    <span className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/40" />
                    <div className="relative flex h-5 w-5 items-center justify-center rounded-full
                                    bg-cyan-500 border-2 border-white shadow-lg shadow-cyan-500/50">
                      <Zap size={10} className="text-white" />
                    </div>
                  </div>
                </MarkerContent>
                <MarkerPopup closeButton>
                  <div className="text-xs text-slate-700 font-medium min-w-[140px]">
                    <div className="font-semibold text-slate-900 mb-1">{locationName || "Analyzing…"}</div>
                    {nowcast && (
                      <>
                        <div>⚡ Storm: <span className="font-bold">{nowcast.forecasts[0].thunderstormProb}%</span></div>
                        <div>🌩 Lightning: <span className="font-bold">{nowcast.forecasts[0].lightningProb}%</span></div>
                        {weather && (
                          <div>🌡 Temp: <span className="font-bold">{Math.round(weather.temp)}°C</span></div>
                        )}
                      </>
                    )}
                  </div>
                </MarkerPopup>
              </MapMarker>
            )}
          </Map>
        </div>
      )}

      {/* ── VENTUSKY IFRAME — always mounted, shown/hidden via CSS ── */}
      <iframe
        key={ventuskyUrl}        /* remount only when URL changes */
        src={ventuskyUrl}
        title="Ventusky Live Lightning Map"
        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
          activeView === "ventusky" ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
        }`}
        allow="geolocation"
        loading="lazy"
      />

      {/* Click hint */}
      {activeView === "mapcn" && !panelOpen && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none">
          <div className="bg-slate-900/90 border border-slate-700 text-slate-300 text-sm
                          px-4 py-2 rounded-full backdrop-blur flex items-center gap-2">
            <MapPin size={14} className="text-cyan-400" />
            Click any location on the map to analyze
          </div>
        </div>
      )}

      {/* ── SLIDE-IN PANEL — only shown on MapCN tab ── */}
      {activeView === "mapcn" && (
      <div
        className={`absolute z-40 transition-all duration-500 ease-in-out
          ${
            panelOpen
              // Mobile: slide up from bottom, full width
              // sm+: slide in from right, fixed width
              ? "bottom-0 left-0 right-0 h-[85vh] sm:h-full sm:bottom-auto sm:top-0 sm:left-auto sm:right-0 sm:w-[420px] translate-y-0 sm:translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-full bottom-0 left-0 right-0 h-[85vh] sm:h-full sm:bottom-auto sm:top-0 sm:left-auto sm:right-0 sm:w-[420px]"
          }`}
      >
        {panelOpen && (
          <div className="h-full bg-slate-950/98 border-t sm:border-t-0 sm:border-l border-slate-800 overflow-y-auto
                           shadow-2xl flex flex-col rounded-t-2xl sm:rounded-none">

            {/* drag pill on mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Panel header */}
            <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-slate-800
                             px-5 py-4 flex items-center justify-between shrink-0 z-10">
              <div>
                <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                  <MapPin size={16} className="text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[260px]">{locationName || "Analyzing…"}</span>
                </h2>
                {pin && (
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {pin.lat.toFixed(4)}°N · {pin.lon.toFixed(4)}°E
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {pin && (
                  <button
                    onClick={() => fetchLocationData(pin.lat, pin.lon)}
                    disabled={loading}
                    className="text-slate-500 hover:text-cyan-400 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </button>
                )}
                <button
                  onClick={() => setPanelOpen(false)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 px-5 py-4 space-y-5">

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-cyan-500" size={32} />
                  <p className="text-slate-400 text-sm text-center">
                    Fetching OpenWeather · nowcast · Gemini AI…
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* ─ LIVE WEATHER ─ */}
              {weather && !loading && (
                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Globe size={11} /> Current Weather · OpenWeather
                  </h3>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-4xl font-bold text-slate-100">
                          {Math.round(weather.temp)}°C
                        </div>
                        <div className="text-sm text-slate-400 capitalize mt-1">
                          {weather.description}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Feels like {Math.round(weather.feelsLike)}°C
                        </div>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={owmIcon(weather.icon)} alt={weather.description} className="w-16 h-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: <Droplets size={12} className="text-blue-400" />,   label: "Humidity",   val: `${weather.humidity}%` },
                        { icon: <Wind size={12} className="text-slate-400" />,      label: "Wind",       val: `${weather.windSpeed} m/s` },
                        { icon: <Eye size={12} className="text-slate-400" />,       label: "Visibility", val: `${(weather.visibility / 1000).toFixed(1)} km` },
                        { icon: <Gauge size={12} className="text-slate-400" />,     label: "Pressure",   val: `${weather.pressure} hPa` },
                        { icon: <Thermometer size={12} className="text-orange-400" />, label: "Cloud %", val: `${weather.cloudiness}%` },
                        { icon: <Globe size={12} className="text-slate-400" />,     label: "Country",    val: weather.country },
                      ].map(({ icon, label, val }) => (
                        <div key={label} className="flex items-center gap-2 bg-slate-950/60 rounded-lg p-2">
                          {icon}
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wide">{label}</div>
                            <div className="text-xs font-semibold text-slate-300">{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ─ NOWCAST RISK ─ */}
              {nowcast && !loading && (
                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CloudLightning size={11} className="text-amber-400" /> Thunderstorm Nowcast · 0–120 min
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { icon: <CloudLightning size={13} className="text-amber-400" />, label: "Thunderstorm",  val: nowcast.forecasts[0].thunderstormProb,   unit: "%" },
                      { icon: <Zap size={13} className="text-yellow-400" />,           label: "Lightning Risk", val: nowcast.forecasts[0].lightningProb,       unit: "%" },
                      { icon: <Droplets size={13} className="text-blue-400" />,        label: "Rainfall",       val: nowcast.forecasts[0].rainfallIntensity,   unit: " mm/hr" },
                      { icon: <Eye size={13} className="text-slate-400" />,            label: "Cloud Cover",    val: nowcast.forecasts[0].cloudCover,          unit: "%" },
                    ].map(({ icon, label, val, unit }) => (
                      <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 uppercase tracking-wide mb-1">
                          {icon} {label}
                        </div>
                        <div className={`text-2xl font-bold ${riskColor(typeof val === "number" ? val : 0)}`}>
                          {val}{unit}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Trend chart */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-3">Probability Trend</div>
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={nowcast.forecasts.map(f => ({ t: `+${f.leadTime}m`, Storm: f.thunderstormProb, Lightning: f.lightningProb }))}
                          margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="t" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 11 }} />
                          <Area type="monotone" dataKey="Storm"     stroke="#f59e0b" fill="url(#gS)" strokeWidth={2} dot={false} />
                          <Area type="monotone" dataKey="Lightning" stroke="#eab308" fill="url(#gL)" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              )}

              {/* ─ GEMINI AI SUMMARY ─ */}
              {!loading && nowcast && (
                <section>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CloudLightning size={11} className="text-cyan-400" /> Gemini AI Meteorologist
                  </h3>
                  {aiLoading || !aiSummary ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                      <Loader2 size={16} className="animate-spin text-cyan-500 shrink-0" />
                      <span className="text-sm text-slate-400">Generating AI analysis…</span>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${alertColorClass(aiSummary.imdStyleAlert)}`}>
                        <AlertTriangle size={11} /> {aiSummary.imdStyleAlert}
                      </span>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5">Situation</div>
                        <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.summary}</p>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
                        <div className="flex items-center gap-1 text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                          <Info size={10} /> Warning
                        </div>
                        <p className="text-sm text-amber-400">{aiSummary.warning}</p>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Safety Recommendations
                        </div>
                        <ul className="space-y-1.5">
                          {aiSummary.recommendations.map((r, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                              <span className="text-cyan-500 mt-0.5 shrink-0">›</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ─ SWITCH TO VENTUSKY AT PINNED LOCATION ─ */}
              {pin && !loading && (
                <button
                  onClick={() => {
                    // Build a Ventusky URL centred on the clicked pin at zoom 9, lightning layer
                    const url = `https://www.ventusky.com/?p=${pin.lat.toFixed(3)};${pin.lon.toFixed(3)};9&l=lightning`;
                    setVentuskyUrl(url);
                    setActiveView("ventusky");
                    setPanelOpen(false); // Ventusky has its own UI
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-purple-500/30
                             bg-purple-500/5 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors"
                >
                  <CloudLightning size={14} />
                  View this location on Ventusky
                </button>
              )}

            </div>
          </div>
        )}
      </div>
      )}

    </div>
  );
}
