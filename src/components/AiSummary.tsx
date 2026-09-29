"use client";

import { AiSummaryResponse } from "@/lib/nowcast/types";
import { AlertTriangle, Info, CheckCircle2, CloudLightning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface AiSummaryProps {
  summary: AiSummaryResponse | null;
  loading: boolean;
}

export default function AiSummary({ summary, loading }: AiSummaryProps) {
  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader>
          <CardTitle className="text-slate-300 flex items-center gap-2 text-lg">
            <CloudLightning className="text-cyan-400 animate-pulse" />
            AI Meteorologist Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  const getAlertColor = (alertStr: string) => {
    const s = alertStr.toLowerCase();
    if (s.includes("red")) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (s.includes("orange") || s.includes("amber")) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    if (s.includes("yellow")) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const alertColor = getAlertColor(summary.imdStyleAlert);
  const isDanger = summary.imdStyleAlert.toLowerCase().includes("yellow") || 
                   summary.imdStyleAlert.toLowerCase().includes("orange") || 
                   summary.imdStyleAlert.toLowerCase().includes("red");

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl h-full">
      <CardHeader className="pb-3 border-b border-slate-800/50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-slate-200 flex items-center gap-2 text-lg font-semibold tracking-wide">
            <CloudLightning className="text-cyan-400" size={20} />
            AI Meteorologist Analysis
          </CardTitle>
          <Badge variant="outline" className={`font-mono text-xs ${alertColor}`}>
            {summary.imdStyleAlert}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Situation Summary</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {summary.summary}
          </p>
        </div>

        <div className={`p-3 rounded-md border ${isDanger ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            {isDanger ? <AlertTriangle size={14} className="text-amber-500" /> : <Info size={14} className="text-blue-500" />}
            Warning Status
          </h4>
          <p className={`text-sm ${isDanger ? 'text-amber-400' : 'text-slate-300'}`}>
            {summary.warning}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Safety Recommendations
          </h4>
          <ul className="space-y-2">
            {summary.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </CardContent>
    </Card>
  );
}
