import { Trophy, Star, TrendingUp, Zap, Brain, Target, Rocket, Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { OMISPScores, getScoreInterpretation } from "@/hooks/useOMISPScore";

interface OMISPScoreCardProps {
  scores: OMISPScores | null;
  totalScore: number;
  isVCEligible: boolean;
  isUnicornPotential: boolean;
  scoreBreakdown?: {
    ideaViability: string[];
    founderAptitude: string[];
    executionReadiness: string[];
    behavioralResilience: string[];
    progressVelocity: string[];
    unicornPotential: string[];
  };
  loading?: boolean;
  showBadges?: boolean;
  compact?: boolean;
}

const scoreItems = [
  { 
    key: "ideaViability" as const,
    label: "Idea Viability", 
    max: 20, 
    icon: Target,
    description: "AI Revenue Architect analysis",
    color: "from-orange-500 to-amber-500"
  },
  { 
    key: "founderAptitude" as const,
    label: "Founder Aptitude", 
    max: 20, 
    icon: Brain,
    description: "Omi Chat engagement & learning",
    color: "from-purple-500 to-violet-500"
  },
  { 
    key: "executionReadiness" as const,
    label: "Execution Readiness", 
    max: 20, 
    icon: Rocket,
    description: "Build-a-Biz Game performance",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    key: "behavioralResilience" as const,
    label: "Behavioral Resilience", 
    max: 20, 
    icon: Zap,
    description: "Pitch Perfect Gauntlet performance",
    color: "from-pink-500 to-rose-500"
  },
  { 
    key: "progressVelocity" as const,
    label: "Progress Velocity", 
    max: 10, 
    icon: TrendingUp,
    description: "Real-world milestones achieved",
    color: "from-green-500 to-emerald-500"
  },
  { 
    key: "unicornPotential" as const,
    label: "Unicorn Potential", 
    max: 10, 
    icon: Sparkles,
    description: "Revenue, team & growth trajectory",
    color: "from-primary to-yellow-500"
  },
];

const OMISPScoreCard = ({ 
  scores, 
  totalScore, 
  isVCEligible, 
  isUnicornPotential,
  scoreBreakdown,
  loading = false,
  showBadges = true, 
  compact = false 
}: OMISPScoreCardProps) => {
  const interpretation = getScoreInterpretation(totalScore);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border-border relative overflow-hidden ${compact ? '' : ''}`}>
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Your OMISP Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalScore}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
            <p className={`text-sm mt-1 ${interpretation.color}`}>
              {interpretation.description}
            </p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-foreground to-foreground/80 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Score Bars */}
        <div className="space-y-4">
          {scoreItems.map((item) => {
            const score = scores?.[item.key] ?? 0;
            const breakdown = scoreBreakdown?.[item.key] ?? [];
            
            return (
              <TooltipProvider key={item.key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group cursor-help">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.label}
                          </span>
                          {breakdown.length > 0 && (
                            <Info className="w-3 h-3 text-muted-foreground/50" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {score}/{item.max}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700 ease-out`}
                          style={{ width: `${(score / item.max) * 100}%` }}
                        />
                      </div>
                      {!compact && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </TooltipTrigger>
                  {breakdown.length > 0 && (
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{item.label} Breakdown</p>
                        {breakdown.map((point, i) => (
                          <p key={i} className="text-xs text-muted-foreground">{point}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Badges */}
        {showBadges && (
          <div className="flex flex-wrap gap-2 mt-6">
            {isVCEligible && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium border border-accent">
                ✅ VC Eligible
              </span>
            )}
            {isUnicornPotential && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                🦄 Unicorn Potential
              </span>
            )}
            {totalScore >= 50 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Star className="w-3 h-3" />
                Top {Math.max(1, 100 - totalScore)}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OMISPScoreCard;
