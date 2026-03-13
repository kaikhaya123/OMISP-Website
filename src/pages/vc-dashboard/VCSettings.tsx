import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Bell, Save } from "lucide-react";
import VCDashboardLayout from "@/components/vc-dashboard/VCDashboardLayout";

export default function VCSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile
  const [firmName, setFirmName] = useState("");
  const [fundSize, setFundSize] = useState("");
  const [bio, setBio] = useState("");
  const [industries, setIndustries] = useState("");
  const [stageFocus, setStageFocus] = useState("");

  // Alerts
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [minScoreAlert, setMinScoreAlert] = useState(60);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const [{ data: profile }, { data: alerts }] = await Promise.all([
        supabase.from("vc_profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("vc_alert_preferences").select("*").eq("vc_user_id", user.id).maybeSingle(),
      ]);
      if (profile) {
        setFirmName(profile.firm_name || "");
        setFundSize(profile.fund_size || "");
        setBio(profile.bio || "");
        setIndustries((profile.industries || []).join(", "));
        setStageFocus((profile.investment_stage_focus || []).join(", "));
      }
      if (alerts) {
        setAlertsEnabled(alerts.enabled ?? true);
        setMinScoreAlert(Number(alerts.min_score) || 60);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const profileData = {
      id: user.id,
      user_id: user.id,
      firm_name: firmName || null,
      fund_size: fundSize || null,
      bio: bio || null,
      industries: industries.split(",").map(s => s.trim()).filter(Boolean),
      investment_stage_focus: stageFocus.split(",").map(s => s.trim()).filter(Boolean),
    };

    // Upsert profile on id
    await supabase.from("vc_profiles").upsert(profileData, { onConflict: "id" });

    // Upsert alert prefs
    const alertData = {
      vc_user_id: user.id,
      enabled: alertsEnabled,
      min_score: minScoreAlert,
    };
    const { data: existingAlert } = await supabase.from("vc_alert_preferences").select("id").eq("vc_user_id", user.id).maybeSingle();
    if (existingAlert) {
      await supabase.from("vc_alert_preferences").update(alertData).eq("vc_user_id", user.id);
    } else {
      await supabase.from("vc_alert_preferences").insert(alertData);
    }

    toast({ title: "Settings saved!" });
    setSaving(false);
  };

  if (loading) {
    return <VCDashboardLayout><div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div></VCDashboardLayout>;
  }

  return (
    <VCDashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your VC profile and alert preferences.</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              VC Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Firm Name</label>
              <Input value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="Acme Ventures" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Fund Size</label>
              <Input value={fundSize} onChange={e => setFundSize(e.target.value)} placeholder="e.g. $50M" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Brief description of your investment thesis..." rows={3} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Industries (comma-separated)</label>
              <Input value={industries} onChange={e => setIndustries(e.target.value)} placeholder="SaaS, FinTech, HealthTech" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Stage Focus (comma-separated)</label>
              <Input value={stageFocus} onChange={e => setStageFocus(e.target.value)} placeholder="Pre-Seed, Seed, Series A" />
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-feature-blue" />
              Alert Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Enable Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when new high-scoring founders appear.</p>
              </div>
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <Separator />
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Minimum Score Threshold: {minScoreAlert}</label>
              <Slider value={[minScoreAlert]} onValueChange={v => setMinScoreAlert(v[0])} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Only alert for founders scoring above this threshold.</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </VCDashboardLayout>
  );
}
