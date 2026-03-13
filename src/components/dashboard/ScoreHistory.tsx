import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

// score_history table no longer exists in new schema — show static placeholder
interface ScoreHistoryItem {
  id: string;
  previous_score: number | null;
  new_score: number | null;
  change_amount: number | null;
  change_reason: string | null;
  dimension_changed: string | null;
  created_at: string;
}

interface ScoreHistoryProps {
  founderId?: string;
}

const mockHistory: ScoreHistoryItem[] = [
  { id: "1", change_amount: 3, change_reason: "Completed pitch session", created_at: new Date().toISOString(), dimension_changed: "behavioralResilience", previous_score: 78, new_score: 81 },
  { id: "2", change_amount: 2, change_reason: "Logged $50K MRR", created_at: new Date(Date.now() - 86400000).toISOString(), dimension_changed: "progressVelocity", previous_score: 76, new_score: 78 },
  { id: "3", change_amount: 1, change_reason: "Omi Chat engagement", created_at: new Date(Date.now() - 259200000).toISOString(), dimension_changed: "founderAptitude", previous_score: 75, new_score: 76 },
];

const ScoreHistory = ({ founderId: _founderId }: ScoreHistoryProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Score History</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
              <div className="flex-1">
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
                <p className="text-foreground">{item.change_reason}</p>
              </div>
              <span className={`font-medium ${(item.change_amount ?? 0) >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>
                {(item.change_amount ?? 0) >= 0 ? '+' : ''}{item.change_amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreHistory;
