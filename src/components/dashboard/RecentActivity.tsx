import { Video, Eye, MessageSquare, Trophy, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  type: "pitch" | "view" | "chat" | "achievement" | "interest" | "score";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "interest",
    title: "New VC Interest",
    description: "Sequoia Capital added you to their watchlist",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "score",
    title: "Score Increased",
    description: "Your pitch score improved to 68 (+3)",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "pitch",
    title: "Pitch Analyzed",
    description: "AI feedback ready for your latest pitch",
    time: "Yesterday",
  },
  {
    id: "4",
    type: "view",
    title: "Profile Viewed",
    description: "A16Z Partner viewed your profile",
    time: "Yesterday",
  },
  {
    id: "5",
    type: "chat",
    title: "Coaching Session",
    description: "Completed Omi Chat session on market sizing",
    time: "2 days ago",
  },
  {
    id: "6",
    type: "achievement",
    title: "Milestone Unlocked",
    description: "Earned 'AI Feedback Received' badge",
    time: "3 days ago",
  },
];

const getIcon = (type: Activity["type"]) => {
  const iconMap = {
    pitch: Video,
    view: Eye,
    chat: MessageSquare,
    achievement: Trophy,
    interest: Star,
    score: TrendingUp,
  };
  return iconMap[type];
};

const getColor = (type: Activity["type"]) => {
  const colorMap = {
    pitch: "text-red-500 bg-red-500/10",
    view: "text-primary bg-primary/10",
    chat: "text-accent bg-accent/10",
    achievement: "text-yellow-500 bg-yellow-500/10",
    interest: "text-primary bg-primary/10",
    score: "text-orange-500 bg-orange-500/10",
  };
  return colorMap[type];
};

const RecentActivity = () => {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] px-6 pb-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              const colorClass = getColor(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
