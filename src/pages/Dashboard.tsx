import { Bell, Settings, Crown, Download, Eye, TrendingUp, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import OMISPScoreCard from "@/components/dashboard/OMISPScoreCard";
import MilestoneTimeline from "@/components/dashboard/MilestoneTimeline";
import QuickActions from "@/components/dashboard/QuickActions";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import MilestoneLogging from "@/components/dashboard/MilestoneLogging";
import ScoreHistory from "@/components/dashboard/ScoreHistory";
import ScoreImprovement from "@/components/dashboard/ScoreImprovement";
import VCInterestWidget from "@/components/dashboard/VCInterestWidget";
import { useOMISPScore, getScoreInterpretation } from "@/hooks/useOMISPScore";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { profile, scores, loading, refreshScores } = useOMISPScore();

  const totalScore = scores?.totalScore ?? 0;
  const vcEligible = scores?.isVCEligible ?? false;
  const unicornPotential = scores?.isUnicornPotential ?? false;
  const interpretation = getScoreInterpretation(totalScore);

  const vcInterest = {
    views: 23,
    favorites: 5,
    introRequests: 2,
  };

  const handleMilestoneAdd = () => {
    // Refresh scores when a milestone is added
    refreshScores();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
                Welcome back
              </h1>
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Your score: <span className={`font-semibold ${interpretation.color}`}>{totalScore}/100</span>
              {vcEligible ? (
                <span className="text-accent-foreground ml-2">✅ VC Eligible</span>
              ) : (
                <span className="text-muted-foreground ml-2">Score {70 - totalScore} more to become VC eligible</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MilestoneLogging onMilestoneAdd={handleMilestoneAdd} />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="score">OMISP Score</TabsTrigger>
            <TabsTrigger value="vc-interest">VC Interest</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Score & Quick Actions */}
              <div className="space-y-6">
                <OMISPScoreCard
                  scores={scores?.scores ?? null}
                  totalScore={totalScore}
                  isVCEligible={vcEligible}
                  isUnicornPotential={unicornPotential}
                  scoreBreakdown={scores?.scoreBreakdown}
                  loading={loading}
                  compact
                />
                <QuickActions />
              </div>

              {/* Middle Column - Milestones */}
              <div>
                <MilestoneTimeline />
              </div>

              {/* Right Column - Activity & VC Interest */}
              <div className="space-y-6">
                <RecentActivity />
                <VCInterestWidget />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="score">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your 6-Dimension OMISP Score</h2>
                <p className="text-muted-foreground mb-6">
                  Your score is calculated from real engagement across all OMISP features 
                  plus your real-world progress milestones.
                </p>
                <OMISPScoreCard
                  scores={scores?.scores ?? null}
                  totalScore={totalScore}
                  isVCEligible={vcEligible}
                  isUnicornPotential={unicornPotential}
                  scoreBreakdown={scores?.scoreBreakdown}
                  loading={loading}
                />
              </div>
              
              <div className="space-y-6">
                <ScoreImprovement 
                  milestoneLoggingAction={<MilestoneLogging onMilestoneAdd={handleMilestoneAdd} />}
                />
                <ScoreHistory founderId={profile?.founder_id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vc-interest">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">VC Interest Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Track which VCs are viewing your profile, adding you to their watchlist, and requesting introductions.
              </p>
              <VCInterestWidget />
            </div>
          </TabsContent>

          <TabsContent value="milestones">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Milestones</h2>
                <p className="text-muted-foreground">Track your real-world progress to boost your OMISP Score</p>
              </div>
              <MilestoneLogging onMilestoneAdd={handleMilestoneAdd} />
            </div>
            <MilestoneTimeline />
          </TabsContent>
        </Tabs>

        {/* Upgrade CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary font-medium">Upgrade to Premium</span>
              </div>
              <h3 className="text-xl font-semibold mb-1">Get Guaranteed VC Visibility</h3>
              <p className="text-muted-foreground">
                Premium members get monthly visibility to 5-10 curated VCs and auto-generated investor reports.
              </p>
            </div>
            <Link to="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 whitespace-nowrap gap-2">
                Upgrade Now
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
