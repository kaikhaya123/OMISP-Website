import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── New schema types ────────────────────────────────────────────────────────

export interface FounderProfile {
  founder_id: string;
  company_name: string | null;
  tagline: string | null;
  industry: string | null;
  stage: string | null;
  location: string | null;
  mrr_usd: number;
  team_size: number;
  raised_usd: number;
  growth_percent: number;
  logo_url: string | null;
}

export interface Milestone {
  id: string;
  type: string;
  value: string | null;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  validated_at?: string | null;
  validated_by?: string | null;
  proof_url?: string | null;
}

export interface OMISPScores {
  ideaViability: number;
  founderAptitude: number;
  executionReadiness: number;
  behavioralResilience: number;
  progressVelocity: number;
  unicornPotential: number;
}

export interface ScoreDetails {
  scores: OMISPScores;
  totalScore: number;
  isVCEligible: boolean;
  isUnicornPotential: boolean;
  scoreBreakdown: {
    ideaViability: string[];
    founderAptitude: string[];
    executionReadiness: string[];
    behavioralResilience: string[];
    progressVelocity: string[];
    unicornPotential: string[];
  };
}

// ── Scoring helpers (pure functions on new schema data) ─────────────────────

function calcIdeaViability(fp: FounderProfile): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  if (fp.mrr_usd >= 10000) { score += 10; breakdown.push(`MRR $${(fp.mrr_usd / 1000).toFixed(0)}K: +10`); }
  else if (fp.mrr_usd > 0) { score += 5; breakdown.push(`MRR $${fp.mrr_usd}: +5`); }

  if (fp.growth_percent >= 20) { score += 6; breakdown.push(`${fp.growth_percent}% growth: +6`); }
  else if (fp.growth_percent >= 5) { score += 3; breakdown.push(`${fp.growth_percent}% growth: +3`); }

  if (fp.stage && ["seed", "series-a", "series a"].includes(fp.stage.toLowerCase())) { score += 4; breakdown.push("Funded stage: +4"); }

  return { score: Math.min(score, 20), breakdown };
}

function calcFounderAptitude(fp: FounderProfile): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  if (fp.raised_usd >= 1000000) { score += 8; breakdown.push(`$${(fp.raised_usd / 1e6).toFixed(1)}M raised: +8`); }
  else if (fp.raised_usd >= 100000) { score += 5; breakdown.push(`$${(fp.raised_usd / 1000).toFixed(0)}K raised: +5`); }
  else if (fp.raised_usd > 0) { score += 2; breakdown.push("Pre-seed funding: +2"); }

  if (fp.company_name) { score += 4; breakdown.push("Company established: +4"); }
  if (fp.tagline) { score += 2; breakdown.push("Clear value prop: +2"); }

  return { score: Math.min(score, 20), breakdown };
}

function calcExecutionReadiness(fp: FounderProfile, milestones: Milestone[]): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  if (fp.team_size >= 10) { score += 8; breakdown.push(`Team of ${fp.team_size}: +8`); }
  else if (fp.team_size >= 5) { score += 5; breakdown.push(`Team of ${fp.team_size}: +5`); }
  else if (fp.team_size >= 2) { score += 2; breakdown.push(`Team of ${fp.team_size}: +2`); }

  const hasFirstCustomer = milestones.some(m => m.type === "first_customer");
  if (hasFirstCustomer) { score += 6; breakdown.push("First customer: +6"); }

  const hasWebsite = milestones.some(m => m.type === "website");
  if (hasWebsite) { score += 3; breakdown.push("Website live: +3"); }

  const hasRegistered = milestones.some(m => m.type === "registered");
  if (hasRegistered) { score += 3; breakdown.push("Company registered: +3"); }

  return { score: Math.min(score, 20), breakdown };
}

function calcBehavioralResilience(fp: FounderProfile, milestones: Milestone[]): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  // Milestones logged indicate persistence
  if (milestones.length >= 4) { score += 8; breakdown.push(`${milestones.length} milestones: +8`); }
  else if (milestones.length >= 2) { score += 5; breakdown.push(`${milestones.length} milestones: +5`); }
  else if (milestones.length >= 1) { score += 2; breakdown.push("1 milestone: +2"); }

  if (fp.location) { score += 4; breakdown.push("Location established: +4"); }
  if (fp.industry) { score += 4; breakdown.push("Industry focus: +4"); }

  return { score: Math.min(score, 20), breakdown };
}

function calcProgressVelocity(milestones: Milestone[]): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  const milestonePoints: Record<string, number> = {
    registered: 1, website: 1, first_customer: 2, revenue: 2, team: 1, funding: 2,
  };

  for (const m of milestones) {
    const pts = milestonePoints[m.type] ?? 1;
    score += pts;
    breakdown.push(`${m.type}: +${pts}`);
  }

  return { score: Math.min(score, 10), breakdown };
}

function calcUnicornPotential(fp: FounderProfile): { score: number; breakdown: string[] } {
  let score = 0;
  const breakdown: string[] = [];

  if (fp.growth_percent >= 20) { score += 3; breakdown.push(`${fp.growth_percent}% MoM: +3`); }
  if (fp.mrr_usd >= 50000) { score += 3; breakdown.push(`$${(fp.mrr_usd / 1000).toFixed(0)}K MRR: +3`); }
  if (fp.team_size >= 10) { score += 2; breakdown.push(`Team ${fp.team_size}: +2`); }
  if (fp.raised_usd >= 1000000) { score += 2; breakdown.push(`$${(fp.raised_usd / 1e6).toFixed(1)}M raised: +2`); }

  return { score: Math.min(score, 10), breakdown };
}

// ── Hook ────────────────────────────────────────────────────────────────────

export const useOMISPScore = () => {
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [scores, setScores] = useState<ScoreDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAndCalculateScores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch founder_profiles (PK = founder_id = user.id)
      let { data: fp, error: fpErr } = await (supabase.from("founder_profiles") as any)
        .select("*")
        .eq("founder_id", user.id)
        .maybeSingle();

      if (fpErr) throw fpErr;

      if (!fp) {
        // Auto-create if missing
        const { data: created, error: createErr } = await (supabase.from("founder_profiles") as any)
          .insert({ founder_id: user.id })
          .select()
          .single();
        if (createErr) throw createErr;
        fp = created;
      }

      setProfile(fp as FounderProfile);

      // Fetch milestones
      const { data: milestones } = await (supabase.from("milestones") as any)
        .select("id, type, value, created_at")
        .eq("founder_id", user.id);

      const ms: Milestone[] = milestones ?? [];

      // Calculate scores
      const ideaRes = calcIdeaViability(fp as FounderProfile);
      const aptRes = calcFounderAptitude(fp as FounderProfile);
      const execRes = calcExecutionReadiness(fp as FounderProfile, ms);
      const resRes = calcBehavioralResilience(fp as FounderProfile, ms);
      const velRes = calcProgressVelocity(ms);
      const uniRes = calcUnicornPotential(fp as FounderProfile);

      const calculatedScores: OMISPScores = {
        ideaViability: Math.round(ideaRes.score * 10) / 10,
        founderAptitude: Math.round(aptRes.score * 10) / 10,
        executionReadiness: Math.round(execRes.score * 10) / 10,
        behavioralResilience: Math.round(resRes.score * 10) / 10,
        progressVelocity: Math.round(velRes.score * 10) / 10,
        unicornPotential: Math.round(uniRes.score * 10) / 10,
      };

      const totalScore = Object.values(calculatedScores).reduce((a, b) => a + b, 0);

      const scoreDetails: ScoreDetails = {
        scores: calculatedScores,
        totalScore: Math.round(totalScore * 10) / 10,
        isVCEligible: totalScore >= 70,
        isUnicornPotential: calculatedScores.unicornPotential >= 8,
        scoreBreakdown: {
          ideaViability: ideaRes.breakdown,
          founderAptitude: aptRes.breakdown,
          executionReadiness: execRes.breakdown,
          behavioralResilience: resRes.breakdown,
          progressVelocity: velRes.breakdown,
          unicornPotential: uniRes.breakdown,
        },
      };

      setScores(scoreDetails);

      // Upsert to omisp_scores (PK = founder_id)
      await (supabase.from("omisp_scores") as any).upsert({
        founder_id: user.id,
        total_score: Math.round(totalScore),
        idea_score: Math.round(calculatedScores.ideaViability),
        aptitude_score: Math.round(calculatedScores.founderAptitude),
        execution_score: Math.round(calculatedScores.executionReadiness),
        resilience_score: Math.round(calculatedScores.behavioralResilience),
        velocity_score: Math.round(calculatedScores.progressVelocity),
        unicorn_score: Math.round(calculatedScores.unicornPotential),
        updated_at: new Date().toISOString(),
      }, { onConflict: "founder_id" });

    } catch (err) {
      console.error("Error calculating OMISP score:", err);
      setError(err instanceof Error ? err.message : "Failed to calculate score");
      toast({ title: "Error", description: "Failed to calculate your OMISP score", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAndCalculateScores();

    const channel = supabase
      .channel("omisp_scores_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "omisp_scores" }, () => {
        fetchAndCalculateScores();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAndCalculateScores]);

  return { profile, scores, loading, error, refreshScores: fetchAndCalculateScores };
};

// ── Score interpretation helper ─────────────────────────────────────────────

export const getScoreInterpretation = (totalScore: number): {
  level: string;
  description: string;
  color: string;
} => {
  if (totalScore >= 85) return { level: "Elite", description: "Elite founder, unicorn potential", color: "text-yellow-500" };
  if (totalScore >= 70) return { level: "Exceptional", description: "Exceptional founder, VC-ready", color: "text-green-500" };
  if (totalScore >= 50) return { level: "Strong", description: "Strong founder, gaining traction", color: "text-primary" };
  if (totalScore >= 30) return { level: "Building", description: "Building momentum", color: "text-orange-500" };
  return { level: "Early", description: "Early stage, needs development", color: "text-muted-foreground" };
};
