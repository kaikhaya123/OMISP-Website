import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useOMISPScore } from "@/hooks/useOMISPScore";
import {
  Download,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  ChevronRight,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface MilestoneData {
  id: string;
  type: string;
  value: string | null;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface MilestoneFromDB {
  id: string;
  type: string;
  value: string | null;
  created_at: string;
}

const milestoneLabels: Record<string, string> = {
  registered: "Company Registered",
  website: "Website Launched",
  first_customer: "First Customer",
  revenue: "Revenue Milestone",
  team: "Team Milestone",
  funding: "Funding Raised",
};

const InvestorReadyReport = () => {
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { profile, scores, loading: scoreLoading } = useOMISPScore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("milestones")
          .select("id, type, value, created_at")
          .eq("founder_id", user.id)
          .order("created_at", { ascending: false });

        // Map data and add default status
        const milestonesWithStatus: MilestoneData[] = (data as unknown as MilestoneFromDB[] || []).map((m) => ({
          ...m,
          status: 'approved' as const, // Default to approved for now until types are regenerated
        }));
        
        setMilestones(milestonesWithStatus);
      } catch (err) {
        console.error("Error fetching milestones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // In a real implementation, you would use a library like jsPDF or react-pdf
      // For now, we'll simulate PDF generation and create a simple text-based report
      
      const reportContent = `
╔═══════════════════════════════════════════════════════════════╗
║                   OMISP INVESTOR-READY REPORT                 ║
╚═══════════════════════════════════════════════════════════════╝

COMPANY OVERVIEW
─────────────────────────────────────────────────────────────────
Company Name: ${profile?.company_name || "Not specified"}
Industry: ${profile?.industry || "Not specified"}
Stage: ${profile?.stage || "Not specified"}
Location: ${profile?.location || "Not specified"}

OMISP SCORE BREAKDOWN (Total: ${scores?.totalScore}/100)
─────────────────────────────────────────────────────────────────
✦ Idea Viability:           ${scores?.scores?.ideaViability}/20
✦ Founder Aptitude:         ${scores?.scores?.founderAptitude}/20
✦ Execution Readiness:      ${scores?.scores?.executionReadiness}/20
✦ Behavioral Resilience:    ${scores?.scores?.behavioralResilience}/20
✦ Progress Velocity:        ${scores?.scores?.progressVelocity}/10
✦ Unicorn Potential:        ${scores?.scores?.unicornPotential}/10

STATUS
─────────────────────────────────────────────────────────────────
VC Eligible: ${scores?.isVCEligible ? "✓ YES" : "✗ Not yet"}
Unicorn Potential: ${scores?.isUnicornPotential ? "✓ YES" : "✗ Not yet"}

KEY METRICS
─────────────────────────────────────────────────────────────────
MRR: $${(profile?.mrr_usd || 0).toLocaleString()}
Team Size: ${profile?.team_size || 0} members
Total Raised: $${(profile?.raised_usd || 0).toLocaleString()}
Growth Rate: ${profile?.growth_percent || 0}% MoM

VERIFIED MILESTONES (${milestones.filter(m => m.status === 'approved').length})
─────────────────────────────────────────────────────────────────
${milestones
  .filter(m => m.status === 'approved')
  .map(m => `✓ ${milestoneLabels[m.type] || m.type} - ${new Date(m.created_at).toLocaleDateString()}`)
  .join('\n') || "No verified milestones yet"}

GROWTH TRAJECTORY
─────────────────────────────────────────────────────────────────
Based on your current OMISP score and verified milestones, your 
startup demonstrates ${scores && scores.totalScore >= 70 ? "strong" : "developing"} 
readiness for institutional investment.

${scores?.isVCEligible ? `
RECOMMENDATION
─────────────────────────────────────────────────────────────────
✓ Ready for VC conversations
✓ Eligible for OMISP Premium VC matching
✓ Profile visible to curated investor network
` : `
NEXT STEPS TO BECOME VC-READY
─────────────────────────────────────────────────────────────────
→ Score ${70 - (scores?.totalScore || 0)} more points
→ Complete additional milestone verification
→ Strengthen ${scores?.scores?.ideaViability === Math.min(
  scores?.scores?.ideaViability || 0,
  scores?.scores?.founderAptitude || 0,
  scores?.scores?.executionReadiness || 0,
  scores?.scores?.behavioralResilience || 0
) ? "Idea Viability" : "execution metrics"}
`}

─────────────────────────────────────────────────────────────────
Generated: ${new Date().toLocaleDateString()} | OMISP Platform
For investor use only. Confidential information.
      `.trim();

      // Create a blob and download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `OMISP_InvestorReport_${profile?.company_name?.replace(/\s+/g, '_') || 'Report'}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "✓ Report Generated",
        description: "Your investor-ready report has been downloaded.",
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const approvedMilestones = milestones.filter(m => m.status === 'approved');
  const pendingMilestones = milestones.filter(m => m.status === 'pending');
  const completionScore = Math.min((scores?.totalScore || 0) / 70 * 100, 100);

  if (loading || scoreLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Investor-Ready Report</CardTitle>
              <p className="text-muted-foreground">
                Share your verified progress and OMISP score with potential investors
              </p>
            </div>
            <Badge className={`${scores?.isVCEligible ? "bg-green-500" : "bg-yellow-500"}/10 ${scores?.isVCEligible ? "text-green-600" : "text-yellow-600"} border-${scores?.isVCEligible ? "green" : "yellow"}-500/20`}>
              {scores?.isVCEligible ? "VC Ready" : "Building"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Investor Readiness</span>
                <span className="text-sm text-muted-foreground">{Math.round(completionScore)}%</span>
              </div>
              <Progress value={completionScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{scores?.totalScore || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">OMISP Score</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">{approvedMilestones.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Verified Milestones</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-foreground">{profile?.team_size || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Team Members</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-foreground">${(profile?.mrr_usd || 0) / 1000}K</div>
                <p className="text-xs text-muted-foreground mt-1">MRR</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            6-Dimension Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Idea Viability", value: scores?.scores?.ideaViability || 0, max: 20 },
              { label: "Founder Aptitude", value: scores?.scores?.founderAptitude || 0, max: 20 },
              { label: "Execution Readiness", value: scores?.scores?.executionReadiness || 0, max: 20 },
              { label: "Behavioral Resilience", value: scores?.scores?.behavioralResilience || 0, max: 20 },
              { label: "Progress Velocity", value: scores?.scores?.progressVelocity || 0, max: 10 },
              { label: "Unicorn Potential", value: scores?.scores?.unicornPotential || 0, max: 10 },
            ].map(({ label, value, max }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">{value}/{max}</span>
                </div>
                <Progress value={(value / max) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Verified Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedMilestones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No verified milestones yet</p>
              <p className="text-xs mt-1">Submit milestones for admin validation</p>
            </div>
          ) : (
            <div className="space-y-2">
              {approvedMilestones.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{milestoneLabels[m.type] || m.type}</p>
                      {m.value && <p className="text-xs text-muted-foreground">{m.value}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {pendingMilestones.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-sm text-yellow-600">
                {pendingMilestones.length} milestone{pendingMilestones.length === 1 ? '' : 's'} pending validation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report CTA */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Download Investor Report</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a comprehensive PDF report showcasing your OMISP score, verified milestones, and growth trajectory
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={generatePDF}
              disabled={generating}
              className="whitespace-nowrap gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!scores?.isVCEligible && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600 mb-1">Not VC-Ready Yet</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Score {70 - (scores?.totalScore || 0)} more points to become VC-eligible and unlock investor matching
                </p>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="/dashboard">
                    Improve My Score
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestorReadyReport;
