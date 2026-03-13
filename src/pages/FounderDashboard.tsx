import { Bell, Settings, Crown, Lock, ChevronRight, CheckCircle, Clock, Trophy, Zap, BarChart3, TrendingUp, Users, Target, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import OMISPScoreCard from "@/components/dashboard/OMISPScoreCard";
import MilestoneLogging from "@/components/dashboard/MilestoneLogging";
import { useOMISPScore } from "@/hooks/useOMISPScore";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Milestone {
  id: string;
  type: string;
  value: string | null;
  created_at: string;
}

const milestoneIcon = (type: string) => {
  const icons: Record<string, React.ElementType> = {
    first_customer: Users,
    revenue: TrendingUp,
    team: Users,
    funding: Trophy,
    website: Rocket,
    registered: Target,
  };
  return icons[type] ?? Target;
};

const pricingTiers = [
  {
    name: "Strategist",
    tier: "Pro",
    price: "$39",
    period: "/mo",
    highlight: true,
    features: ["Unlimited tools access", "Full OMISP score (5D)", "Milestone logging & tracking", "OMISP Capital eligible (Score ≥70)", "Monthly Founder Briefing"],
  },
  {
    name: "Unicorn Builder",
    tier: "Premium",
    price: "$99",
    period: "/mo",
    highlight: false,
    features: ["Everything in Pro", "VC visibility to 5–10 curated VCs", "AI-generated investor report", "Real-time VC dashboard views", "Quarterly sessions with Omi"],
  },
];

const FounderDashboard = () => {
  const { user } = useAuth();
  const { profile, scores, loading, refreshScores } = useOMISPScore();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(true);

  const totalScore = scores?.totalScore ?? 0;
  const vcEligible = scores?.isVCEligible ?? false;
  const unicornPotential = scores?.isUnicornPotential ?? false;

  const fetchMilestonesRefresh = useCallback(async () => {
    if (!user) return;
    setMilestonesLoading(true);
    const { data } = await (supabase.from("milestones") as any)
      .select("id, type, value, created_at")
      .eq("founder_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setMilestones(data ?? []);
    setMilestonesLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchMilestonesRefresh();
    else if (!loading) setMilestonesLoading(false);
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold">Founder Dashboard</h1>
                {vcEligible && (
                  <Badge className="bg-accent/80 text-accent-foreground border-0">✅ VC Eligible</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {profile?.company_name && <span className="font-medium">{profile.company_name} · </span>}
                OMISP Score: <span className="font-semibold text-foreground">{totalScore}/100</span>
                {!vcEligible && totalScore < 70 && (
                  <span className="ml-2 text-muted-foreground">— {70 - totalScore} pts to VC Eligible</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MilestoneLogging onMilestoneAdd={() => { refreshScores(); fetchMilestonesRefresh(); }} />
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Link to="/founder/profile-setup">
                <Button variant="ghost" size="icon" title="Edit Profile">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {/* OMISP Score Card */}
          <div className="lg:col-span-1">
            <OMISPScoreCard
              scores={scores?.scores ?? null}
              totalScore={totalScore}
              isVCEligible={vcEligible}
              isUnicornPotential={unicornPotential}
              scoreBreakdown={scores?.scoreBreakdown}
              loading={loading}
            />
          </div>

          {/* Milestones */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Milestones</CardTitle>
                <MilestoneLogging onMilestoneAdd={() => { refreshScores(); fetchMilestonesRefresh(); }} />
              </CardHeader>
              <CardContent>
                {milestonesLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="font-medium text-muted-foreground">No milestones yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Log a milestone to boost your OMISP score</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {milestones.map((m) => {
                      const Icon = milestoneIcon(m.type);
                      return (
                        <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm capitalize">
                              {m.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
                          </div>
                          <Clock className="w-3 h-3 text-yellow-500 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Locked Cards */}
        <div className="mt-8 md:mt-10">
          <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-5">
            <Crown className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-semibold">Premium Features</h2>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">Locked</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { title: "VC Intro Requests", description: "See which investors want to connect with you and manage intro requests.", icon: Trophy, badge: "Pro" },
              { title: "AI Investor Report", description: "Auto-generated pitch deck and due-diligence summary sent to curated VCs.", icon: BarChart3, badge: "Pro" },
              { title: "Score Benchmarking", description: "Compare your OMISP score against top founders in your industry.", icon: TrendingUp, badge: "Pro" },
              { title: "Priority Visibility", description: "Your profile gets featured in VC discovery feeds for 30 days per month.", icon: Zap, badge: "Premium" },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="relative rounded-xl border border-border bg-card p-5 overflow-hidden group">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/pricing">
                      <Button size="sm" className="gap-2">
                        <Lock className="w-3 h-3" /> Upgrade
                      </Button>
                    </Link>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">{card.badge}</Badge>
                  <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${
                  tier.highlight ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {tier.highlight && (
                      <Badge className="mb-2 bg-primary text-primary-foreground text-xs">Most Popular</Badge>
                    )}
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{tier.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground text-sm">{tier.period}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-3 h-3 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button className="w-full gap-2" variant={tier.highlight ? "default" : "outline"}>
                    Upgrade to {tier.tier} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FounderDashboard;
