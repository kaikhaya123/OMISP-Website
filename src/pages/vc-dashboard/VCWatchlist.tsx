import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const STAGES = ["watching", "in_review", "intro_requested", "meeting_scheduled", "passed"] as const;
const STAGE_LABELS: Record<string, string> = {
  watching: "Watching",
  in_review: "In Review",
  intro_requested: "Intro Requested",
  meeting_scheduled: "Meeting Scheduled",
  passed: "Passed",
};
const STAGE_COLORS: Record<string, string> = {
  watching: "bg-feature-blue/10 text-feature-blue",
  in_review: "bg-primary/10 text-primary",
  intro_requested: "bg-feature-purple/10 text-feature-purple",
  meeting_scheduled: "bg-feature-green/10 text-feature-green",
  passed: "bg-muted text-muted-foreground",
};

interface WatchlistItem {
  id: string;
  founder_id: string;
  pipeline_stage: string;
  notes: string | null;
  created_at: string;
  founder_name: string | null;
  company_name: string | null;
  total_score: number | null;
}

export default function VCWatchlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    if (!user) return;
    const { data: watchlist } = await supabase
      .from("vc_watchlist")
      .select("id, founder_id, pipeline_stage, notes, created_at")
      .eq("vc_user_id", user.id)
      .order("created_at", { ascending: false });

    if (!watchlist || watchlist.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const founderIds = watchlist.map(w => w.founder_id);
    const [{ data: profiles }, { data: profileNames }, { data: scores }] = await Promise.all([
      (supabase.from("founder_profiles") as any).select("founder_id, company_name").in("founder_id", founderIds),
      supabase.from("profiles").select("id, full_name").in("id", founderIds),
      (supabase.from("omisp_scores") as any).select("founder_id, total_score").in("founder_id", founderIds),
    ]);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.founder_id, p]));
    const nameMap = new Map((profileNames ?? []).map((p: any) => [p.id, p.full_name]));
    const scoreMap = new Map((scores ?? []).map((s: any) => [s.founder_id, s]));

    const merged: WatchlistItem[] = watchlist.map(w => ({
      ...w,
      founder_name: nameMap.get(w.founder_id) ?? null,
      company_name: (profileMap.get(w.founder_id) as any)?.company_name ?? null,
      total_score: (scoreMap.get(w.founder_id) as any)?.total_score ?? null,
    }));

    setItems(merged);
    setLoading(false);
  };

  useEffect(() => { fetchWatchlist(); }, [user]);

  const updateStage = async (id: string, stage: string) => {
    await supabase.from("vc_watchlist").update({ pipeline_stage: stage }).eq("id", id);
    setItems(prev => prev.map(item => item.id === id ? { ...item, pipeline_stage: stage } : item));
  };

  const removeItem = async (id: string) => {
    await supabase.from("vc_watchlist").delete().eq("id", id);
    setItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Removed from watchlist" });
  };

  return (
    <VCDashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Watchlist & Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Track founders through your deal pipeline.</p>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Your watchlist is empty. Add founders from the Leaderboard.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.founder_name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{item.company_name || "—"}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{item.total_score ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={item.pipeline_stage} onValueChange={v => updateStage(item.id, v)}>
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map(s => (
                            <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VCDashboardLayout>
  );
}
