import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

interface VCInterestStats {
  views_last_7_days: number;
  views_last_30_days: number;
  total_views: number;
  watchlist_count: number;
  intro_request_count: number;
}

interface RecentView {
  created_at: string;
  vc_profile?: {
    firm_name: string | null;
  } | null;
}

const VCInterestWidget = () => {
  const [stats, setStats] = useState<VCInterestStats | null>(null);
  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterestStats = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch all investor views
        const { data: allViews } = await supabase
          .from("investor_views")
          .select("created_at")
          .eq('founder_id', user.id);

        const views = allViews || [];
        const views7d = views.filter(v => new Date(v.created_at) >= sevenDaysAgo).length;
        const views30d = views.filter(v => new Date(v.created_at) >= thirtyDaysAgo).length;

        // Fetch watchlist count
        const { data: watchlistData } = await supabase
          .from("vc_watchlist")
          .select("id", { count: 'exact', head: true })
          .eq('founder_id', user.id);

        const watchlistCount = watchlistData?.length || 0;

        // Fetch intro requests count
        const { data: introData } = await supabase
          .from("vc_intro_requests")
          .select("id", { count: 'exact', head: true })
          .eq('founder_id', user.id);

        const introCount = introData?.length || 0;

        setStats({
          views_last_7_days: views7d,
          views_last_30_days: views30d,
          total_views: views.length,
          watchlist_count: watchlistCount,
          intro_request_count: introCount,
        });

        // Fetch recent profile views with VC info
        const { data: viewsData } = await supabase
          .from("investor_views")
          .select("created_at, investor_id")
          .eq('founder_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch VC profiles for recent views
        if (viewsData && viewsData.length > 0) {
          const vcIds = viewsData.map(v => v.investor_id);
          const { data: vcProfiles } = await supabase
            .from("vc_profiles")
            .select("id, firm_name")
            .in('id', vcIds);

          const vcMap = new Map(vcProfiles?.map(vc => [vc.id, vc]) || []);
          
          const formattedViews: RecentView[] = viewsData.map(view => ({
            created_at: view.created_at,
            vc_profile: {
              firm_name: vcMap.get(view.investor_id)?.firm_name || null,
            },
          }));

          setRecentViews(formattedViews);
        } else {
          setRecentViews([]);
        }
      } catch (err) {
        console.error("Error fetching VC interest:", err);
        toast({ 
          title: "Error", 
          description: "Failed to load VC interest data", 
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterestStats();
  }, [toast]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const hasActivity = stats && (stats.total_views > 0 || stats.watchlist_count > 0 || stats.intro_request_count > 0);
  const weeklyTrend = stats && stats.views_last_7_days > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">VC Interest</CardTitle>
          </div>
          {weeklyTrend && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!hasActivity ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">No VC activity yet</p>
            <p className="text-xs text-muted-foreground/70">
              Keep improving your score to attract investor attention
            </p>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats?.views_last_7_days || 0}
                </div>
                <p className="text-xs text-muted-foreground">Views (7d)</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats?.watchlist_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Watchlist</p>
              </div>

              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats?.intro_request_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Intros</p>
              </div>
            </div>

            {/* Recent views */}
            {recentViews.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent Views</p>
                <div className="space-y-2">
                  {recentViews.slice(0, 3).map((view, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Eye className="w-3 h-3 text-primary" />
                      </div>
                      <span className="flex-1 truncate text-muted-foreground">
                        {view.vc_profile?.firm_name || "VC Investor"}
                      </span>
                      <span className="text-muted-foreground/60 shrink-0">
                        {new Date(view.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade hint */}
            {stats && stats.intro_request_count > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {stats.intro_request_count} {stats.intro_request_count === 1 ? 'VC wants' : 'VCs want'} to connect!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upgrade to Premium to receive direct introductions
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VCInterestWidget;
