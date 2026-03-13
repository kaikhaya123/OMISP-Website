import { CheckCircle2, Circle, Lock, Trophy, Target, Rocket, Users, DollarSign, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "locked";
  reward?: string;
  progress?: number;
}

const milestones: Milestone[] = [
  {
    id: "1",
    title: "Complete Profile",
    description: "Fill out your founder profile and company details",
    icon: <Users className="w-5 h-5" />,
    status: "completed",
    reward: "+10 Score Points",
  },
  {
    id: "2",
    title: "First Pitch Recorded",
    description: "Record and submit your first pitch video",
    icon: <Target className="w-5 h-5" />,
    status: "completed",
    reward: "+15 Score Points",
  },
  {
    id: "3",
    title: "AI Feedback Received",
    description: "Get AI analysis on your pitch performance",
    icon: <Sparkles className="w-5 h-5" />,
    status: "completed",
    reward: "+20 Score Points",
  },
  {
    id: "4",
    title: "Score 70+ on Pitch",
    description: "Achieve a pitch score of 70 or higher",
    icon: <Trophy className="w-5 h-5" />,
    status: "current",
    reward: "+25 Score Points",
    progress: 68,
  },
  {
    id: "5",
    title: "First VC View",
    description: "Get your first profile view from a verified VC",
    icon: <DollarSign className="w-5 h-5" />,
    status: "locked",
    reward: "Unlock Premium Features",
  },
  {
    id: "6",
    title: "Top 10 Founder",
    description: "Rank in the Top 10 Founders list",
    icon: <Rocket className="w-5 h-5" />,
    status: "locked",
    reward: "Featured Profile Badge",
  },
];

const MilestoneTimeline = () => {
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const overallProgress = (completedCount / milestones.length) * 100;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Journey Progress</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {completedCount}/{milestones.length} Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
              milestone.status === "current"
                ? "bg-primary/10 border border-primary/30"
                : milestone.status === "completed"
                ? "bg-muted/30"
                : "opacity-50"
            }`}
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.status === "completed"
                    ? "bg-green-500/20 text-green-500"
                    : milestone.status === "current"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {milestone.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : milestone.status === "locked" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  milestone.icon
                )}
              </div>
              {index < milestones.length - 1 && (
                <div
                  className={`absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2 ${
                    milestone.status === "completed" ? "bg-green-500/50" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{milestone.title}</h4>
                {milestone.reward && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      milestone.status === "completed"
                        ? "border-green-500/30 text-green-500"
                        : "border-border"
                    }`}
                  >
                    {milestone.reward}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
              {milestone.status === "current" && milestone.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Current: {milestone.progress}/70</span>
                    <span>{Math.round((milestone.progress / 70) * 100)}%</span>
                  </div>
                  <Progress value={(milestone.progress / 70) * 100} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MilestoneTimeline;
