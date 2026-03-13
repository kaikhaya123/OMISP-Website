import { useState } from "react";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Building2,
  Globe,
  Users,
  DollarSign,
  Rocket,
  Award,
  Upload,
  Loader2,
  FileText,
  Image as ImageIcon,
  X,
  TrendingUp,
} from "lucide-react";

// Milestone types aligned with new schema CHECK constraint
const milestoneTypes = [
  { value: "registered",      label: "Company Registered",    icon: Building2,  points: 1 },
  { value: "website",         label: "Website Launched",       icon: Globe,      points: 1 },
  { value: "first_customer",  label: "First Customer",         icon: Users,      points: 2 },
  { value: "revenue",         label: "Revenue Milestone",      icon: DollarSign, points: 2 },
  { value: "team",            label: "Team Milestone",         icon: Rocket,     points: 1 },
  { value: "funding",         label: "Funding Raised",         icon: Award,      points: 2 },
];

interface MilestoneLoggingProps {
  onMilestoneAdd?: () => void;
  founderId?: string; // = auth user id in new schema
}

const MilestoneLogging = ({ onMilestoneAdd, founderId: founderIdProp }: MilestoneLoggingProps) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [proofName, setProofName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<{ title: string; delta: number }>({ title: "", delta: 0 });
  const { toast } = useToast();

  const reset = () => {
    setSelectedType("");
    setNotes("");
    setExtraValue("");
    setProofUrl("");
    setProofName("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10 MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop();
      const path = `milestones/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("founder-uploads")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("founder-uploads").getPublicUrl(path);

      setProofUrl(publicUrl);
      setProofName(file.name);
      toast({ title: "Proof uploaded ✓", description: file.name });
    } catch (err) {
      console.error("Upload error:", err);
      toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast({ title: "Select a milestone type", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // In the new schema founder_id on milestones = auth user id directly
      const founderId = founderIdProp ?? user.id;

      // Snapshot old score
      const { data: oldScore } = await (supabase.from("omisp_scores") as any)
        .select("total_score")
        .eq("founder_id", founderId)
        .maybeSingle();

      // Insert milestone — value field stores notes/extra context
      const { error: insertError } = await (supabase.from("milestones") as any).insert({
        founder_id: founderId,
        type: selectedType,
        value: extraValue || notes || null,
        proof_url: proofUrl || null,
      });
      if (insertError) throw insertError;

      onMilestoneAdd?.();

      await new Promise(r => setTimeout(r, 1200));

      const { data: newScore } = await (supabase.from("omisp_scores") as any)
        .select("total_score")
        .eq("founder_id", founderId)
        .maybeSingle();

      const oldTotal = oldScore?.total_score ?? 0;
      const newTotal = newScore?.total_score ?? 0;
      const delta = Math.round((newTotal - oldTotal) * 10) / 10;
      const milestoneTypeObj = milestoneTypes.find(m => m.value === selectedType);

      toast({
        title: delta > 0 ? `🎉 +${delta} pts — Score updated!` : "✅ Milestone logged!",
        description: delta > 0
          ? `New total: ${Math.round(newTotal)}/100${proofUrl ? " — proof attached." : ""}`
          : `Milestone recorded.${proofUrl ? " Proof attached." : ""}`,
      });

      setUpgradeContext({ title: milestoneTypeObj?.label ?? "Milestone", delta });
      setOpen(false);
      reset();
      setTimeout(() => setShowUpgrade(true), 400);
    } catch (err) {
      console.error("Milestone submit error:", err);
      toast({
        title: "Failed to log milestone",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    return ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
      ? <ImageIcon className="w-4 h-4" />
      : <FileText className="w-4 h-4" />;
  };

  const needsExtraInput = ["revenue", "funding"].includes(selectedType);

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Log Milestone
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Real-World Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Milestone Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select milestone…" />
              </SelectTrigger>
              <SelectContent>
                {milestoneTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <span>{type.label}</span>
                      <span className="text-primary text-xs ml-1">+{type.points} pts</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsExtraInput && (
            <div className="space-y-2">
              <Label>Amount / Details (optional)</Label>
              <Input
                placeholder={selectedType === "revenue" ? "e.g., $75,000 MRR" : "e.g., $500,000 raised"}
                value={extraValue}
                onChange={(e) => setExtraValue(e.target.value)}
              />
            </div>
          )}

          {selectedType === "website" && (
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input placeholder="https://yourcompany.com" value={extraValue} onChange={(e) => setExtraValue(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any context about this milestone…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Proof Upload{" "}
              <span className="text-muted-foreground text-xs">(recommended — required for verification)</span>
            </Label>
            {proofUrl ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {getFileIcon(proofName)}
                <span className="flex-1 text-sm truncate">{proofName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => { setProofUrl(""); setProofName(""); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  id="proof-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label htmlFor="proof-upload" className="cursor-pointer block">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isUploading ? "Uploading…" : "Upload screenshot, bank statement, or PDF"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Max 10 MB · JPG, PNG, PDF</p>
                </label>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Verified milestones are highlighted to VCs and boost your score further.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full gap-2"
            disabled={isUploading || isSubmitting || !selectedType}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              "Submit Milestone"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <UpgradePrompt
      open={showUpgrade}
      onClose={() => setShowUpgrade(false)}
      trigger="milestone"
      milestoneTitle={upgradeContext.title}
      scoreGain={upgradeContext.delta}
    />
    </>
  );
};

export default MilestoneLogging;
