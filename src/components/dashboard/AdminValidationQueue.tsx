import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  Building2,
  Globe,
  Users,
  DollarSign,
  Rocket,
  Award,
  Loader2,
  FileText,
  Image as ImageIcon,
  LucideIcon,
} from "lucide-react";

interface MilestoneWithFounder {
  id: string;
  founder_id: string;
  type: string;
  value: string | null;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  founder_profile: {
    company_name: string | null;
  } | null;
}

interface RawMilestoneRow {
  id: string;
  founder_id: string;
  type: string;
  value: string | null;
  proof_url: string | null;
  created_at: string;
  founder_profile: {
    company_name: string | null;
  } | null;
  status?: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
}

interface MilestoneValidationUpdate {
  status: "approved" | "rejected";
  admin_notes: string | null;
  validated_at: string;
  validated_by: string;
}

interface MilestonesUpdateBridge {
  update: (
    values: MilestoneValidationUpdate,
  ) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
}

const milestoneIcons: Record<string, LucideIcon> = {
  registered: Building2,
  website: Globe,
  first_customer: Users,
  revenue: DollarSign,
  team: Rocket,
  funding: Award,
};

const milestoneLabels: Record<string, string> = {
  registered: "Company Registered",
  website: "Website Launched",
  first_customer: "First Customer",
  revenue: "Revenue Milestone",
  team: "Team Milestone",
  funding: "Funding Raised",
};

const AdminValidationQueue = () => {
  const [milestones, setMilestones] = useState<MilestoneWithFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneWithFounder | null>(null);
  const [validationNotes, setValidationNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const { toast } = useToast();

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      // Query without status filter first (types don't include status yet)
      const { data, error } = await supabase
        .from("milestones")
        .select(`
          id,
          founder_id,
          type,
          value,
          proof_url,
          created_at,
          founder_profile:founder_profiles!founder_id (
            company_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Cast and add status from raw response (until types are regenerated)
      const rawMilestones = ((data ?? []) as unknown as RawMilestoneRow[]);
      const milestonesWithStatus = rawMilestones.map((milestone): MilestoneWithFounder => ({
        ...milestone,
        status: milestone.status ?? 'pending',
        admin_notes: milestone.admin_notes ?? null,
      }));

      // Apply client-side filtering if needed
      const filtered = filterStatus === 'all' 
        ? milestonesWithStatus 
        : milestonesWithStatus.filter(m => m.status === filterStatus);

      setMilestones(filtered);
    } catch (err) {
      console.error("Error fetching milestones:", err);
      toast({ title: "Error", description: "Failed to load milestones", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [filterStatus, toast]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleValidate = async (milestoneId: string, newStatus: 'approved' | 'rejected') => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Bridge generated types until Supabase types include validation columns.
      const updateBridge = supabase.from("milestones") as unknown as MilestonesUpdateBridge;
      const updatePayload: MilestoneValidationUpdate = {
        status: newStatus,
        admin_notes: validationNotes || null,
        validated_at: new Date().toISOString(),
        validated_by: user.id,
      };

      const { error } = await updateBridge.update(updatePayload).eq('id', milestoneId);

      if (error) throw error;

      toast({
        title: newStatus === 'approved' ? "✅ Milestone Approved" : "❌ Milestone Rejected",
        description: `Successfully ${newStatus === 'approved' ? 'approved' : 'rejected'} the milestone.`,
      });

      setSelectedMilestone(null);
      setValidationNotes("");
      fetchMilestones();
    } catch (err) {
      console.error("Validation error:", err);
      toast({ title: "Error", description: "Failed to validate milestone", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    }
  };

  const getFileIcon = (url: string | null) => {
    if (!url) return <FileText className="w-4 h-4" />;
    const ext = url.split('.').pop()?.toLowerCase() ?? '';
    return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
      ? <ImageIcon className="w-4 h-4" />
      : <FileText className="w-4 h-4" />;
  };

  const pendingCount = milestones.filter(m => m.status === 'pending').length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Milestone Validation Queue</CardTitle>
              <CardDescription className="mt-1">
                Review and approve founder milestone submissions
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
              {pendingCount} Pending
            </Badge>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-4">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status}
                {status === 'pending' && pendingCount > 0 && (
                  <Badge className="ml-2 bg-yellow-600 text-white">{pendingCount}</Badge>
                )}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No {filterStatus !== 'all' ? filterStatus : ''} milestones found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone) => {
                const Icon = milestoneIcons[milestone.type] || FileText;
                const label = milestoneLabels[milestone.type] || milestone.type;
                const companyName = milestone.founder_profile?.company_name || "Unknown Company";

                return (
                  <div
                    key={milestone.id}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{label}</h4>
                            {getStatusBadge(milestone.status)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {companyName} • {new Date(milestone.created_at).toLocaleDateString()}
                          </p>
                          
                          {milestone.value && (
                            <p className="text-sm mb-2">
                              <span className="text-muted-foreground">Details:</span> {milestone.value}
                            </p>
                          )}

                          {milestone.admin_notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <span className="font-medium">Admin Notes:</span> {milestone.admin_notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {milestone.proof_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={milestone.proof_url} target="_blank" rel="noopener noreferrer">
                              {getFileIcon(milestone.proof_url)}
                              <span className="ml-1">View Proof</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        )}

                        {milestone.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setValidationNotes("");
                            }}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Dialog */}
      <Dialog open={!!selectedMilestone} onOpenChange={(open) => !open && setSelectedMilestone(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Milestone</DialogTitle>
          </DialogHeader>

          {selectedMilestone && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">
                  {milestoneLabels[selectedMilestone.type] || selectedMilestone.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedMilestone.founder_profile?.company_name || "Unknown Company"}
                </p>
                {selectedMilestone.value && (
                  <p className="text-sm mt-2">{selectedMilestone.value}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes (optional)</label>
                <Textarea
                  placeholder="Add feedback or reason for rejection..."
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-500/20 text-red-600 hover:bg-red-500/10"
                  onClick={() => handleValidate(selectedMilestone.id, 'rejected')}
                  disabled={submitting}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleValidate(selectedMilestone.id, 'approved')}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminValidationQueue;
