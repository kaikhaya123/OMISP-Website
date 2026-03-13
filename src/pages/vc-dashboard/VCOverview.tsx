import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Star, Eye } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

interface FounderWithScore {
  id: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  total_score: number;
  is_vc_eligible: boolean;
}

export default function VCOverview() {
  const [stats, setStats] = useState({ totalFounders: 0, vcEligible: 0, avgScore: 0, topScore: 0 });
  const [topFounders, setTopFounders] = useState<FounderWithScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: profiles }, { data: profileNames }, { data: scores }] = await Promise.all([
        (supabase.from("founder_profiles") as any).select("founder_id, company_name, industry"),
        supabase.from("profiles").select("id, full_name").eq("role", "founder"),
        (supabase.from("omisp_scores") as any).select("founder_id, total_score").order("total_score", { ascending: false }),
      ]);

      if (profiles && scores) {
        const scoreMap = new Map((scores as any[]).map((s: any) => [s.founder_id, s.total_score ?? 0]));
        const nameMap = new Map((profileNames ?? []).map((p: any) => [p.id, p.full_name]));
        const merged: FounderWithScore[] = (profiles as any[]).map((f: any) => ({
          id: f.founder_id,
          full_name: nameMap.get(f.founder_id) ?? null,
          company_name: f.company_name,
          industry: f.industry,
          total_score: scoreMap.get(f.founder_id) ?? 0,
          is_vc_eligible: (scoreMap.get(f.founder_id) ?? 0) >= 70,
        }));

        merged.sort((a, b) => b.total_score - a.total_score);

        const totalFounders = merged.length;
        const vcEligible = merged.filter(f => f.is_vc_eligible).length;
        const avgScore = totalFounders > 0
          ? Math.round(merged.reduce((sum, f) => sum + f.total_score, 0) / totalFounders)
          : 0;
        const topScore = merged[0]?.total_score ?? 0;

        setStats({ totalFounders, vcEligible, avgScore, topScore });
        setTopFounders(merged.slice(0, 5));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Total Founders", value: stats.totalFounders, icon: Users, color: "text-feature-blue" },
    { label: "VC Eligible", value: stats.vcEligible, icon: Star, color: "text-primary" },
    { label: "Avg Score", value: stats.avgScore, icon: TrendingUp, color: "text-feature-green" },
    { label: "Top Score", value: stats.topScore, icon: Eye, color: "text-feature-purple" },
  ];

  return (
    <VCDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deal Flow Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time founder intelligence at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Scoring Founders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : topFounders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No founders have been scored yet.</p>
            ) : (
              <div className="space-y-2">
                {topFounders.map((founder, i) => (
                  <div key={founder.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{founder.full_name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{founder.company_name || "No company"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {founder.is_vc_eligible && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">VC Eligible</Badge>
                      )}
                      <span className="text-sm font-bold text-foreground min-w-[40px] text-right">{founder.total_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VCDashboardLayout>
  );
}
