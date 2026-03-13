import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronDown, ChevronUp, Filter, Star, Bookmark } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FounderRow {
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

type SortKey = "total_score" | "idea_score" | "aptitude_score" | "execution_score" | "resilience_score" | "velocity_score" | "unicorn_score";

const DIMENSIONS: { key: SortKey; label: string; max: number }[] = [
  { key: "idea_score", label: "Idea Viability", max: 20 },
  { key: "aptitude_score", label: "Founder Aptitude", max: 20 },
  { key: "execution_score", label: "Execution Readiness", max: 20 },
  { key: "resilience_score", label: "Behavioral Resilience", max: 20 },
  { key: "velocity_score", label: "Progress Velocity", max: 10 },
  { key: "unicorn_score", label: "Unicorn Potential", max: 10 },
];

export default function VCLeaderboard() {
  const [founders, setFounders] = useState<FounderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("total_score");
  const [sortAsc, setSortAsc] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [industryFilter, setIndustryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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
        const merged: FounderRow[] = (profiles as any[]).map((p: any) => {
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
        });
        setFounders(merged);
      }
      setLoading(false);
    };
    load();
  }, []);

  const industries = useMemo(() => {
    const set = new Set(founders.map(f => f.industry).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [founders]);

  const filtered = useMemo(() => {
    let result = founders.filter(f => f.total_score >= minScore);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        (f.full_name?.toLowerCase().includes(q)) || (f.company_name?.toLowerCase().includes(q))
      );
    }
    if (industryFilter !== "all") result = result.filter(f => f.industry === industryFilter);
    result.sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortAsc ? av - bv : bv - av;
    });
    return result;
  }, [founders, search, sortKey, sortAsc, minScore, industryFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const addToWatchlist = async (founderId: string) => {
    if (!user) return;
    const { error } = await supabase.from("vc_watchlist").insert({ vc_user_id: user.id, founder_id: founderId, pipeline_stage: "watching" });
    if (error) {
      if (error.code === "23505") toast({ title: "Already on watchlist" });
      else toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added to watchlist" });
    }
  };

  return (
    <VCDashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Founder Leaderboard</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} founders ranked by OMISP Score</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or company..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Score: {minScore}</label>
                  <Slider value={[minScore]} onValueChange={v => setMinScore(v[0])} max={100} step={5} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Industry</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort by</label>
                  <Select value={sortKey} onValueChange={v => setSortKey(v as SortKey)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total_score">Total Score</SelectItem>
                      {DIMENSIONS.map(d => <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No founders match your filters.</p>
            ) : (
              <div className="divide-y divide-border">
                <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Founder</div>
                  <div className="col-span-2 cursor-pointer flex items-center gap-1" onClick={() => handleSort("total_score")}>
                    Score {sortKey === "total_score" && (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </div>
                  <div className="col-span-2">Industry</div>
                  <div className="col-span-1">MRR</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {filtered.map((f, i) => (
                  <div key={f.id}>
                    <div
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
                    >
                      <div className="col-span-1 text-sm font-medium text-muted-foreground">{i + 1}</div>
                      <div className="col-span-4">
                        <p className="font-medium text-sm text-foreground">{f.full_name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{f.company_name || "—"}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{f.total_score}</span>
                        {f.is_vc_eligible && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
                      </div>
                      <div className="col-span-2 text-xs text-muted-foreground">{f.industry || "—"}</div>
                      <div className="col-span-1 text-xs text-muted-foreground">
                        {f.mrr_usd ? `$${Number(f.mrr_usd).toLocaleString()}` : "—"}
                      </div>
                      <div className="col-span-2 flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); addToWatchlist(f.id); }}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedId === f.id && (
                      <div className="px-4 pb-4 bg-muted/20">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                          {DIMENSIONS.map(d => (
                            <div key={d.key} className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">{d.label}</p>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${((f[d.key] as number ?? 0) / d.max) * 100}%` }} />
                              </div>
                              <p className="text-xs font-bold text-foreground mt-1">{f[d.key] ?? 0}/{d.max}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
