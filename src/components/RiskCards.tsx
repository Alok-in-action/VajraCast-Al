import { NowcastData } from "@/lib/nowcast/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CloudLightning, Droplets, Zap, EyeOff } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface RiskCardsProps {
  nowcastData: NowcastData;
}

export default function RiskCards({ nowcastData }: RiskCardsProps) {
  const current = nowcastData.forecasts[0];
  
  const chartData = nowcastData.forecasts.map(f => ({
    time: `+${f.leadTime}m`,
    Thunderstorm: f.thunderstormProb,
    Lightning: f.lightningProb
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <CloudLightning size={14} className="text-amber-400"/>
              T-Storm Prob
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">{current.thunderstormProb}%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <Zap size={14} className="text-yellow-400"/>
              Lightning Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">{current.lightningProb}%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <Droplets size={14} className="text-blue-400"/>
              Rain Intensity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">{current.rainfallIntensity} <span className="text-sm font-normal text-slate-500">mm/hr</span></div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <EyeOff size={14} className="text-slate-400"/>
              Cloud Cover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">{current.cloudCover}%</div>
          </CardContent>
        </Card>

      </div>

      {/* Mini Trend Chart */}
      <Card className="bg-slate-900 border-slate-800 pt-4">
        <CardContent className="h-[200px] w-full">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-4">0-120 Min Probability Trend</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Thunderstorm" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTs)" />
              <Area type="monotone" dataKey="Lightning" stroke="#eab308" fillOpacity={1} fill="url(#colorLt)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
