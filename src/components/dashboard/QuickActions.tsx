import { Video, MessageSquare, Lightbulb, TrendingUp, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    icon: Video,
    label: "Record Pitch",
    description: "Practice your pitch",
    color: "text-red-500",
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
    path: "/dashboard/pitch-gauntlet",
  },
  {
    icon: MessageSquare,
    label: "Chat with Omi",
    description: "Get AI coaching",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
    path: "/dashboard/omi-chat",
  },
  {
    icon: Lightbulb,
    label: "Ideaverse",
    description: "Refine your idea",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
    path: "/dashboard/ideaverse",
  },
  {
    icon: TrendingUp,
    label: "Build-a-Biz",
    description: "Business simulation",
    color: "text-green-500",
    bgColor: "bg-green-500/10 hover:bg-green-500/20",
    path: "/dashboard/build-a-biz",
  },
  {
    icon: Award,
    label: "Revenue Architect",
    description: "Financial models",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
    path: "/dashboard/revenue-architect",
  },
  {
    icon: BookOpen,
    label: "OMISP Capital",
    description: "VC discovery",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
    path: "/capital",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className={`h-auto flex-col items-center justify-center p-4 ${action.bgColor} transition-all`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
