import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Building2, Globe, Users, DollarSign, TrendingUp,
  Award, Lightbulb, ChevronRight, Loader2, CheckCircle2
} from "lucide-react";

const INDUSTRIES = [
  "SaaS", "AI/ML", "Fintech", "Healthtech", "E-commerce",
  "DevTools", "Climate", "EdTech", "Marketplace", "Consumer",
  "B2B", "Web3", "Hardware", "Other",
];

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Traction", icon: TrendingUp },
  { id: 3, label: "Background", icon: Award },
];

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Step 1 – Company
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyRegisteredDate, setCompanyRegisteredDate] = useState("");
  const [websiteLaunchedDate, setWebsiteLaunchedDate] = useState("");

  // Step 2 – Traction
  const [currentMrr, setCurrentMrr] = useState("");
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState("");
  const [teamSize, setTeamSize] = useState("1");
  const [totalFundingRaised, setTotalFundingRaised] = useState("");
  const [firstCustomerDate, setFirstCustomerDate] = useState("");

  // Step 3 – Background
  const [fullName, setFullName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [previousExits, setPreviousExits] = useState("0");
  const [hasAdvancedDegree, setHasAdvancedDegree] = useState(false);
  const [pivotsCount, setPivotsCount] = useState("0");

  // Prefill from DB
  useEffect(() => {
    if (!user) return;
    (async () => {
    const { data } = await (supabase.from("founder_profiles") as any)
        .select("*")
        .eq("founder_id", user.id)
        .maybeSingle();
      if (data) {
        setCompanyName(data.company_name ?? "");
        setWebsiteUrl(data.logo_url ?? "");
        setIndustry(data.industry ?? "");
        setCompanyRegisteredDate(data.updated_at?.split("T")[0] ?? "");
        setWebsiteLaunchedDate("");
        setCurrentMrr(String(data.mrr_usd ?? ""));
        setMonthlyGrowthRate(String(data.growth_percent ?? ""));
        setTeamSize(String(data.team_size ?? 1));
        setTotalFundingRaised(String(data.raised_usd ?? ""));
        setFirstCustomerDate("");
        setFullName(user.user_metadata?.full_name ?? "");
        setYearsExperience("");
        setPreviousExits("0");
        setHasAdvancedDegree(false);
        setPivotsCount("0");
      } else {
        setFullName(user.user_metadata?.full_name ?? "");
      }
      setLoadingProfile(false);
    })();
  }, [user]);

  const save = async (redirectTo: string) => {
    if (!user) return;
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("founder_profiles") as any).upsert(
      {
        id: user.id,
        full_name: fullName || null,
        company_name: companyName || null,
        website_url: websiteUrl || null,
        industry_experience: industry || null,
        company_registered_date: companyRegisteredDate || null,
        website_launched_date: websiteLaunchedDate || null,
        first_customer_date: firstCustomerDate || null,
        current_mrr: currentMrr ? parseFloat(currentMrr) : 0,
        monthly_growth_rate: monthlyGrowthRate ? parseFloat(monthlyGrowthRate) : 0,
        team_size: parseInt(teamSize) || 1,
        total_funding_raised: totalFundingRaised ? parseFloat(totalFundingRaised) : 0,
        years_experience: yearsExperience ? parseInt(yearsExperience) : 0,
        previous_exits: parseInt(previousExits) || 0,
        has_advanced_degree: hasAdvancedDegree,
        pivots_count: parseInt(pivotsCount) || 0,
      },
      { onConflict: "id" }
    );
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved ✓" });
      navigate(redirectTo);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo/Omisp.png" alt="OMISP" className="w-7 h-7 object-contain" />
            <span className="font-tanker font-semibold text-foreground">OMISP</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground text-xs">
            Skip for now →
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-1">Set up your founder profile</h1>
            <p className="text-sm text-muted-foreground">This data powers your OMISP Score and VC visibility</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.map((s, idx) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      done ? "bg-primary text-primary-foreground"
                           : active ? "bg-primary/10 border-2 border-primary text-primary"
                                    : "bg-muted text-muted-foreground border-2 border-border"
                    }`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mb-5 mx-1 transition-all ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1 – Company */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Company Details</h2>
              </div>

              <div className="space-y-1.5">
                <Label>Your Full Name</Label>
                <Input placeholder="Jane Smith" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>Company Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Acme Corp" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="https://yourcompany.com" className="pl-9" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue placeholder="Select industry…" /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Company Founded</Label>
                  <Input type="date" value={companyRegisteredDate} onChange={e => setCompanyRegisteredDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website Launched</Label>
                  <Input type="date" value={websiteLaunchedDate} onChange={e => setWebsiteLaunchedDate(e.target.value)} />
                </div>
              </div>

              <Button
                className="w-full gap-2 mt-2"
                disabled={!companyName}
                onClick={() => setStep(2)}
              >
                Next: Traction <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2 – Traction */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Traction & Metrics</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monthly Recurring Revenue ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" min="0" placeholder="0" className="pl-9" value={currentMrr} onChange={e => setCurrentMrr(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Monthly Growth Rate (%)</Label>
                  <Input type="number" min="0" max="200" placeholder="0" value={monthlyGrowthRate} onChange={e => setMonthlyGrowthRate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Team Size</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" min="1" placeholder="1" className="pl-9" value={teamSize} onChange={e => setTeamSize(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Total Funding Raised ($)</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" min="0" placeholder="0" className="pl-9" value={totalFundingRaised} onChange={e => setTotalFundingRaised(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>First Customer Date</Label>
                <Input type="date" value={firstCustomerDate} onChange={e => setFirstCustomerDate(e.target.value)} />
              </div>

              <div className="flex gap-3 mt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button className="flex-1 gap-2" onClick={() => setStep(3)}>
                  Next: Background <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 – Background */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Founder Background</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Years of Experience</Label>
                  <Input type="number" min="0" placeholder="0" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Previous Exits</Label>
                  <Input type="number" min="0" placeholder="0" value={previousExits} onChange={e => setPreviousExits(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Number of Strategic Pivots</Label>
                <Input type="number" min="0" placeholder="0" value={pivotsCount} onChange={e => setPivotsCount(e.target.value)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Advanced Degree</p>
                  <p className="text-xs text-muted-foreground">PhD, MBA, or equivalent</p>
                </div>
                <Switch checked={hasAdvancedDegree} onCheckedChange={setHasAdvancedDegree} />
              </div>

              {/* Score preview */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">🎯 Score Impact Preview</p>
                <ul className="space-y-1 text-xs">
                  {companyRegisteredDate && <li className="text-primary">✓ Company registered → +5 pts to Execution</li>}
                  {websiteUrl && <li className="text-primary">✓ Website → +5 pts to Execution</li>}
                  {firstCustomerDate && <li className="text-primary">✓ First customer → +10 pts to Execution</li>}
                  {parseFloat(currentMrr) > 0 && <li className="text-primary">✓ Revenue → up to +15 pts to Unicorn</li>}
                  {parseInt(teamSize) >= 3 && <li className="text-primary">✓ Team size → up to +5 pts</li>}
                  {parseFloat(totalFundingRaised) > 0 && <li className="text-primary">✓ Funding → up to +10 pts to Aptitude</li>}
                  {parseInt(previousExits) > 0 && <li className="text-primary">✓ Previous exit → +3 pts to Aptitude</li>}
                </ul>
              </div>

              <div className="flex gap-3 mt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button
                  className="flex-1 gap-2"
                  disabled={saving}
                  onClick={() => save("/dashboard")}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Saving…" : "Save & Go to Dashboard"}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
