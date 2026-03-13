import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatRequest {
  messages: { role: string; content: string }[];
  persona: string;
  personaPrompt: string;
  founderContext?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, persona, personaPrompt, founderContext } = await req.json() as ChatRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const contextBlock = founderContext 
      ? `\n\nHere is the founder's REAL data — reference specific numbers in your responses:\n${founderContext}\n\nIMPORTANT: Always reference the founder's actual metrics (MRR, growth rate, team size, scores, milestones) in your advice. Never give generic advice — tailor everything to their specific situation and numbers.`
      : "";

    const omispKnowledge = `
OMISP Score System Knowledge:
- OMISP Score is 0-100, calculated from 6 dimensions
- Idea Viability (0-20): Based on Revenue Architect model quality, TAM, competitive positioning
- Founder Aptitude (0-20): Based on Omi Chat engagement, learning, coachability, background
- Execution Readiness (0-20): Based on Build-a-Biz game performance, decision speed, team size
- Behavioral Resilience (0-20): Based on Pitch Gauntlet performance under pressure, crisis management
- Progress Velocity (0-10): Based on real-world verified milestones (company registered, first customer, MRR targets)
- Unicorn Potential (0-10): Based on growth rate, MRR, team size, funding raised
- Score ≥70 = VC Eligible (visible to investors on OMISP Capital)
- Unicorn Potential ≥8 = 🦄 Badge
- Each feature in the platform directly impacts specific score dimensions`;

    const systemPrompt = `You are ${persona}, an AI startup advisor with a specific personality and expertise.

${personaPrompt}

${omispKnowledge}
${contextBlock}

Guidelines:
- Stay in character at all times
- Provide actionable, specific advice referencing their actual data
- Ask probing follow-up questions about their specific metrics
- Reference real startup frameworks and methodologies when relevant
- Be conversational but focused
- If discussing metrics, use their actual numbers, not hypotheticals
- Challenge assumptions constructively using their data
- Keep responses concise but valuable (2-4 paragraphs max)
- If asked about OMISP, explain how the scoring system works and what they can do to improve`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Omi Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
