import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Star,
  Bookmark,
  Crown,
  Lock,
  TrendingUp,
  Users,
  DollarSign,
  X,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface FounderRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  industry_experience: string | null;
  current_mrr: number | null;
  team_size: number | null;
  total_funding_raised: number | null;
  monthly_growth_rate: number | null;
  total_score: number | null;
  idea_viability: number | null;
  founder_aptitude: number | null;
  execution_readiness: number | null;
  behavioral_resilience: number | null;
  progress_velocity: number | null;
  unicorn_potential: number | null;
  is_vc_eligible: boolean | null;
  is_unicorn_potential: boolean | null;
}

type SortKey = "total_score" | "current_mrr" | "team_size" | "unicorn_potential" | "monthly_growth_rate";

const UNICORN_THRESHOLDS = {
  score: 70,
  team: 10,
  mrr: 50000,
};

function isUnicornCandidate(f: FounderRow): boolean {
  return (
    (f.total_score ?? 0) >= UNICORN_THRESHOLDS.score &&
    (f.team_size ?? 0) >= UNICORN_THRESHOLDS.team &&
    (f.current_mrr ?? 0) >= UNICORN_THRESHOLDS.mrr
  );
}

function scoreColor(score: number) {
  if (score >= 80) return "text-yellow-500";
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-primary";
  return "text-muted-foreground";
}

const FREE_VIEW_LIMIT = 3;

const DIMENSIONS = [
  { key: "idea_viability" as const, label: "Idea Viability", max: 20 },
  { key: "founder_aptitude" as const, label: "Founder Aptitude", max: 20 },
  { key: "execution_readiness" as const, label: "Execution Readiness", max: 20 },
  { key: "behavioral_resilience" as const, label: "Behavioral Resilience", max: 20 },
  { key: "progress_velocity" as const, label: "Progress Velocity", max: 10 },
  { key: "unicorn_potential" as const, label: "Unicorn Potential", max: 10 },
];

export default function InvestorFounderList() {
  const [founders, setFounders] = useState<FounderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("total_score");
  const [sortAsc, setSortAsc] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [industryFilter, setIndustryFilter] = useState("all");
  const [vcEligibleOnly, setVcEligibleOnly] = useState(false);
  const [unicornOnly, setUnicornOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch founders + existing view count
  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: scores }, { data: views }] = await Promise.all([
        (supabase.from("founder_profiles") as any).select("founder_id, company_name, industry, mrr_usd, team_size, raised_usd, growth_percent"),
        (supabase.from("omisp_scores") as any).select("founder_id, total_score, idea_score, aptitude_score, execution_score, resilience_score, velocity_score, unicorn_score"),
        user ? (supabase.from("investor_views") as any).select("founder_id").eq("investor_id", user.id) : Promise.resolve({ data: [] }),
      ]);

      if (profiles && scores) {
        const scoreMap = new Map((scores as any[]).map((s: any) => [s.founder_id, s]));
        const merged: FounderRow[] = (profiles as any[]).map((p: any) => {
          const s = scoreMap.get(p.founder_id) as any;
          return {
            id: p.founder_id,
            full_name: null,
            company_name: p.company_name,
            industry_experience: p.industry,
            current_mrr: p.mrr_usd,
            team_size: p.team_size,
            total_funding_raised: p.raised_usd,
            monthly_growth_rate: p.growth_percent,
            total_score: s?.total_score ?? 0,
            idea_viability: s?.idea_score ?? 0,
            founder_aptitude: s?.aptitude_score ?? 0,
            execution_readiness: s?.execution_score ?? 0,
            behavioral_resilience: s?.resilience_score ?? 0,
            progress_velocity: s?.velocity_score ?? 0,
            unicorn_potential: s?.unicorn_score ?? 0,
            is_vc_eligible: (s?.total_score ?? 0) >= 70,
            is_unicorn_potential: (s?.unicorn_score ?? 0) >= 8,
          };
        });
        setFounders(merged);
      }

      if (views && views.length > 0) {
        setViewedIds(new Set(views.map(v => v.founder_id)));
        setViewCount(views.length);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const industries = useMemo(() => {
    const set = new Set(founders.map(f => f.industry_experience).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [founders]);

  const filtered = useMemo(() => {
    let result = founders.filter(f => (f.total_score ?? 0) >= minScore);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f => f.full_name?.toLowerCase().includes(q) || f.company_name?.toLowerCase().includes(q));
    }
    if (industryFilter !== "all") result = result.filter(f => f.industry_experience === industryFilter);
    if (vcEligibleOnly) result = result.filter(f => f.is_vc_eligible);
    if (unicornOnly) result = result.filter(f => isUnicornCandidate(f));
    result.sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortAsc ? av - bv : bv - av;
    });
    return result;
  }, [founders, search, sortKey, sortAsc, minScore, industryFilter, vcEligibleOnly, unicornOnly]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  // Track a view — enforce free limit
  const trackView = useCallback(async (founderId: string) => {
    if (!user) return;
    const alreadyViewed = viewedIds.has(founderId);

    if (!alreadyViewed) {
      const newCount = viewCount + 1;
      if (newCount > FREE_VIEW_LIMIT) {
        setShowUpgradeModal(true);
        return;
      }
      // Upsert view record
      await (supabase.from("investor_views") as any).upsert({ investor_id: user.id, founder_id: founderId }, { onConflict: "investor_id,founder_id" });
      setViewedIds(prev => new Set([...prev, founderId]));
      setViewCount(newCount);

      if (newCount === FREE_VIEW_LIMIT) {
        toast({ title: "Free view limit reached", description: "Upgrade to Pro to unlock unlimited founder profiles." });
      }
    }
    setExpandedId(prev => prev === founderId ? null : founderId);
  }, [user, viewedIds, viewCount, toast]);

  const addToWatchlist = async (founderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const { error } = await supabase.from("vc_watchlist").insert({ vc_user_id: user.id, founder_id: founderId, pipeline_stage: "watching" });
    if (error) {
      if (error.code === "23505") toast({ title: "Already on watchlist" });
      else toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Added to watchlist" });
    }
  };

  const isLocked = (founderId: string) => !viewedIds.has(founderId) && viewCount >= FREE_VIEW_LIMIT;

  return (
    <VCDashboardLayout>
      {/* Upgrade modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" /> Upgrade to Pro
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <p className="text-muted-foreground text-sm">
              You've used your <strong>3 free profile views</strong>. Upgrade to unlock unlimited founder discovery, advanced filters, and AI screening reports.
            </p>
            <ul className="space-y-2 text-sm">
              {["Unlimited founder profile views", "Advanced filters (MRR, growth rate, team size)", "AI-generated screening reports", "Side-by-side founder comparison", "Pipeline stage management"].map(f => (
                <li key={f} className="flex items-center gap-2 text-foreground">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link to="/capital/pricing" className="flex-1">
                <Button className="w-full gap-2">
                  Upgrade Now <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Founder Discovery</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} founders · {FREE_VIEW_LIMIT - Math.min(viewCount, FREE_VIEW_LIMIT)} free views remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            {viewCount >= FREE_VIEW_LIMIT && (
              <Badge variant="outline" className="border-primary/40 text-primary text-xs gap-1">
                <Lock className="w-3 h-3" /> Upgrade for unlimited
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* View usage bar */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((viewCount / FREE_VIEW_LIMIT) * 100, 100)}%` }}
            />
          </div>
          <span>{Math.min(viewCount, FREE_VIEW_LIMIT)}/{FREE_VIEW_LIMIT} views used</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search founder or company…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filters panel */}
        {showFilters && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Free filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Min Score: {minScore}</label>
                  <Slider value={[minScore]} onValueChange={v => setMinScore(v[0])} max={100} step={5} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Industry</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Locked premium filters */}
                <div className="relative">
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    Min MRR <Lock className="w-3 h-3 text-muted-foreground/50" />
                  </label>
                  <div className="relative">
                    <Select disabled>
                      <SelectTrigger className="opacity-50 cursor-not-allowed"><SelectValue placeholder="Pro only" /></SelectTrigger>
                    </Select>
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
                        <Lock className="w-3 h-3" /> Pro
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    Growth Rate <Lock className="w-3 h-3 text-muted-foreground/50" />
                  </label>
                  <div className="relative">
                    <Select disabled>
                      <SelectTrigger className="opacity-50 cursor-not-allowed"><SelectValue placeholder="Pro only" /></SelectTrigger>
                    </Select>
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
                        <Lock className="w-3 h-3" /> Pro
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setVcEligibleOnly(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    vcEligibleOnly
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Star className="w-3 h-3" /> VC Eligible only
                </button>
                <button
                  onClick={() => setUnicornOnly(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    unicornOnly
                      ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-600"
                      : "border-border text-muted-foreground hover:border-yellow-500/30"
                  }`}
                >
                  🦄 Unicorn candidates only
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sort bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Sort:</span>
          {(["total_score", "current_mrr", "team_size", "unicorn_potential", "monthly_growth_rate"] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`flex items-center gap-0.5 px-2 py-1 rounded border transition-colors ${
                sortKey === key ? "border-primary/40 bg-primary/10 text-primary" : "border-transparent hover:border-border"
              }`}
            >
              {{ total_score: "Score", current_mrr: "MRR", team_size: "Team", unicorn_potential: "Unicorn", monthly_growth_rate: "Growth" }[key]}
              {sortKey === key && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          ))}
        </div>

        {/* Founder cards */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No founders match your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((f, i) => {
              const unicorn = isUnicornCandidate(f);
              const locked = isLocked(f.id);
              const expanded = expandedId === f.id;

              return (
                <div
                  key={f.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    unicorn ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-card" : "border-border bg-card"
                  } ${locked ? "opacity-70" : ""}`}
                >
                  <div
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => trackView(f.id)}
                  >
                    {/* Rank */}
                    <span className="text-xs font-medium text-muted-foreground w-5 shrink-0">{i + 1}</span>

                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      unicorn ? "bg-yellow-500/20 text-yellow-600" : "bg-primary/10 text-primary"
                    }`}>
                      {(f.full_name?.[0] ?? f.company_name?.[0] ?? "?").toUpperCase()}
                    </div>

                    {/* Name + company */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm text-foreground truncate">
                          {locked ? "••••• •••••" : (f.full_name || "Anonymous")}
                        </p>
                        {unicorn && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium border border-yellow-500/20">
                            <Sparkles className="w-3 h-3" /> Unicorn
                          </span>
                        )}
                        {f.is_vc_eligible && !unicorn && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            <Star className="w-3 h-3 fill-primary" /> VC Eligible
                          </span>
                        )}
                        {locked && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border">
                            <Lock className="w-3 h-3" /> Upgrade to view
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {locked ? "••••••••" : (f.company_name || "—")}
                        {f.industry_experience && !locked && ` · ${f.industry_experience}`}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      {f.current_mrr != null && f.current_mrr > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">MRR</p>
                          <p className="text-xs font-semibold text-foreground">${(f.current_mrr / 1000).toFixed(0)}K</p>
                        </div>
                      )}
                      {f.team_size != null && f.team_size > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Team</p>
                          <p className="text-xs font-semibold text-foreground">{f.team_size}</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className={`text-sm font-bold ${scoreColor(f.total_score ?? 0)}`}>{f.total_score ?? 0}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!locked && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => addToWatchlist(f.id, e)}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      )}
                      {locked ? (
                        <Button size="sm" variant="outline" className="text-xs gap-1 h-8" onClick={(e) => { e.stopPropagation(); setShowUpgradeModal(true); }}>
                          <Lock className="w-3 h-3" /> Unlock
                        </Button>
                      ) : (
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </div>

                  {/* Expanded score breakdown */}
                  {expanded && !locked && (
                    <div className="px-4 pb-4 border-t border-border/50 bg-muted/20">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
                        {DIMENSIONS.map(d => {
                          const val = (f[d.key] as number) ?? 0;
                          const pct = (val / d.max) * 100;
                          return (
                            <div key={d.key} className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">{d.label}</p>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <p className="text-xs font-bold text-foreground">{val}/{d.max}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" variant="outline" className="text-xs gap-1" onClick={(e) => addToWatchlist(f.id, e)}>
                          <Bookmark className="w-3 h-3" /> Add to Watchlist
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upgrade CTA at bottom */}
        {viewCount >= FREE_VIEW_LIMIT && (
          <div className="p-5 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Upgrade to Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">Unlock unlimited founder profiles, advanced filters, AI reports, and pipeline management.</p>
            </div>
            <Link to="/capital/pricing">
              <Button className="gap-2 whitespace-nowrap">
                View Plans <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </VCDashboardLayout>
  );
}
