import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PitchRequest {
  answers: string[];
  questions: string[];
  investorName: string;
  investorStyle: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, questions, investorName, investorStyle } = await req.json() as PitchRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const pitchContent = questions.map((q, i) => `Q: ${q}\nA: ${answers[i] || "(No answer provided)"}`).join("\n\n");

    const systemPrompt = `You are ${investorName}, a venture capital investor. ${investorStyle}

You just listened to a founder's pitch. Analyze their responses and provide detailed feedback.

Return a JSON object with this exact structure:
{
  "scores": {
    "clarity": <number 0-100>,
    "conviction": <number 0-100>,
    "storytelling": <number 0-100>,
    "metrics": <number 0-100>,
    "responsiveness": <number 0-100>
  },
  "overallScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "investorFeedback": "<2-3 sentences of personalized feedback in your investor persona voice>",
  "followUpQuestions": ["<question 1>", "<question 2>"]
}

Base your scoring on:
- Clarity: How well-structured and understandable were the answers?
- Conviction: Did the founder show confidence and passion?
- Storytelling: Was there a compelling narrative?
- Metrics: Did they use specific numbers and data?
- Responsiveness: Did they answer the actual questions asked?`;

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
          { role: "user", content: `Here is the pitch:\n\n${pitchContent}` },
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const feedback = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pitch feedback error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
