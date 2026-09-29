export interface NowcastData {
  timestamp: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  forecasts: {
    leadTime: number;
    thunderstormProb: number;
    lightningProb: number;
    rainfallIntensity: number;
    cloudCover: number;
  }[];
  confidence: "High" | "Medium" | "Low";
  source: "satellite" | "mock" | "radar" | "openweather";
}

export interface AiSummaryResponse {
  summary: string;
  warning: string;
  recommendations: string[];
  imdStyleAlert: string;
}

export interface WeatherData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  weatherId: number; // OWM weather ID for thunderstorm detection
  visibility: number;
  pressure: number;
  cloudiness: number;
}

export interface LocationPanelData {
  lat: number;
  lon: number;
  displayName: string;
  weather: WeatherData | null;
  nowcast: NowcastData | null;
  aiSummary: AiSummaryResponse | null;
  loading: boolean;
  error: string | null;
}
