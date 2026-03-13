import { Trophy, Star, TrendingUp, Zap, Brain, Target, Rocket, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreCardProps {
  scores?: {
    ideaViability: number;
    founderAptitude: number;
    executionReadiness: number;
    behavioralResilience: number;
    progressVelocity: number;
    unicornPotential: number;
  };
  showBadges?: boolean;
  compact?: boolean;
}

const defaultScores = {
  ideaViability: 18,
  founderAptitude: 17,
  executionReadiness: 16,
  behavioralResilience: 15,
  progressVelocity: 8,
  unicornPotential: 7,
};

const ScoreCard = ({ scores = defaultScores, showBadges = true, compact = false }: ScoreCardProps) => {
  const scoreItems = [
    { 
      label: "Idea Viability", 
      score: scores.ideaViability, 
      max: 20, 
      icon: Target,
      description: "AI Revenue Architect analysis",
      color: "from-orange-500 to-amber-500"
    },
    { 
      label: "Founder Aptitude", 
      score: scores.founderAptitude, 
      max: 20, 
      icon: Brain,
      description: "Omi Chat engagement & learning",
      color: "from-purple-500 to-violet-500"
    },
    { 
      label: "Execution Readiness", 
      score: scores.executionReadiness, 
      max: 20, 
      icon: Rocket,
      description: "Market Heartbeat Saga performance",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Behavioral Resilience", 
      score: scores.behavioralResilience, 
      max: 20, 
      icon: Zap,
      description: "Pitch Perfect Gauntlet performance",
      color: "from-pink-500 to-rose-500"
    },
    { 
      label: "Progress Velocity", 
      score: scores.progressVelocity, 
      max: 10, 
      icon: TrendingUp,
      description: "Real-world milestones achieved",
      color: "from-green-500 to-emerald-500"
    },
    { 
      label: "Unicorn Potential", 
      score: scores.unicornPotential, 
      max: 10, 
      icon: Sparkles,
      description: "Revenue, team & growth trajectory",
      color: "from-primary to-yellow-500"
    },
  ];

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const isVCEligible = totalScore >= 70;
  const isUnicornPotential = scores.unicornPotential >= 8;

  return (
    <div className={`bg-card rounded-2xl shadow-xl border border-border ${compact ? 'p-4' : 'p-6 md:p-8'} relative overflow-hidden`}>
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div>
          <p className="text-muted-foreground text-sm mb-1">Your OMISP Score</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {totalScore}
            </span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-foreground to-foreground/80 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Score Bars */}
      <div className="space-y-4">
        {scoreItems.map((item, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.score}/{item.max}
              </span>
            </div>
            <div className="score-bar h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700 ease-out`}
                style={{ width: `${(item.score / item.max) * 100}%` }}
              />
            </div>
            {!compact && (
              <p className="text-xs text-muted-foreground/70 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Badges */}
      {showBadges && (
        <div className="flex flex-wrap gap-2 mt-6">
          {isVCEligible && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium border border-green-500/20">
              ✅ VC Eligible
            </span>
          )}
          {isUnicornPotential && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              🦄 Unicorn Potential
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Star className="w-3 h-3" />
            Top 15%
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
