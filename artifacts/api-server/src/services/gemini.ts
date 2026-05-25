// Gemini AI service — generates intelligent deal analysis
// Set GEMINI_API_KEY in your .env to enable

export interface GeminiAnalysis {
  analysis: string;
  strengths: string[];
  concerns: string[];
  recommendation: string;
}

export async function analyzeWithGemini(app: Record<string, unknown>): Promise<GeminiAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      analysis: "Gemini API key not configured. Add GEMINI_API_KEY to your environment.",
      strengths: ["Set GEMINI_API_KEY to enable AI analysis"],
      concerns: ["AI analysis unavailable"],
      recommendation: "Configure GEMINI_API_KEY to unlock intelligent deal insights.",
    };
  }

  const prompt = `You are a venture capital analyst at FSV Capital, a firm focused on DeepTech, Fintech, and Future Innovation.

Analyze this startup funding application and provide a structured investment assessment:

Startup: ${app.startupName}
Sector: ${app.sector}
Stage: ${app.stage}
Funding Ask: $${app.amountRaising} ${app.currency}
Equity Offered: ${app.equityOffered}%

Problem: ${app.problemStatement}
Solution: ${app.solutionOverview}
USP: ${app.usp}

Market:
- TAM: ${app.tam}
- SAM: ${app.sam}
- SOM: ${app.som}

Traction:
- Monthly Revenue: $${app.monthlyRevenue}
- Annual Revenue: $${app.annualRevenue}
- Growth Rate: ${app.growthRate}%
- Customers: ${app.customerCount}

Team Size: ${app.teamSize}
Founder Background: ${app.founderExperience}
Why FSV Capital: ${app.whyFSV}

Deal Score: ${app.dealScore}/100

Provide:
1. A 2-3 sentence overall analysis
2. Top 3 strengths (as a JSON array)
3. Top 2-3 concerns (as a JSON array)
4. A single clear recommendation sentence

Respond in this exact JSON format:
{
  "analysis": "...",
  "strengths": ["...", "...", "..."],
  "concerns": ["...", "..."],
  "recommendation": "..."
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(text) as GeminiAnalysis;

    return {
      analysis: parsed.analysis || "Analysis unavailable.",
      strengths: parsed.strengths || [],
      concerns: parsed.concerns || [],
      recommendation: parsed.recommendation || "No recommendation generated.",
    };
  } catch (err) {
    return {
      analysis: "AI analysis failed. Please try again.",
      strengths: [],
      concerns: ["Analysis service temporarily unavailable"],
      recommendation: "Review application manually.",
    };
  }
}
