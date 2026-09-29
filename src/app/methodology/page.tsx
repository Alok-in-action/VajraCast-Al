export default function Methodology() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Methodology & Architecture</h1>
      
      <div className="prose prose-invert prose-slate max-w-none">
        <p className="text-slate-300 text-lg">
          VajraCast AI is designed as a satellite-first nowcasting platform. While this MVP demonstrates the frontend architecture and AI-agent integration using mocked/heuristic data, the production pipeline is built to ingest real meteorological feeds.
        </p>

        <h3 className="text-xl font-semibold text-slate-200 mt-8 mb-4 border-b border-slate-800 pb-2">1. Data Architecture (Production Vision)</h3>
        <ul className="space-y-2 text-slate-400 list-disc pl-5">
          <li><strong>Satellite (INSAT-3D/3DR):</strong> Thermal IR and Water Vapor channels for convective cloud top cooling rates.</li>
          <li><strong>Lightning (IITM / GLM):</strong> Real-time stroke density mapping.</li>
          <li><strong>Radar (DWR):</strong> Where available, high-resolution reflectivity (MaxZ).</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-200 mt-8 mb-4 border-b border-slate-800 pb-2">2. The Nowcast Model</h3>
        <p className="text-slate-400 mb-4">
          The core forecasting engine utilizes optical flow (advection) for 0-30 min horizons, blending into a Deep Learning (e.g., U-Net or ConvLSTM) residual model for 30-120 min horizons. The model outputs a probability matrix (0-100%) for thunderstorm occurrence over a 5x5km grid.
        </p>

        <h3 className="text-xl font-semibold text-slate-200 mt-8 mb-4 border-b border-slate-800 pb-2">3. Explainable AI Layer</h3>
        <p className="text-slate-400 mb-4">
          A major challenge in weather forecasting is communication. Raw probabilities are often misinterpreted by the public. VajraCast utilizes <strong>Google Gemini 1.5</strong> to translate complex probability matrices into simple, actionable regional alerts.
        </p>
        <p className="text-slate-400">
          The system implements <strong>Server-side Key Rotation</strong> to ensure high availability for the Gemini API, automatically failing over to fallback keys if rate limits or quotas are hit during extreme weather events.
        </p>

        <h3 className="text-xl font-semibold text-slate-200 mt-8 mb-4 border-b border-slate-800 pb-2">4. Demo Mode Implementation</h3>
        <p className="text-slate-400">
          Currently, the app runs in Demo Mode. To ensure the hackathon presentation is robust, the `lib/nowcast/demo-data.ts` uses deterministic geographic hashing to simulate realistic thunderstorm probabilities, which the AI then analyzes in real-time.
        </p>
      </div>
    </div>
  );
}
