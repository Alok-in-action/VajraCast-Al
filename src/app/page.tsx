import { Button } from "@/components/ui/button";
import { CloudLightning, Satellite, Brain, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-cyan-900/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-cyan-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SIH26072 Hackathon MVP
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Next-Gen Thunderstorm <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Nowcasting for India</span>
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-400 mx-auto mb-10">
            A satellite-first, AI-enhanced weather intelligence platform providing 0–120 minute predictive alerts for thunderstorms and lightning strikes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white w-full sm:w-auto font-medium gap-2">
                View Live Dashboard <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/methodology">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto">
                Read Methodology
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-slate-900 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-100">Why VajraCast AI Matters</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">India experiences thousands of lightning-related casualties annually. Traditional forecasts are too broad. We need hyper-local, immediate nowcasting.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-900/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-500 mb-6">
                <Satellite size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">Satellite-First Fusion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Designed to ingest INSAT-3D/3DR imagery and combine it with localized radar data for a high-fidelity 0-120 minute convective weather outlook.
              </p>
            </div>
            
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-900/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">Generative AI Summaries</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Raw probability matrices are translated into plain-language, actionable warnings for local authorities and the public using Gemini 1.5.
              </p>
            </div>
            
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-900/50 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-3">Explainable Risk UI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Clear visual indicators of thunderstorm probability, lightning risk, and rainfall proxy separated by lead times (15m, 30m, 60m, 120m).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
