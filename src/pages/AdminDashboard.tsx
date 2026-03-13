import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, Building2, Trophy, Eye, TrendingUp, Sparkles,
  BarChart3, CheckCircle, Shield,
} from "lucide-react";

const ADMIN_EMAILS = ["admin@omisp.com", "hello@omisp.com"];

interface AdminStats {
  total_founders: number;
  total_investors: number;
  total_milestones: number;
  total_profile_views: number;
  avg_omisp_score: number;
  vc_eligible_founders: number;
  unicorn_candidates: number;
}

interface RecentFounder {
  founder_id: string;
  company_name: string | null;
  created_at: string;
}

interface RecentMilestone {
  id: string;
  type: string;
  created_at: string;
  founder_id: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentFounders, setRecentFounders] = useState<RecentFounder[]>([]);
  const [recentMilestones, setRecentMilestones] = useState<RecentMilestone[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isAdmin = !loading && !!user && ADMIN_EMAILS.includes(user.email ?? "");

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [statsResult, foundersResult, milestonesResult] = await Promise.all([
        supabase.rpc("get_admin_stats"),
        (supabase.from("founder_profiles") as any)
          .select("founder_id, company_name, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
        (supabase.from("milestones") as any)
          .select("id, type, created_at, founder_id")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (statsResult.data) {
        const row = Array.isArray(statsResult.data) ? statsResult.data[0] : statsResult.data;
        setStats({
          total_founders: Number(row.total_founders ?? 0),
          total_investors: Number(row.total_investors ?? 0),
          total_milestones: Number(row.total_milestones ?? 0),
          total_profile_views: Number(row.total_profile_views ?? 0),
          avg_omisp_score: Number(row.avg_omisp_score ?? 0),
          vc_eligible_founders: Number(row.vc_eligible_founders ?? 0),
          unicorn_candidates: Number(row.unicorn_candidates ?? 0),
        });
      }

      setRecentFounders((foundersResult.data ?? []) as RecentFounder[]);
      setRecentMilestones((milestonesResult.data ?? []) as RecentMilestone[]);
      setDataLoading(false);
    };
    load();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-muted-foreground text-sm mt-1">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Founders", value: stats?.total_founders, icon: Users, color: "text-blue-500" },
    { label: "Total Investors", value: stats?.total_investors, icon: Building2, color: "text-purple-500" },
    { label: "Milestones Logged", value: stats?.total_milestones, icon: Trophy, color: "text-yellow-500" },
    { label: "Profile Views", value: stats?.total_profile_views, icon: Eye, color: "text-green-500" },
    { label: "Avg OMISP Score", value: stats ? stats.avg_omisp_score.toFixed(1) : null, icon: BarChart3, color: "text-primary" },
    { label: "VC Eligible", value: stats?.vc_eligible_founders, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Unicorn Candidates", value: stats?.unicorn_candidates, icon: Sparkles, color: "text-yellow-400" },
    { label: "Conversion Rate", value: stats ? `${stats.total_founders > 0 ? ((stats.vc_eligible_founders / stats.total_founders) * 100).toFixed(0) : 0}%` : null, icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform overview and stats</p>
          </div>
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 border">Admin</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="bg-card border-border">
              <CardContent className="p-5">
                {dataLoading ? (
                  <Skeleton className="h-10 w-20 mb-2" />
                ) : (
                  <div className={`text-3xl font-bold ${color} mb-1`}>{value ?? 0}</div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Recent Founders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dataLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : recentFounders.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No founders yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentFounders.map(f => (
                    <div key={f.founder_id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {(f.company_name?.[0] ?? "F").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{f.company_name ?? "No company"}</p>
                        <p className="text-xs text-muted-foreground truncate">{new Date(f.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Recent Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dataLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : recentMilestones.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No milestones yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentMilestones.map(m => (
                    <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm capitalize truncate">{m.type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
