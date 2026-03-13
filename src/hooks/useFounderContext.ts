import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FounderContext {
  profile: {
    full_name: string | null;
    company_name: string | null;
    mrr_usd: number;
    growth_percent: number;
    team_size: number;
    raised_usd: number;
    industry: string | null;
  } | null;
  scores: {
    ideaViability: number;
    founderAptitude: number;
    executionReadiness: number;
    behavioralResilience: number;
    progressVelocity: number;
    unicornPotential: number;
    totalScore: number;
    isVCEligible: boolean;
  } | null;
  milestones: { type: string; created_at: string }[];
  recentPitchScores: never[];
  recentGameScores: never[];
  revenueModels: never[];
}

export function useFounderContext() {
  const [context, setContext] = useState<FounderContext | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch from new schema: founder_profiles uses founder_id PK = user.id
      const { data: fp } = await (supabase.from("founder_profiles") as any)
        .select("*")
        .eq("founder_id", user.id)
        .maybeSingle();

      if (!fp) {
        setContext(null);
        setLoading(false);
        return;
      }

      const [
        { data: scores },
        { data: milestones },
      ] = await Promise.all([
        (supabase.from("omisp_scores") as any).select("*").eq("founder_id", user.id).maybeSingle(),
        (supabase.from("milestones") as any)
          .select("type, created_at")
          .eq("founder_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setContext({
        profile: {
          full_name: null, // pulled from profiles table if needed
          company_name: fp.company_name ?? null,
          mrr_usd: fp.mrr_usd ?? 0,
          growth_percent: fp.growth_percent ?? 0,
          team_size: fp.team_size ?? 1,
          raised_usd: fp.raised_usd ?? 0,
          industry: fp.industry ?? null,
        },
        scores: scores ? {
          ideaViability: scores.idea_score ?? 0,
          founderAptitude: scores.aptitude_score ?? 0,
          executionReadiness: scores.execution_score ?? 0,
          behavioralResilience: scores.resilience_score ?? 0,
          progressVelocity: scores.velocity_score ?? 0,
          unicornPotential: scores.unicorn_score ?? 0,
          totalScore: scores.total_score ?? 0,
          isVCEligible: (scores.total_score ?? 0) >= 70,
        } : null,
        milestones: milestones ?? [],
        recentPitchScores: [],
        recentGameScores: [],
        revenueModels: [],
      });
    } catch (err) {
      console.error("Error fetching founder context:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  return { context, loading, refresh: fetchContext };
}

export function buildContextSummary(ctx: FounderContext): string {
  const lines: string[] = [];

  if (ctx.profile) {
    const p = ctx.profile;
    lines.push("=== FOUNDER PROFILE ===");
    if (p.full_name) lines.push(`Name: ${p.full_name}`);
    if (p.company_name) lines.push(`Company: ${p.company_name}`);
    lines.push(`Current MRR: $${p.mrr_usd.toLocaleString()}`);
    lines.push(`Monthly Growth Rate: ${p.growth_percent}%`);
    lines.push(`Team Size: ${p.team_size}`);
    lines.push(`Total Funding Raised: $${p.raised_usd.toLocaleString()}`);
    if (p.industry) lines.push(`Industry: ${p.industry}`);
  }

  if (ctx.scores) {
    const s = ctx.scores;
    lines.push("\n=== OMISP SCORE ===");
    lines.push(`Total Score: ${s.totalScore}/100 ${s.isVCEligible ? '(VC Eligible ✅)' : `(Need ${70 - s.totalScore} more for VC eligibility)`}`);
    lines.push(`Idea Viability: ${s.ideaViability}/20`);
    lines.push(`Founder Aptitude: ${s.founderAptitude}/20`);
    lines.push(`Execution Readiness: ${s.executionReadiness}/20`);
    lines.push(`Behavioral Resilience: ${s.behavioralResilience}/20`);
    lines.push(`Progress Velocity: ${s.progressVelocity}/10`);
    lines.push(`Unicorn Potential: ${s.unicornPotential}/10`);
  }

  if (ctx.milestones.length > 0) {
    lines.push("\n=== RECENT MILESTONES ===");
    ctx.milestones.forEach(m => {
      lines.push(`- ${m.type.replace(/_/g, ' ')} (${m.created_at})`);
    });
  }

  return lines.join("\n");
}
