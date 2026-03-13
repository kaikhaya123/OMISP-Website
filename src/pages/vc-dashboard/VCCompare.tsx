import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface FounderData {
  id: string;
  full_name: string | null;
  company_name: string | null;
  mrr_usd: number;
  team_size: number;
  total_score: number;
  idea_score: number;
  aptitude_score: number;
  execution_score: number;
  resilience_score: number;
  velocity_score: number;
  unicorn_score: number;
}

const DIMS = [
  { key: "idea_score", label: "Idea", max: 20 },
  { key: "aptitude_score", label: "Aptitude", max: 20 },
  { key: "execution_score", label: "Execution", max: 20 },
  { key: "resilience_score", label: "Resilience", max: 20 },
  { key: "velocity_score", label: "Velocity", max: 10 },
  { key: "unicorn_score", label: "Unicorn", max: 10 },
];

const CHART_COLORS = ["hsl(38, 92%, 50%)", "hsl(210, 80%, 55%)", "hsl(270, 70%, 60%)"];

export default function VCCompare() {
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(["", ""]);

  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: profileNames }, { data: scores }] = await Promise.all([
        (supabase.from("founder_profiles") as any).select("founder_id, company_name, mrr_usd, team_size"),
        supabase.from("profiles").select("id, full_name").eq("role", "founder"),
        (supabase.from("omisp_scores") as any).select("founder_id, total_score, idea_score, aptitude_score, execution_score, resilience_score, velocity_score, unicorn_score"),
      ]);
      if (profiles && scores) {
        const scoreMap = new Map((scores as any[]).map((s: any) => [s.founder_id, s]));
        const nameMap = new Map((profileNames ?? []).map((p: any) => [p.id, p.full_name]));
        const merged: FounderData[] = (profiles as any[]).map((p: any) => {
          const s = scoreMap.get(p.founder_id) as any;
          return {
            id: p.founder_id,
            full_name: nameMap.get(p.founder_id) ?? null,
            company_name: p.company_name,
            mrr_usd: p.mrr_usd ?? 0,
            team_size: p.team_size ?? 1,
            total_score: s?.total_score ?? 0,
            idea_score: s?.idea_score ?? 0,
            aptitude_score: s?.aptitude_score ?? 0,
            execution_score: s?.execution_score ?? 0,
            resilience_score: s?.resilience_score ?? 0,
            velocity_score: s?.velocity_score ?? 0,
            unicorn_score: s?.unicorn_score ?? 0,
          };
        }).sort((a, b) => b.total_score - a.total_score);
        setFounders(merged);
      }
      setLoading(false);
    };
    load();
  }, []);

  const selected = useMemo(
    () => selectedIds.map(id => founders.find(f => f.id === id)).filter(Boolean) as FounderData[],
    [selectedIds, founders]
  );

  const radarData = useMemo(() => {
    return DIMS.map(d => {
      const entry: any = { dimension: d.label, fullMark: d.max };
      selected.forEach((f, i) => { entry[`founder${i}`] = (f as any)[d.key] ?? 0; });
      return entry;
    });
  }, [selected]);

  const updateSelection = (index: number, value: string) => {
    setSelectedIds(prev => { const next = [...prev]; next[index] = value; return next; });
  };

  const addSlot = () => { if (selectedIds.length < 3) setSelectedIds(prev => [...prev, ""]); };
  const removeSlot = (index: number) => { if (selectedIds.length > 2) setSelectedIds(prev => prev.filter((_, i) => i !== index)); };

  if (loading) {
    return <VCDashboardLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div></VCDashboardLayout>;
  }

  return (
    <VCDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Founder Comparison</h1>
          <p className="text-sm text-muted-foreground mt-1">Compare up to 3 founders side-by-side across all OMISP dimensions.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          {selectedIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Founder {i + 1}</label>
                <Select value={id} onValueChange={v => updateSelection(i, v)}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select founder..." /></SelectTrigger>
                  <SelectContent>
                    {founders.map(f => (
                      <SelectItem key={f.id} value={f.id} disabled={selectedIds.includes(f.id) && id !== f.id}>
                        {f.full_name || "Anonymous"} ({f.total_score})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedIds.length > 2 && (
                <button onClick={() => removeSlot(i)} className="text-xs text-muted-foreground hover:text-destructive mt-5">✕</button>
              )}
            </div>
          ))}
          {selectedIds.length < 3 && (
            <button onClick={addSlot} className="text-xs text-primary hover:underline mt-5">+ Add founder</button>
          )}
        </div>

        {selected.length >= 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Radar Comparison</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10 }} />
                    {selected.map((f, i) => (
                      <Radar key={f.id} name={f.full_name || `Founder ${i + 1}`} dataKey={`founder${i}`} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Key Metrics</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <div className="grid gap-2 px-4 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase" style={{ gridTemplateColumns: `1fr ${selected.map(() => "1fr").join(" ")}` }}>
                    <div>Metric</div>
                    {selected.map((f, i) => (
                      <div key={f.id} className="text-center" style={{ color: CHART_COLORS[i] }}>{f.full_name || `Founder ${i + 1}`}</div>
                    ))}
                  </div>
                  {[
                    { label: "Total Score", key: "total_score" },
                    ...DIMS.map(d => ({ label: d.label, key: d.key })),
                    { label: "MRR", key: "mrr_usd", format: (v: number) => v ? `$${v.toLocaleString()}` : "—" },
                    { label: "Team Size", key: "team_size" },
                  ].map(row => (
                    <div key={row.label} className="grid gap-2 px-4 py-3 text-sm" style={{ gridTemplateColumns: `1fr ${selected.map(() => "1fr").join(" ")}` }}>
                      <div className="text-muted-foreground">{row.label}</div>
                      {selected.map(f => {
                        const val = (f as any)[row.key];
                        return (
                          <div key={f.id} className="text-center font-medium text-foreground">
                            {(row as any).format ? (row as any).format(val) : (val ?? "—")}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground">Select at least 2 founders above to compare them.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </VCDashboardLayout>
  );
}
