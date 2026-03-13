import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";

interface FounderReport {
  id: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  mrr_usd: number;
  team_size: number;
  total_score: number;
  idea_score: number;
  aptitude_score: number;
  execution_score: number;
  resilience_score: number;
  velocity_score: number;
  unicorn_score: number;
  is_vc_eligible: boolean;
}

function generateReport(f: FounderReport) {
  const score = f.total_score;
  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (f.idea_score >= 15) strengths.push("Strong idea viability with clear market fit potential");
  else if (f.idea_score < 10) risks.push("Idea viability needs significant validation");

  if (f.aptitude_score >= 15) strengths.push("Exceptional founder aptitude and leadership indicators");
  else if (f.aptitude_score < 10) risks.push("Founder aptitude below threshold — may need co-founder support");

  if (f.execution_score >= 15) strengths.push("High execution readiness with demonstrated operational capability");
  else if (f.execution_score < 10) risks.push("Execution readiness is low — operational gaps may exist");

  if (f.resilience_score >= 15) strengths.push("Strong behavioral resilience under pressure scenarios");
  else if (f.resilience_score < 10) risks.push("Behavioral resilience may be a concern in crisis situations");

  if (f.velocity_score >= 7) strengths.push("Impressive progress velocity with rapid milestone completion");
  else if (f.velocity_score < 4) risks.push("Progress velocity is slow — may struggle with scaling");

  if (f.unicorn_score >= 7) strengths.push("Notable unicorn potential with scalable model indicators");

  if (f.mrr_usd > 10000) strengths.push(`Revenue traction at $${f.mrr_usd.toLocaleString()} MRR`);
  else if (f.mrr_usd === 0) risks.push("Pre-revenue — no MRR demonstrated yet");

  if (score >= 75) recommendations.push("Strong candidate for investment consideration. Schedule a deep-dive meeting.");
  else if (score >= 50) recommendations.push("Promising founder with growth potential. Monitor progress over next quarter.");
  else recommendations.push("Early-stage founder. Consider for accelerator program or mentorship track.");

  if (risks.length > 2) recommendations.push("Multiple risk factors identified — suggest thorough due diligence.");
  if (f.team_size <= 1) recommendations.push("Solo founder — team building should be a priority discussion topic.");

  return {
    verdict: score >= 75 ? "Strong" : score >= 50 ? "Promising" : "Early Stage",
    verdictColor: score >= 75 ? "bg-feature-green/10 text-feature-green" : score >= 50 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
    strengths: strengths.length > 0 ? strengths : ["Limited data available for strength assessment"],
    risks: risks.length > 0 ? risks : ["No significant risks identified with available data"],
    recommendations,
  };
}

export default function VCReports() {
  const [founders, setFounders] = useState<FounderReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [report, setReport] = useState<ReturnType<typeof generateReport> | null>(null);

  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: profileNames }, { data: scores }] = await Promise.all([
        (supabase.from("founder_profiles") as any).select("founder_id, company_name, industry, mrr_usd, team_size"),
        supabase.from("profiles").select("id, full_name").eq("role", "founder"),
        (supabase.from("omisp_scores") as any).select("founder_id, total_score, idea_score, aptitude_score, execution_score, resilience_score, velocity_score, unicorn_score"),
      ]);
      if (profiles && scores) {
        const scoreMap = new Map((scores as any[]).map((s: any) => [s.founder_id, s]));
        const nameMap = new Map((profileNames ?? []).map((p: any) => [p.id, p.full_name]));
        const merged: FounderReport[] = (profiles as any[]).map((p: any) => {
          const s = scoreMap.get(p.founder_id) as any;
          return {
            id: p.founder_id,
            full_name: nameMap.get(p.founder_id) ?? null,
            company_name: p.company_name,
            industry: p.industry,
            mrr_usd: p.mrr_usd ?? 0,
            team_size: p.team_size ?? 1,
            total_score: s?.total_score ?? 0,
            idea_score: s?.idea_score ?? 0,
            aptitude_score: s?.aptitude_score ?? 0,
            execution_score: s?.execution_score ?? 0,
            resilience_score: s?.resilience_score ?? 0,
            velocity_score: s?.velocity_score ?? 0,
            unicorn_score: s?.unicorn_score ?? 0,
            is_vc_eligible: (s?.total_score ?? 0) >= 70,
          };
        }).sort((a, b) => b.total_score - a.total_score);
        setFounders(merged);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleGenerate = () => {
    const founder = founders.find(f => f.id === selectedId);
    if (founder) setReport(generateReport(founder));
  };

  const selectedFounder = founders.find(f => f.id === selectedId);

  if (loading) {
    return <VCDashboardLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div></VCDashboardLayout>;
  }

  return (
    <VCDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Screening Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate instant assessment reports for any founder.</p>
        </div>

        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Select Founder</label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger><SelectValue placeholder="Choose a founder..." /></SelectTrigger>
                <SelectContent>
                  {founders.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.full_name || "Anonymous"} — {f.company_name || "No company"} ({f.total_score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={!selectedId} className="gap-2">
              <Sparkles className="h-4 w-4" /> Generate Report
            </Button>
          </CardContent>
        </Card>

        {report && selectedFounder && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedFounder.full_name || "Anonymous"}</h2>
                    <p className="text-sm text-muted-foreground">{selectedFounder.company_name || "No company"} · {selectedFounder.industry || "Unknown industry"}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-3xl font-bold text-foreground">{selectedFounder.total_score}</span>
                      <span className="text-sm text-muted-foreground">/100 OMISP Score</span>
                    </div>
                  </div>
                  <Badge className={`${report.verdictColor} border-0 text-sm px-3 py-1`}>{report.verdict}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-feature-green" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-feature-green mt-0.5">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" /> Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.risks.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive mt-0.5">⚠</span> {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span> {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </VCDashboardLayout>
  );
}
