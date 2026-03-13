import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(38, 92%, 50%)", "hsl(210, 80%, 55%)", "hsl(270, 70%, 60%)",
  "hsl(145, 65%, 45%)", "hsl(330, 80%, 60%)", "hsl(25, 95%, 53%)",
  "hsl(174, 72%, 45%)", "hsl(0, 84%, 60%)",
];

export default function VCAnalytics() {
  const { user } = useAuth();
  const [founders, setFounders] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: f }, { data: s }, { data: w }] = await Promise.all([
        supabase.from("founder_profiles").select("id, industry_experience, current_mrr, team_size"),
        supabase.from("omisp_scores").select("founder_id, total_score, idea_viability, founder_aptitude, execution_readiness, behavioral_resilience, progress_velocity, unicorn_potential, is_vc_eligible"),
        user ? supabase.from("vc_watchlist").select("pipeline_stage, created_at").eq("vc_user_id", user.id) : Promise.resolve({ data: [] }),
      ]);
      setFounders(f ?? []);
      setScores(s ?? []);
      setWatchlist(w ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const industryData = useMemo(() => {
    const map: Record<string, number> = {};
    founders.forEach(f => {
      const ind = f.industry_experience || "Unknown";
      map[ind] = (map[ind] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [founders]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 },
    ];
    scores.forEach(s => {
      const score = s.total_score ?? 0;
      const bucket = buckets.find(b => score >= b.min && score <= b.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [scores]);

  const pipelineData = useMemo(() => {
    const stages: Record<string, number> = {
      watching: 0, in_review: 0, intro_requested: 0, meeting_scheduled: 0, passed: 0,
    };
    watchlist.forEach(w => { stages[w.pipeline_stage] = (stages[w.pipeline_stage] || 0) + 1; });
    return Object.entries(stages).map(([name, value]) => ({
      name: name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      value,
    }));
  }, [watchlist]);

  const dimensionAvg = useMemo(() => {
    if (scores.length === 0) return [];
    const dims = ["idea_viability", "founder_aptitude", "execution_readiness", "behavioral_resilience", "progress_velocity", "unicorn_potential"];
    return dims.map(d => ({
      name: d.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      average: Math.round((scores.reduce((sum, s) => sum + (s[d] ?? 0), 0) / scores.length) * 10) / 10,
    }));
  }, [scores]);

  if (loading) {
    return (
      <VCDashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72" />)}
          </div>
        </div>
      </VCDashboardLayout>
    );
  }

  return (
    <VCDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Insights across {founders.length} founders and {watchlist.length} watchlist items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry Breakdown */}
          <Card>
            <CardHeader><CardTitle className="text-base">Industry Breakdown</CardTitle></CardHeader>
            <CardContent>
              {industryData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={industryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader><CardTitle className="text-base">Score Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline Stages */}
          <Card>
            <CardHeader><CardTitle className="text-base">Your Pipeline Stages</CardTitle></CardHeader>
            <CardContent>
              {watchlist.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Add founders to your watchlist first.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pipelineData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(210, 80%, 55%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Dimension Averages */}
          <Card>
            <CardHeader><CardTitle className="text-base">Avg Dimension Scores</CardTitle></CardHeader>
            <CardContent>
              {dimensionAvg.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No scores yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dimensionAvg}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="average" fill="hsl(270, 70%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </VCDashboardLayout>
  );
}
