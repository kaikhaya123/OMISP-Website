import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RevenueRequest {
  streams: {
    name: string;
    type: string;
    price: number;
    customersMonth1: number;
    growthRate: number;
    churnRate: number;
  }[];
  expenses: {
    salaries: number;
    marketing: number;
    infrastructure: number;
    other: number;
  };
  industry?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { streams, expenses, industry } = await req.json() as RevenueRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalMRR = streams.reduce((acc, s) => acc + (s.price * s.customersMonth1), 0);
    const totalExpenses = expenses.salaries + expenses.marketing + expenses.infrastructure + expenses.other;
    const avgChurn = streams.reduce((acc, s) => acc + s.churnRate, 0) / streams.length || 5;
    const avgGrowth = streams.reduce((acc, s) => acc + s.growthRate, 0) / streams.length || 10;

    const systemPrompt = `You are a seasoned CFO and startup financial advisor. Analyze this SaaS business model and provide actionable recommendations.

Current Business Model:
- Revenue Streams: ${streams.map(s => `${s.name} (${s.type}, $${s.price}/mo, ${s.customersMonth1} customers)`).join(", ")}
- Total MRR: $${totalMRR}
- Monthly Expenses: $${totalExpenses}
- Average Churn: ${avgChurn}%
- Average Growth: ${avgGrowth}%
${industry ? `- Industry: ${industry}` : ""}

Provide analysis in this JSON format:
{
  "healthScore": <number 0-100>,
  "analysis": {
    "summary": "<2-3 sentence executive summary>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "risks": ["<risk 1>", "<risk 2>"],
    "benchmarks": {
      "churnVsIndustry": "<comparison>",
      "growthVsIndustry": "<comparison>",
      "burnRateAssessment": "<assessment>"
    }
  },
  "recommendations": [
    {
      "title": "<recommendation title>",
      "description": "<detailed recommendation>",
      "impact": "high|medium|low",
      "effort": "high|medium|low"
    }
  ],
  "optimizedProjections": {
    "year1ARR": <number>,
    "year2ARR": <number>,
    "monthsToBreakeven": <number>,
    "suggestedPriceChange": "<suggestion or null>"
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze this business model and provide recommendations." },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Revenue AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
