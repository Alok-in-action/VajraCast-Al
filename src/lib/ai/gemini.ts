import { keyRotator } from "./gemini-key-rotator";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiSummaryResponse, NowcastData } from "../nowcast/types";

// Fallback response if Gemini fails completely
const getFallbackSummary = (data: NowcastData): AiSummaryResponse => {
  const latest = data.forecasts[0];
  const isHighRisk = latest.thunderstormProb > 50;
  
  return {
    summary: isHighRisk 
      ? `High probability of thunderstorms (${latest.thunderstormProb}%) detected for ${data.location.name}. Conditions may worsen in the next hour.`
      : `Relatively clear conditions for ${data.location.name} with low thunderstorm probability (${latest.thunderstormProb}%).`,
    warning: isHighRisk ? "Take necessary precautions against lightning and heavy rain." : "No immediate severe weather warning.",
    recommendations: isHighRisk 
      ? ["Seek shelter indoors", "Avoid open fields", "Unplug electronics"]
      : ["Normal activities can continue"],
    imdStyleAlert: isHighRisk ? "YELLOW ALERT: THUNDERSTORM" : "GREEN: NO WARNING"
  };
};

export const generateAiSummary = async (nowcastData: NowcastData): Promise<AiSummaryResponse> => {
  let attempts = 0;
  const maxAttempts = Math.min(keyRotator.getAvailableKeyCount() || 1, 6);

  while (attempts < maxAttempts) {
    const key = keyRotator.getCurrentKey();
    if (!key) {
      console.error("No Gemini API keys available for AI Summary generation.");
      return getFallbackSummary(nowcastData);
    }

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
      You are an expert Indian meteorologist generating a brief, public-friendly thunderstorm nowcast summary.
      Analyze this nowcast data for ${nowcastData.location.name} (Lat: ${nowcastData.location.lat}, Lon: ${nowcastData.location.lon}):
      ${JSON.stringify(nowcastData.forecasts)}
      
      Provide a JSON response with EXACTLY this structure, no markdown formatting outside the JSON:
      {
        "summary": "2-3 sentences explaining the weather trend over the next 2 hours in simple terms",
        "warning": "1 short sentence highlighting any immediate danger (or lack thereof)",
        "recommendations": ["list of 2-3 short safety recommendations"],
        "imdStyleAlert": "Short capitalized alert (e.g. YELLOW ALERT: THUNDERSTORM LIKELY, ORANGE ALERT: SEVERE LIGHTNING, GREEN: NO WARNING)"
      }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(responseText) as AiSummaryResponse;
      return parsed;

    } catch (error: any) {
      console.error(`Gemini API failed on attempt ${attempts + 1}:`, error?.message || error);
      
      // If it's a quota or rate limit error, rotate key
      if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('rate')) {
        keyRotator.rotateKey();
      } else {
        // If it's another error, also rotate just in case, but could be a parsing error
        keyRotator.rotateKey();
      }
      attempts++;
    }
  }

  console.warn("Exhausted all Gemini API keys. Using fallback summary.");
  return getFallbackSummary(nowcastData);
};
