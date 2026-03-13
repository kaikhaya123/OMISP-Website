import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IdeaRequest {
  title: string;
  content: string;
  type: "idea" | "feedback" | "discussion";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, type } = await req.json() as IdeaRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "idea") {
      systemPrompt = `You are a startup advisor evaluating a business idea. Provide constructive feedback in this JSON format:
{
  "score": <number 0-100>,
  "viabilityRating": "High|Medium|Low",
  "feedback": {
    "strengths": ["<strength 1>", "<strength 2>"],
    "concerns": ["<concern 1>", "<concern 2>"],
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "marketInsights": "<2 sentences about market opportunity>",
  "nextSteps": ["<step 1>", "<step 2>", "<step 3>"]
}`;
    } else {
      systemPrompt = `You are a helpful community member providing feedback. Be constructive and supportive. Return a JSON response:
{
  "feedback": "<2-3 sentences of helpful feedback>",
  "questions": ["<clarifying question 1>", "<clarifying question 2>"],
  "resources": ["<relevant resource or tip 1>", "<relevant resource or tip 2>"]
}`;
    }

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
          { role: "user", content: `Title: ${title}\n\n${content}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("AI service error");
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Idea feedback error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
