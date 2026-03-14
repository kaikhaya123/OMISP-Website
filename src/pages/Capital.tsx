import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import Top10FoundersPopup from "@/components/capital/Top10FoundersPopup";
import LeaderboardSection from "@/components/capital/LeaderboardSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Building2,
  Heart,
  Mail,
  Eye,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Sparkles,
  Trophy,
  Crown,
  Bell,
  Filter,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FounderRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string | null;
  industry_experience: string | null;
  current_mrr: number | null;
  team_size: number | null;
  total_funding_raised: number | null;
  monthly_growth_rate: number | null;
  years_experience: number | null;
  avatar_url: string | null;
  // from omisp_scores
  total_score: number;
  idea_viability: number | null;
  founder_aptitude: number | null;
  execution_readiness: number | null;
  behavioral_resilience: number | null;
  progress_velocity: number | null;
  unicorn_potential: number | null;
  is_vc_eligible: boolean;
}

function isUnicorn(f: FounderRow): boolean {
  return (f.total_score ?? 0) >= 60 && (f.team_size ?? 0) >= 3 && (f.current_mrr ?? 0) > 0;
}

function fmtMrr(v: number | null) {
  if (!v) return "$0";
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function fmtFunding(v: number | null) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function scoreColor(s: number) {
  if (s >= 80) return "text-accent";
  if (s >= 60) return "text-green-500";
  if (s >= 40) return "text-primary";
  return "text-muted-foreground";
}

const AVATAR_FALLBACK = "https://api.dicebear.com/7.x/initials/svg?seed=";

const FREE_VIEW_LIMIT = 3;

const CapitalPage = () => {
  const [founders, setFounders] = useState<FounderRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [minMrr, setMinMrr] = useState(0); // 0 = any (free filter)
  const [showFilters, setShowFilters] = useState(false);
  const [unicornOnly, setUnicornOnly] = useState(false);
  const [vcEligibleOnly, setVcEligibleOnly] = useState(false);

  // Watchlist (local + DB)
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());

  // View tracking
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [viewCount, setViewCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Top10 popup
  const [showTop10, setShowTop10] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: scores }, viewsResult, watchlistResult] = await Promise.all([
        (supabase.from("founder_profiles") as any).select(
          "founder_id, company_name, industry, mrr_usd, team_size, raised_usd, growth_percent, logo_url, stage"
        ),
        (supabase.from("omisp_scores") as any).select(
          "founder_id, total_score, idea_score, aptitude_score, execution_score, resilience_score, velocity_score, unicorn_score"
        ),
        user
          ? (supabase.from("investor_views") as any).select("founder_id").eq("investor_id", user.id)
          : Promise.resolve({ data: [] as { founder_id: string }[] }),
        user
          ? supabase.from("vc_watchlist").select("founder_id").eq("vc_user_id", user.id)
          : Promise.resolve({ data: [] as { founder_id: string }[] }),
      ]);

      if (profiles && scores) {
        const scoreMap = new Map((scores ?? []).map((s: any) => [s.founder_id, s]));
        const merged: FounderRow[] = (profiles ?? []).map((p: any) => {
          const s = scoreMap.get(p.founder_id) as any;
          return {
            id: p.founder_id,
            full_name: null,
            company_name: p.company_name,
            email: null,
            industry_experience: p.industry,
            current_mrr: p.mrr_usd,
            team_size: p.team_size,
            total_funding_raised: p.raised_usd,
            monthly_growth_rate: p.growth_percent,
            years_experience: null,
            avatar_url: p.logo_url,
            total_score: s?.total_score ?? 0,
            idea_viability: s?.idea_score ?? 0,
            founder_aptitude: s?.aptitude_score ?? 0,
            execution_readiness: s?.execution_score ?? 0,
            behavioral_resilience: s?.resilience_score ?? 0,
            progress_velocity: s?.velocity_score ?? 0,
            unicorn_potential: s?.unicorn_score ?? 0,
            is_vc_eligible: (s?.total_score ?? 0) >= 70,
          };
        });
        // Sort: unicorns first, then by score
        merged.sort((a, b) => {
          if (isUnicorn(b) !== isUnicorn(a)) return isUnicorn(b) ? 1 : -1;
          return b.total_score - a.total_score;
        });
        setFounders(merged);
      }

      const views = viewsResult.data ?? [];
      setViewedIds(new Set(views.map(v => v.founder_id)));
      setViewCount(views.length);

      const wl = watchlistResult.data ?? [];
      setWatchlistIds(new Set(wl.map(w => w.founder_id)));

      setLoading(false);
    };
    load();
  }, [user]);

  // Show top10 popup on first visit
  useEffect(() => {
    if (!sessionStorage.getItem("seenTop10Capital")) {
      const t = setTimeout(() => {
        setShowTop10(true);
        sessionStorage.setItem("seenTop10Capital", "1");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Industries from data ───────────────────────────────────────────────────
  const industries = useMemo(() => {
    const set = new Set(founders.map(f => f.industry_experience).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [founders]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...founders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        f => f.full_name?.toLowerCase().includes(q) || f.company_name?.toLowerCase().includes(q)
      );
    }
    if (industryFilter !== "all") result = result.filter(f => f.industry_experience === industryFilter);
    result = result.filter(f => f.total_score >= minScore && f.total_score <= maxScore);
    if (minMrr > 0) result = result.filter(f => (f.current_mrr ?? 0) >= minMrr);
    if (unicornOnly) result = result.filter(isUnicorn);
    if (vcEligibleOnly) result = result.filter(f => f.is_vc_eligible);
    return result;
  }, [founders, search, industryFilter, minScore, maxScore, minMrr, unicornOnly, vcEligibleOnly]);

  // ── View tracking ──────────────────────────────────────────────────────────
  const handleView = async (founderId: string) => {
    if (!viewedIds.has(founderId)) {
      if (viewCount >= FREE_VIEW_LIMIT) {
        setShowUpgradeModal(true);
        return;
      }
      await (supabase.from("investor_views") as any).insert(
        { investor_id: user!.id, founder_id: founderId }
      );
      const newSet = new Set([...viewedIds, founderId]);
      setViewedIds(newSet);
      const newCount = viewCount + 1;
      setViewCount(newCount);
      if (newCount === FREE_VIEW_LIMIT) {
        toast({ title: "Free view limit reached", description: "Upgrade to unlock unlimited profiles." });
      }
    }
    setExpandedId(prev => prev === founderId ? null : founderId);
  };

  const isLocked = (id: string) => !viewedIds.has(id) && viewCount >= FREE_VIEW_LIMIT;

  // ── Watchlist ──────────────────────────────────────────────────────────────
  const toggleWatchlist = async (founderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (watchlistIds.has(founderId)) {
      await supabase.from("vc_watchlist").delete().eq("vc_user_id", user.id).eq("founder_id", founderId);
      setWatchlistIds(prev => { const n = new Set(prev); n.delete(founderId); return n; });
      toast({ title: "Removed from watchlist" });
    } else {
      const { error } = await supabase.from("vc_watchlist").insert({ vc_user_id: user.id, founder_id: founderId, pipeline_stage: "watching" });
      if (error?.code === "23505") { toast({ title: "Already on watchlist" }); return; }
      setWatchlistIds(prev => new Set([...prev, founderId]));
      toast({ title: "✅ Added to watchlist" });
    }
  };

  const handleRequestIntro = async (f: FounderRow, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await supabase.from("vc_intro_requests").insert({ vc_user_id: user.id, founder_id: f.id });
    toast({ title: "Introduction requested", description: `We'll connect you with ${f.full_name ?? "this founder"} within 48 hours.` });
  };

  const resetFilters = () => {
    setMinScore(0); setMaxScore(100); setMinMrr(0);
    setIndustryFilter("all"); setUnicornOnly(false); setVcEligibleOnly(false);
  };
  const hasActiveFilters = minScore > 0 || maxScore < 100 || minMrr > 0 || industryFilter !== "all" || unicornOnly || vcEligibleOnly;

  // ── Top10 mock shape for popup (use real data) ─────────────────────────────
  const top10ForPopup = founders.slice(0, 10).map(f => ({
    name: f.full_name ?? "Founder",
    company: f.company_name ?? "Company",
    score: Math.round(f.total_score),
    category: f.industry_experience ?? "—",
    location: "—",
    stage: f.is_vc_eligible ? "Seed" : "Pre-seed",
    mrr: fmtMrr(f.current_mrr),
    team: f.team_size ?? 1,
    raised: fmtFunding(f.total_funding_raised),
    growth: f.monthly_growth_rate ? `+${f.monthly_growth_rate}%` : "—",
    badges: isUnicorn(f) ? ["Unicorn Potential"] : f.is_vc_eligible ? ["VC Eligible"] : [],
    featured: isUnicorn(f),
    image: f.avatar_url ?? `${AVATAR_FALLBACK}${encodeURIComponent(f.full_name ?? "F")}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">OMISP Capital</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">
              Discover <span className="font-serif italic text-primary">Pre-Vetted</span> Founders
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6">
              High-quality founders with verified OMISP Scores, real metrics, and behavioral data.
              No cold emails. No wasted meetings.
            </p>
            <Button variant="outline" className="gap-2" onClick={() => setShowTop10(true)}>
              <Trophy className="w-4 h-4 text-primary" />
              View Top 10 Founders This Month
            </Button>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6 md:gap-8">
            {/* ── Leaderboard ───────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <LeaderboardSection founders={founders} loading={loading} />
            </div>

            {/* ── Main ─────────────────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Search row */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or company…"
                    className="pl-10 h-11"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className={`gap-2 h-11 ${hasActiveFilters ? "border-primary/50 text-primary" : ""}`}
                  onClick={() => setShowFilters(v => !v)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
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
                <span>{Math.min(viewCount, FREE_VIEW_LIMIT)}/{FREE_VIEW_LIMIT} free views used</span>
              </div>

              {/* Filters panel */}
              {showFilters && (
                <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Filters</span>
                    {hasActiveFilters && (
                      <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <X className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* FREE: Min score */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Min Score: <span className="text-foreground">{minScore}</span>
                      </label>
                      <Slider value={[minScore]} onValueChange={v => setMinScore(v[0])} max={100} step={5} />
                    </div>

                    {/* FREE: Industry */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Industry</label>
                      <Select value={industryFilter} onValueChange={setIndustryFilter}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="All industries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          {industries.map(ind => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* FREE: Revenue filter (basic) */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Min MRR</label>
                      <Select value={String(minMrr)} onValueChange={v => setMinMrr(Number(v))}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any</SelectItem>
                          <SelectItem value="1">Has revenue</SelectItem>
                          <SelectItem value="10000">$10K+</SelectItem>
                          <SelectItem value="50000">$50K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* LOCKED: Max score */}
                    <div className="relative">
                      <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        Max Score <Lock className="w-3 h-3 opacity-50" />
                      </label>
                      <div className="relative">
                        <Slider disabled value={[100]} max={100} step={5} className="opacity-40 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1 bg-background">
                            <Lock className="w-3 h-3" /> Pro
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* LOCKED: Growth rate */}
                    <div className="relative">
                      <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        Min Growth Rate <Lock className="w-3 h-3 opacity-50" />
                      </label>
                      <div className="relative">
                        <Select disabled>
                          <SelectTrigger className="h-9 opacity-40 cursor-not-allowed">
                            <SelectValue placeholder="Pro only" />
                          </SelectTrigger>
                        </Select>
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
                            <Lock className="w-3 h-3" /> Pro
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* LOCKED: Funding stage */}
                    <div className="relative">
                      <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        Funding Stage <Lock className="w-3 h-3 opacity-50" />
                      </label>
                      <div className="relative">
                        <Select disabled>
                          <SelectTrigger className="h-9 opacity-40 cursor-not-allowed">
                            <SelectValue placeholder="Pro only" />
                          </SelectTrigger>
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
                  <div className="flex flex-wrap gap-2 pt-1">
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
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading…" : `${filtered.length} founder${filtered.length !== 1 ? "s" : ""}`}
              </p>

              {/* Founder list */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No founders match your filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map(f => {
                    const unicorn = isUnicorn(f);
                    const locked = isLocked(f.id);
                    const expanded = expandedId === f.id;
                    const inWatchlist = watchlistIds.has(f.id);
                    const avatarUrl = f.avatar_url ?? `${AVATAR_FALLBACK}${encodeURIComponent(f.full_name ?? "F")}`;

                    return (
                      <div
                        key={f.id}
                        className={`rounded-xl border transition-all overflow-hidden cursor-pointer ${
                          unicorn
                            ? "border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-card"
                            : "border-border bg-card"
                        } ${locked ? "opacity-70" : ""} hover:border-primary/30`}
                        onClick={() => handleView(f.id)}
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <img
                                src={avatarUrl}
                                alt={f.full_name ?? "Founder"}
                                className="w-14 h-14 rounded-full object-cover bg-muted"
                                onError={e => {
                                  (e.target as HTMLImageElement).src = `${AVATAR_FALLBACK}${encodeURIComponent(f.full_name ?? "F")}`;
                                }}
                              />
                              {unicorn && (
                                <span className="absolute -top-1 -right-1 text-base">🦄</span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground">
                                      {locked ? (
                                        <span className="flex items-center gap-1">
                                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                          <span className="blur-sm select-none">{f.full_name ?? "Founder"}</span>
                                        </span>
                                      ) : (f.full_name ?? "Unnamed Founder")}
                                    </h3>
                                    {unicorn && (
                                      <Badge className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30 border">
                                        🦄 Unicorn
                                      </Badge>
                                    )}
                                    {f.is_vc_eligible && !unicorn && (
                                      <Badge variant="secondary" className="text-xs">✅ VC Eligible</Badge>
                                    )}
                                  </div>
                                  <p className="text-primary text-sm mt-0.5">
                                    {locked ? <span className="blur-sm select-none">{f.company_name ?? "Company"}</span> : (f.company_name ?? "—")}
                                  </p>
                                  {f.industry_experience && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{f.industry_experience}</p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className={`text-2xl font-bold ${scoreColor(f.total_score)}`}>
                                    {Math.round(f.total_score)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">OMISP</p>
                                </div>
                              </div>

                               {/* Stats row */}
                               <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-3 sm:gap-3 mt-3 text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="font-medium text-foreground">{fmtMrr(f.current_mrr)}</span>
                                  <span>MRR</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  <span className="font-medium text-foreground">{f.team_size ?? "—"}</span>
                                  <span>team</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="font-medium text-foreground">
                                    {f.monthly_growth_rate ? `+${f.monthly_growth_rate}%` : "—"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Expand arrow */}
                            <div className="shrink-0 text-muted-foreground">
                              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`gap-1.5 text-xs ${inWatchlist ? "text-primary" : ""}`}
                              onClick={e => toggleWatchlist(f.id, e)}
                            >
                              <Heart className={`w-3.5 h-3.5 ${inWatchlist ? "fill-primary" : ""}`} />
                              {inWatchlist ? "Saved" : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs"
                              onClick={e => handleRequestIntro(f, e)}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Request Intro
                            </Button>
                            <Link to={`/capital/founder/${f.id}`} className="ml-auto" onClick={e => {
                              if (locked) { e.preventDefault(); setShowUpgradeModal(true); }
                            }}>
                              <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                                <Eye className="w-3.5 h-3.5" />
                                Full Profile
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Expanded score breakdown */}
                        {expanded && !locked && (
                          <div className="border-t border-border/50 bg-muted/30 px-5 py-4 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground mb-3">Score Breakdown</p>
                            {[
                              { label: "Idea Viability", val: f.idea_viability, max: 20 },
                              { label: "Founder Aptitude", val: f.founder_aptitude, max: 20 },
                              { label: "Execution Readiness", val: f.execution_readiness, max: 20 },
                              { label: "Behavioral Resilience", val: f.behavioral_resilience, max: 20 },
                              { label: "Progress Velocity", val: f.progress_velocity, max: 10 },
                              { label: "Unicorn Potential", val: f.unicorn_potential, max: 10 },
                            ].map(({ label, val, max }) => (
                              <div key={label} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className="font-medium">{Math.round(val ?? 0)}/{max}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${Math.min(((val ?? 0) / max) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>Total Raised: <span className="text-foreground font-medium">{fmtFunding(f.total_funding_raised)}</span></div>
                              <div>Experience: <span className="text-foreground font-medium">{f.years_experience ?? 0} yrs</span></div>
                            </div>
                          </div>
                        )}

                        {/* Locked overlay */}
                        {locked && (
                          <div className="border-t border-border/50 bg-muted/30 px-5 py-4 text-center">
                            <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">
                              Upgrade to Pro to view full profile
                            </p>
                            <Link to="/capital/pricing">
                              <Button size="sm" className="mt-2 gap-1.5 text-xs">
                                Upgrade <ChevronRight className="w-3 h-3" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="hidden lg:block space-y-5">
              {/* Plan card */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground text-sm">Your Plan</h3>
                </div>
                <p className="text-xl font-bold text-foreground mb-1">Free</p>
                <p className="text-xs text-muted-foreground mb-4">{FREE_VIEW_LIMIT - Math.min(viewCount, FREE_VIEW_LIMIT)} free profile views remaining</p>
                <ul className="space-y-1.5 mb-4 text-xs">
                  {[
                    { text: "Top 10 monthly report", ok: true },
                    { text: "Basic search & filters", ok: true },
                    { text: "Score + industry filter", ok: true },
                    { text: "Unlimited profile views", ok: false },
                    { text: "Advanced filters (growth, stage)", ok: false },
                    { text: "AI screening reports", ok: false },
                  ].map(({ text, ok }) => (
                    <li key={text} className={`flex items-center gap-2 ${ok ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-primary" : "bg-muted-foreground/20"}`} />
                      {text}
                    </li>
                  ))}
                </ul>
                <Link to="/capital/pricing">
                  <Button size="sm" className="w-full gap-2">
                    Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Watchlist */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">Watchlist</h3>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{watchlistIds.size}</p>
                <p className="text-xs text-muted-foreground mb-3">Founders saved</p>
                {watchlistIds.size > 0 ? (
                  <div className="space-y-2">
                    {founders
                      .filter(f => watchlistIds.has(f.id))
                      .slice(0, 3)
                      .map(f => (
                        <div key={f.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <img
                            src={f.avatar_url ?? `${AVATAR_FALLBACK}${encodeURIComponent(f.full_name ?? "F")}`}
                            alt={f.full_name ?? ""}
                            className="w-7 h-7 rounded-full object-cover bg-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{f.full_name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground truncate">{f.company_name ?? "—"}</p>
                          </div>
                          <span className="text-xs font-bold text-primary">{Math.round(f.total_score)}</span>
                        </div>
                      ))}
                    {watchlistIds.size > 3 && (
                      <p className="text-xs text-muted-foreground text-center">+{watchlistIds.size - 3} more</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Save founders to track them here.</p>
                )}
              </div>

              {/* Premium CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">Premium Access</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  48-hour exclusive look at top 1% founders before anyone else.
                </p>
                <ul className="space-y-1.5 mb-4 text-xs">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-3.5 h-3.5 text-primary shrink-0" /> First look at unicorn founders
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Bell className="w-3.5 h-3.5 text-primary shrink-0" /> Real-time score alerts
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 text-primary shrink-0" /> AI screening reports
                  </li>
                </ul>
                <Link to="/capital/pricing">
                  <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Top 10 popup */}
      <Top10FoundersPopup
        open={showTop10}
        onOpenChange={setShowTop10}
        founders={top10ForPopup}
        onSaveFounder={(idx) => {
          const f = founders[idx];
          if (f) toggleWatchlist(f.id, { stopPropagation: () => {} } as React.MouseEvent);
        }}
      />

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
              You've used your <strong>{FREE_VIEW_LIMIT} free profile views</strong>. Upgrade to unlock unlimited founder discovery, advanced filters, and AI screening reports.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Unlimited founder profile views",
                "Advanced filters (MRR, growth rate, funding stage)",
                "AI-generated screening reports",
                "Side-by-side comparison",
                "Pipeline stage management",
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link to="/capital/pricing" className="flex-1">
                <Button className="w-full gap-2">Upgrade Now <ChevronRight className="w-4 h-4" /></Button>
              </Link>
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>Later</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapitalPage;
