export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">About VajraCast AI</h1>
      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
        Developed for SIH26072, VajraCast AI aims to bridge the gap between high-end meteorological data and last-mile public safety in India.
      </p>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">The Problem</h3>
        <p className="text-slate-400">
          Lightning strikes are one of the leading causes of natural disaster fatalities in India. While long-term weather models are accurate, the critical 0-120 minute window (nowcasting) often lacks hyper-local precision and actionable public communication.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">The Solution</h3>
        <p className="text-slate-400">
          A single, unified dashboard that ingests real-time data, forecasts thunderstorm trajectories, and uses Large Language Models to instantly generate localized safety alerts. Built entirely on Next.js 15 for seamless edge deployment.
        </p>
      </div>
    </div>
  );
}
