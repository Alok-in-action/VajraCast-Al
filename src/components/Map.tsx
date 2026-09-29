"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { NowcastData } from "@/lib/nowcast/types";

// Fix for default marker icons in React Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  nowcastData: NowcastData;
}

export default function Map({ nowcastData }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full bg-slate-800 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>;
  }

  const { lat, lon, name } = nowcastData.location;
  const currentRisk = nowcastData.forecasts[0].thunderstormProb;
  
  // Color scale for risk
  const getRiskColor = (prob: number) => {
    if (prob > 70) return "#ef4444"; // Red
    if (prob > 40) return "#f59e0b"; // Amber
    return "#3b82f6"; // Blue
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-700 shadow-lg relative z-0">
      <MapContainer 
        center={[lat, lon]} 
        zoom={10} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lon]} icon={icon}>
          <Popup className="text-slate-900 font-medium">
            {name} <br />
            Risk: {currentRisk}%
          </Popup>
        </Marker>
        
        {/* Risk Radius */}
        <Circle 
          center={[lat, lon]}
          pathOptions={{ 
            fillColor: getRiskColor(currentRisk), 
            color: getRiskColor(currentRisk),
            fillOpacity: 0.2
          }}
          radius={15000} // 15km radius
        />
        
        {/* Mock convective band nearby if risk is high */}
        {currentRisk > 50 && (
          <Circle 
            center={[lat + 0.1, lon - 0.1]}
            pathOptions={{ 
              fillColor: "#ef4444", 
              color: "#ef4444",
              fillOpacity: 0.4
            }}
            radius={8000} // 8km radius
          />
        )}
      </MapContainer>
    </div>
  );
}
