import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import {
  ArrowLeft, Building2, Globe, Users, DollarSign, TrendingUp, Award,
  CheckCircle, Clock, ChevronRight, Crown, Star, Mail, Bookmark, Zap,
  Calendar,
} from "lucide-react";

interface FounderProfile {
  founder_id: string;
  full_name: string | null;
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

interface OmispScore {
  total_score: number;
  idea_score: number;
  aptitude_score: number;
  execution_score: number;
  resilience_score: number;
  velocity_score: number;
  unicorn_score: number;
}

interface Milestone {
  id: string;
  type: string;
  value: string | null;
  created_at: string;
}

const FREE_VIEW_LIMIT = 3;
const AVATAR_FALLBACK = "https://api.dicebear.com/7.x/initials/svg?seed=";

function fmtMrr(v: number) {
  if (!v) return "$0";
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}
function fmtFunding(v: number) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}
function scoreColor(s: number) {
  if (s >= 80) return "text-yellow-500";
  if (s >= 60) return "text-green-500";
  if (s >= 40) return "text-blue-500";
  return "text-muted-foreground";
}
function isUnicorn(p: FounderProfile, s: OmispScore | null) {
  return (s?.total_score ?? 0) >= 60 && p.team_size >= 3 && p.mrr_usd > 0;
}

export default function FounderDetail() {
  const { founderId } = useParams<{ founderId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [score, setScore] = useState<OmispScore | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewCount, setViewCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFounderUpgrade, setShowFounderUpgrade] = useState(false);

  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!founderId) return;
    const load = async () => {
      const [
        { data: profileData },
        { data: profileBase },
        { data: scoreData },
        { data: milestonesData },
        viewsResult,
        watchlistResult,
      ] = await Promise.all([
        supabase.from("founder_profiles").select("*").eq("founder_id", founderId).single(),
        supabase.from("profiles").select("full_name").eq("id", founderId).maybeSingle(),
        supabase.from("omisp_scores").select("*").eq("founder_id", founderId).maybeSingle(),
        supabase.from("milestones").select("id, type, value, created_at").eq("founder_id", founderId).order("created_at", { ascending: false }),
        user
          ? supabase.from("investor_views").select("founder_id").eq("investor_id", user.id)
          : Promise.resolve({ data: [] as { founder_id: string }[] }),
        user
          ? supabase.from("vc_watchlist").select("id").eq("vc_user_id", user.id).eq("founder_id", founderId).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setProfile(profileData as unknown as FounderProfile);
      setProfileName(profileBase?.full_name ?? null);
      setScore(scoreData as unknown as OmispScore | null);
      setMilestones((milestonesData ?? []) as Milestone[]);
      setInWatchlist(!!watchlistResult.data);

      const views = (viewsResult.data ?? []) as { founder_id: string }[];
      const totalViews = views.length;
      const alreadyViewed = views.some(v => v.founder_id === founderId);

      if (!alreadyViewed) {
        if (totalViews >= FREE_VIEW_LIMIT) {
          setIsLocked(true);
          setShowUpgradeModal(true);
          setViewCount(totalViews);
          setLoading(false);
          return;
        }
        if (user) {
          await (supabase.from("investor_views") as any).upsert(
            { investor_id: user.id, founder_id: founderId },
            { onConflict: "investor_id,founder_id" }
          );
          const newCount = totalViews + 1;
          setViewCount(newCount);
          const remaining = FREE_VIEW_LIMIT - newCount;
          if (remaining === 0) {
            toast({ title: "🔒 Last free profile view used", description: "Upgrade to Standard to unlock unlimited founder profiles." });
          } else {
            toast({ title: `👁 Profile viewed`, description: `${remaining} free view${remaining !== 1 ? "s" : ""} remaining this month.` });
          }
        }
      } else {
        setViewCount(totalViews);
      }

      setLoading(false);
    };
    load();
  }, [founderId, user]);

  const toggleWatchlist = async () => {
    if (!user || !founderId) return;
    if (inWatchlist) {
      await supabase.from("vc_watchlist").delete().eq("vc_user_id", user.id).eq("founder_id", founderId);
      setInWatchlist(false);
      toast({ title: "Removed from watchlist" });
    } else {
      await supabase.from("vc_watchlist").insert({ vc_user_id: user.id, founder_id: founderId, pipeline_stage: "watching" });
      setInWatchlist(true);
      toast({ title: "✅ Added to watchlist" });
    }
  };

  const requestIntro = async () => {
    if (!user || !founderId) return;
    await supabase.from("vc_intro_requests").insert({ vc_user_id: user.id, founder_id: founderId });
    toast({ title: "Introduction requested", description: "We'll connect you within 48 hours." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl space-y-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Founder not found.</p>
      </div>
    );
  }

  const unicorn = isUnicorn(profile, score);
  const totalScore = Math.round(score?.total_score ?? 0);
  const isVcEligible = totalScore >= 70;
  const displayName = profileName ?? "Unknown Founder";
  const avatarUrl = `${AVATAR_FALLBACK}${encodeURIComponent(displayName)}`;

  const dimensions = [
    { label: "Idea Viability", val: score?.idea_score, max: 20 },
    { label: "Founder Aptitude", val: score?.aptitude_score, max: 20 },
    { label: "Execution Readiness", val: score?.execution_score, max: 20 },
    { label: "Behavioral Resilience", val: score?.resilience_score, max: 20 },
    { label: "Progress Velocity", val: score?.velocity_score, max: 10 },
    { label: "Unicorn Potential", val: score?.unicorn_score, max: 10 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link
          to="/capital"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Capital
        </Link>

        {/* Hero card */}
        <div className={`rounded-2xl border p-6 mb-6 ${
          unicorn ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-card" : "border-border bg-card"
        }`}>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative shrink-0">
              <img
                src={isLocked ? `${AVATAR_FALLBACK}?` : (profile.logo_url ?? avatarUrl)}
                alt={displayName}
                className={`w-20 h-20 rounded-2xl object-cover bg-muted ${isLocked ? "blur-md" : ""}`}
              />
              {unicorn && !isLocked && <span className="absolute -top-2 -right-2 text-xl">🦄</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className={`text-2xl font-bold text-foreground ${isLocked ? "blur-sm select-none" : ""}`}>
                    {isLocked ? "Hidden Name" : displayName}
                  </h1>
                  <p className={`text-primary font-medium ${isLocked ? "blur-sm select-none" : ""}`}>
                    {isLocked ? "Hidden Company" : (profile.company_name ?? "—")}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.industry && <Badge variant="secondary" className="text-xs">{profile.industry}</Badge>}
                    {profile.stage && <Badge variant="secondary" className="text-xs">{profile.stage}</Badge>}
                    {isVcEligible && <Badge className="text-xs bg-primary/10 text-primary border-primary/20 border">✅ VC Eligible</Badge>}
                    {unicorn && <Badge className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30 border">🦄 Unicorn Candidate</Badge>}
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className={`text-4xl font-bold ${scoreColor(totalScore)}`}>{totalScore}</div>
                  <div className="text-xs text-muted-foreground">OMISP Score</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border/50">
            {[
              { icon: DollarSign, label: "MRR", value: isLocked ? "—" : fmtMrr(profile.mrr_usd) },
              { icon: Users, label: "Team", value: isLocked ? "—" : String(profile.team_size) },
              { icon: Award, label: "Raised", value: isLocked ? "—" : fmtFunding(profile.raised_usd) },
              { icon: TrendingUp, label: "Growth", value: isLocked ? "—" : (profile.growth_percent ? `+${profile.growth_percent}%` : "—") },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-0.5">
                  <Icon className="w-3 h-3" /> {label}
                </div>
                <p className="font-semibold text-foreground text-sm">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <Button variant={inWatchlist ? "default" : "outline"} size="sm" className="gap-2" onClick={toggleWatchlist}>
              <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-primary-foreground" : ""}`} />
              {inWatchlist ? "Saved" : "Save to Watchlist"}
            </Button>
            <Button size="sm" className="gap-2" onClick={requestIntro}>
              <Mail className="w-4 h-4" /> Request Intro
            </Button>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> OMISP Score Breakdown
          </h2>
          <div className="space-y-4">
            {dimensions.map(({ label, val, max }) => {
              const pct = Math.min(((val ?? 0) / max) * 100, 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{Math.round(val ?? 0)}/{max}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLocked ? "bg-muted-foreground/20" : "bg-primary"}`}
                      style={{ width: `${isLocked ? 0 : pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {isLocked && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Upgrade to see full score breakdown</p>
              <Link to="/capital/pricing">
                <Button size="sm" className="gap-1.5">Upgrade <ChevronRight className="w-3 h-3" /></Button>
              </Link>
            </div>
          )}
        </div>

        {/* Location / company info */}
        {!isLocked && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Company Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {profile.tagline && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-muted-foreground text-xs mb-0.5">Tagline</p>
                  <p className="font-medium">{profile.tagline}</p>
                </div>
              )}
              {profile.location && (
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              )}
              {profile.stage && (
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Stage</p>
                  <p className="font-medium">{profile.stage}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Milestones
            <Badge variant="secondary" className="ml-auto text-xs">{milestones.length}</Badge>
          </h2>
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No milestones logged yet.</p>
          ) : (
            <div className="space-y-3">
              {milestones.slice(0, isLocked ? 2 : undefined).map(m => (
                <div key={m.id} className={`flex items-center gap-3 p-3 rounded-lg bg-muted/40 ${isLocked ? "blur-sm" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize">{m.type.replace(/_/g, " ")}</p>
                    {m.value && <p className="text-xs text-muted-foreground">{m.value}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                </div>
              ))}
              {isLocked && milestones.length > 2 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">+{milestones.length - 2} more milestones locked</p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLocked && (
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Unlock more founder insights</p>
              <p className="text-sm text-muted-foreground">Get AI screening reports, pipeline management, and unlimited views.</p>
            </div>
            <Link to="/capital/pricing">
              <Button className="gap-2 whitespace-nowrap">View Pro Plans <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" /> View Limit Reached
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <p className="text-sm text-muted-foreground">
              You've used your <strong>{FREE_VIEW_LIMIT} free profile views</strong>. Upgrade to Pro to access this founder's full profile.
            </p>
            <div className="flex gap-3">
              <Link to="/capital/pricing" className="flex-1">
                <Button className="w-full gap-2">Upgrade Now <ChevronRight className="w-4 h-4" /></Button>
              </Link>
              <Button variant="outline" onClick={() => { setShowUpgradeModal(false); navigate("/capital"); }}>
                Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradePrompt open={showFounderUpgrade} onClose={() => setShowFounderUpgrade(false)} trigger="feature" />
    </div>
  );
}
