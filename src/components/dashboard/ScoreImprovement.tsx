import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Crown, MessageSquare, Gamepad2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ImprovementItem {
  icon: React.ElementType;
  title: string;
  pointsRange: string;
  dimension: string;
  link: string;
  action?: React.ReactNode;
}

const improvementItems: ImprovementItem[] = [
  {
    icon: Target,
    title: "Complete a Pitch Gauntlet session",
    pointsRange: "+2-5",
    dimension: "Behavioral Resilience",
    link: "/pitch-gauntlet",
  },
  {
    icon: TrendingUp,
    title: "Build a financial model",
    pointsRange: "+2-4",
    dimension: "Idea Viability",
    link: "/revenue-architect",
  },
  {
    icon: MessageSquare,
    title: "Have an Omi Chat session",
    pointsRange: "+1-2",
    dimension: "Founder Aptitude",
    link: "/omi-chat",
  },
  {
    icon: Gamepad2,
    title: "Play Build-a-Biz game",
    pointsRange: "+2-4",
    dimension: "Execution Readiness",
    link: "/build-a-biz",
  },
  {
    icon: Crown,
    title: "Log a real-world milestone",
    pointsRange: "+1-2",
    dimension: "Progress Velocity",
    link: "/dashboard",
  },
];

interface ScoreImprovementProps {
  milestoneLoggingAction?: React.ReactNode;
}

const ScoreImprovement = ({ milestoneLoggingAction }: ScoreImprovementProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">How to Improve Your Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {improvementItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.pointsRange} {item.dimension}
                </p>
              </div>
              {item.title.includes("milestone") && milestoneLoggingAction ? (
                milestoneLoggingAction
              ) : (
                <Link to={item.link}>
                  <Button size="sm" variant="ghost" className="p-1 h-auto">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreImprovement;
