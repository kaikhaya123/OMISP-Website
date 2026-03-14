import { Eye, MessageSquare, TrendingUp, Video, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Profile Views",
    value: "847",
    change: "+12%",
    trend: "up",
    icon: Eye,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "VC Interests",
    value: "23",
    change: "+5",
    trend: "up",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Pitches Recorded",
    value: "12",
    change: "3 this week",
    trend: "neutral",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    label: "Avg. Pitch Score",
    value: "68",
    change: "+8 pts",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-primary/10",
  },
  {
    label: "AI Sessions",
    value: "34",
    change: "5h total",
    trend: "neutral",
    icon: MessageSquare,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "Days Active",
    value: "45",
    change: "Streak: 7",
    trend: "up",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.trend === "up" && (
                <span className="text-xs text-green-500 font-medium">{stat.change}</span>
              )}
              {stat.trend === "neutral" && (
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              )}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
