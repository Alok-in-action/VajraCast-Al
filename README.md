# VajraCast AI ⚡️

VajraCast AI is a 0–120 minute thunderstorm and lightning nowcasting dashboard for India. It is built as a single, full-stack Next.js 15 application designed for the SIH26072 Hackathon.

## Features
- **Satellite-First Architecture Vision**: Designed to interface with real meteorological data (mocked for this MVP).
- **Interactive Dashboard**: Search Indian cities and view live nowcast risk mapping with Leaflet.
- **AI-Generated Alerts**: Uses Google Gemini 1.5 to translate complex probability data into plain-language, IMD-style alerts and safety recommendations.
- **API Key Rotation Engine**: Built-in backend service that automatically rotates between up to 6 Gemini API keys if quotas or rate limits are hit.
- **Fully Responsive**: Built with Tailwind CSS and shadcn/ui.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Map**: React Leaflet
- **Charts**: Recharts
- **AI Integration**: `@google/generative-ai`

## Folder Structure
- `/src/app`: Next.js pages and API Route Handlers (`/api/nowcast`, `/api/summary`)
- `/src/components`: UI components and dashboard widgets (`Map`, `RiskCards`, `AiSummary`)
- `/src/lib`: Core logic, AI integration, mock data generation, and types.

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and add your Gemini API key:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Edit `.env.local` to include your \`GEMINI_API_KEY\`. If you have multiple keys for rotation, set \`GEMINI_API_KEY_1\` through \`6\`.

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is optimized for direct deployment to Vercel (or Netlify).
Since the "backend" is handled entirely by Next.js API Routes (Serverless Functions), there is no separate Node/Express server to deploy.

### Deploying to Vercel:
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click "Add New Project".
3. Import your GitHub repository.
4. Add your Environment Variables (`GEMINI_API_KEY`, etc.).
5. Click **Deploy**.

## How the AI Key Rotation Works
The file `src/lib/ai/gemini-key-rotator.ts` automatically loads all keys defined in the environment. If the primary key fails with a `429 Too Many Requests` or quota error, the `gemini.ts` handler catches the error, calls `rotateKey()`, and attempts the request again using the next available key.

## Future Scope
- Integration with real INSAT-3D satellite imagery APIs.
- Real OpenWeather API integration for ground-truth cross-validation.
- SMS/WhatsApp alert dispatching via Twilio.
