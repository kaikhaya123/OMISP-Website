import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Mail, 
  MapPin, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  Sparkles,
  Calendar,
  Globe,
  Award,
  Rocket,
  Brain,
  Target,
  Shield,
  Zap
} from "lucide-react";

interface ScoreDimension {
  name: string;
  score: number;
  maxScore: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface Founder {
  name: string;
  company: string;
  score: number;
  category: string;
  location: string;
  stage: string;
  mrr: string;
  team: number;
  raised: string;
  growth: string;
  badges: string[];
  image: string;
}

interface FounderProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  founder: Founder | null;
  onSave: () => void;
  onRequestIntro: () => void;
}

const FounderProfileModal = ({ 
  open, 
  onOpenChange, 
  founder, 
  onSave, 
  onRequestIntro 
}: FounderProfileModalProps) => {
  if (!founder) return null;

  // Generate 6-dimension score breakdown based on total score
  const generateScoreBreakdown = (totalScore: number): ScoreDimension[] => {
    const baseMultiplier = totalScore / 100;
    return [
      { 
        name: "Idea Viability", 
        score: Math.round(18 * baseMultiplier + Math.random() * 2), 
        maxScore: 20, 
        icon: Target,
        description: "Based on AI Revenue Architect model and market analysis"
      },
      { 
        name: "Founder Aptitude", 
        score: Math.round(17 * baseMultiplier + Math.random() * 3), 
        maxScore: 20, 
        icon: Brain,
        description: "Based on Omi Chat engagement and learning velocity"
      },
      { 
        name: "Execution Readiness", 
        score: Math.round(16 * baseMultiplier + Math.random() * 4), 
        maxScore: 20, 
        icon: Rocket,
        description: "Based on Market Heartbeat Saga performance"
      },
      { 
        name: "Behavioral Resilience", 
        score: Math.round(17 * baseMultiplier + Math.random() * 3), 
        maxScore: 20, 
        icon: Shield,
        description: "Based on Pitch Perfect Gauntlet performance"
      },
      { 
        name: "Progress Velocity", 
        score: Math.round(8 * baseMultiplier + Math.random() * 2), 
        maxScore: 10, 
        icon: TrendingUp,
        description: "Based on real-world milestones achieved"
      },
      { 
        name: "Unicorn Potential", 
        score: Math.round(8 * baseMultiplier + Math.random() * 2), 
        maxScore: 10, 
        icon: Zap,
        description: "Based on revenue, team size, and growth trajectory"
      },
    ];
  };

  const scoreBreakdown = generateScoreBreakdown(founder.score);

  const milestones = [
    { event: "Company Registered", date: "January 2024", icon: Building2 },
    { event: "Website Launched", date: "February 2024", icon: Globe },
    { event: "First Customer", date: "March 2024", icon: Award },
    { event: `${founder.mrr} MRR Achieved`, date: "November 2024", icon: DollarSign },
    { event: `Team of ${founder.team} Built`, date: "October 2024", icon: Users },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Founder Profile: {founder.name}</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={founder.image}
            alt={founder.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-foreground">{founder.name}</h2>
              {founder.badges.includes("Unicorn Potential") && (
                <span className="text-2xl">🦄</span>
              )}
            </div>
            <p className="text-xl text-primary mb-2">{founder.company}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {founder.category}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {founder.location}
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                {founder.stage}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{founder.score}</p>
            <p className="text-sm text-muted-foreground">OMISP Score</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {founder.badges.map((badge, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Monthly Revenue
            </div>
            <p className="text-xl font-bold text-foreground">{founder.mrr}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Users className="w-3 h-3" />
              Team Size
            </div>
            <p className="text-xl font-bold text-foreground">{founder.team}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Total Raised
            </div>
            <p className="text-xl font-bold text-foreground">{founder.raised}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              MoM Growth
            </div>
            <p className="text-xl font-bold text-green-600">{founder.growth}</p>
          </div>
        </div>

        {/* 6-Dimension Score Breakdown */}
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-4">OMISP Score Breakdown</h3>
          <div className="grid gap-4">
            {scoreBreakdown.map((dimension, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <dimension.icon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{dimension.name}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {dimension.score}/{dimension.maxScore}
                  </span>
                </div>
                <Progress value={(dimension.score / dimension.maxScore) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">{dimension.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Timeline */}
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-4">Progress Timeline</h3>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <milestone.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{milestone.event}</p>
                  <p className="text-sm text-muted-foreground">{milestone.date}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="gap-2" onClick={onSave}>
            <Heart className="w-4 h-4" />
            Add to Watchlist
          </Button>
          <Button className="gap-2 flex-1" onClick={onRequestIntro}>
            <Mail className="w-4 h-4" />
            Request Introduction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FounderProfileModal;
