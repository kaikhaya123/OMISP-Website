import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Send, Clock, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";

const STATUSES = ["pending", "accepted", "meeting_set", "declined"] as const;
const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "bg-primary/10 text-primary" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "bg-feature-green/10 text-feature-green" },
  meeting_set: { label: "Meeting Set", icon: CalendarCheck, color: "bg-feature-blue/10 text-feature-blue" },
  declined: { label: "Declined", icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

interface IntroRequest {
  id: string;
  founder_id: string;
  status: string;
  message: string | null;
  created_at: string;
  founder_name: string | null;
  company_name: string | null;
}

export default function VCIntros() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<IntroRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntros = async () => {
    if (!user) return;
    const { data: intros } = await supabase
      .from("vc_intro_requests")
      .select("id, founder_id, status, message, created_at")
      .eq("vc_user_id", user.id)
      .order("created_at", { ascending: false });

    if (!intros || intros.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const founderIds = intros.map(i => i.founder_id);
    const [{ data: profiles }, { data: profileNames }] = await Promise.all([
      (supabase.from("founder_profiles") as any).select("founder_id, company_name").in("founder_id", founderIds),
      supabase.from("profiles").select("id, full_name").in("id", founderIds),
    ]);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.founder_id, p]));
    const nameMap = new Map((profileNames ?? []).map((p: any) => [p.id, p.full_name]));

    const merged: IntroRequest[] = intros.map(i => ({
      ...i,
      founder_name: nameMap.get(i.founder_id) ?? null,
      company_name: (profileMap.get(i.founder_id) as any)?.company_name ?? null,
    }));

    setItems(merged);
    setLoading(false);
  };

  useEffect(() => { fetchIntros(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("vc_intro_requests").update({ status }).eq("id", id);
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    toast({ title: `Status updated to ${STATUS_CONFIG[status]?.label}` });
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = items.filter(i => i.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <VCDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intro Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage founder introduction requests.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <Card key={s}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cfg.color}`}><Icon className="h-4 w-4" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{counts[s]}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Send className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No Intro Requests Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Request introductions from the Leaderboard by clicking a founder's bookmark icon, then come back here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map(item => {
                  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{item.founder_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{item.company_name || "—"}</p>
                          {item.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">"{item.message}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground hidden md:block">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Select value={item.status} onValueChange={v => updateStatus(item.id, v)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VCDashboardLayout>
  );
}
