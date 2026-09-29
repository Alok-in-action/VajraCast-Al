import { NextResponse } from "next/server";
import { generateAiSummary } from "@/lib/ai/gemini";
import { NowcastData } from "@/lib/nowcast/types";

export const maxDuration = 30; // 30 second timeout for AI calls

export async function POST(request: Request) {
  try {
    const body: NowcastData = await request.json();

    if (!body || !body.forecasts || !body.location) {
      return NextResponse.json({ error: "Invalid nowcast data" }, { status: 400 });
    }

    const summary = await generateAiSummary(body);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 });
  }
}
