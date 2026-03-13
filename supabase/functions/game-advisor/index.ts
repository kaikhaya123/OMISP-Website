import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GameRequest {
  scenario: {
    title: string;
    description: string;
    options: { text: string }[];
  };
  gameState: {
    cash: number;
    mrr: number;
    customers: number;
    morale: number;
    month: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario, gameState } = await req.json() as GameRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a wise startup mentor helping a founder navigate a decision in their startup journey.

Current situation:
- Month: ${gameState.month}
- Cash: $${gameState.cash}
- MRR: $${gameState.mrr}
- Customers: ${gameState.customers}
- Team Morale: ${gameState.morale}%

The founder faces this scenario: "${scenario.title}"
${scenario.description}

Options available:
${scenario.options.map((o, i) => `${i + 1}. ${o.text}`).join("\n")}

Provide strategic advice in this JSON format:
{
  "analysis": "<2-3 sentences analyzing the situation given their current metrics>",
  "optionInsights": [
    {
      "option": 1,
      "pros": ["<pro 1>", "<pro 2>"],
      "cons": ["<con 1>", "<con 2>"],
      "riskLevel": "low|medium|high"
    }
  ],
  "recommendation": <number 1-3 of recommended option>,
  "reasoning": "<Why this option given their current state>",
  "realWorldExample": "<Brief real startup example of similar decision>"
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
          { role: "user", content: "What should I do?" },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("AI service error");
    }

    const data = await response.json();
    const advice = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(advice), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Game advisor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
