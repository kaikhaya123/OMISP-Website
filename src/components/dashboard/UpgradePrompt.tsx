import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, ChevronRight, TrendingUp, Eye, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  trigger?: "milestone" | "view_limit" | "feature";
  milestoneTitle?: string;
  scoreGain?: number;
}

const BENEFITS = [
  { icon: Eye, label: "Guaranteed VC visibility to 5–10 curated investors monthly" },
  { icon: BarChart3, label: "AI-generated investor report & pitch summary" },
  { icon: TrendingUp, label: "Priority placement in the OMISP Capital leaderboard" },
  { icon: Zap, label: "Real-time alerts when VCs view or favourite your profile" },
];

export default function UpgradePrompt({ open, onClose, trigger = "milestone", milestoneTitle, scoreGain }: UpgradePromptProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Crown className="w-5 h-5 text-primary" />
            {trigger === "milestone" ? "🎉 Milestone Logged!" : "Upgrade to Pro"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {trigger === "milestone" && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
              <p className="font-medium text-foreground">
                {milestoneTitle ?? "Milestone achieved"}
                {scoreGain != null && scoreGain > 0 && (
                  <span className="text-primary ml-2">+{scoreGain} pts</span>
                )}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Your profile is getting stronger. Upgrade to make sure investors see it.
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Premium founders get direct visibility to VCs and unlock powerful tools to accelerate fundraising.
          </p>

          <ul className="space-y-2">
            {BENEFITS.map(b => (
              <li key={b.label} className="flex items-start gap-2.5 text-sm text-foreground">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-3 h-3 text-primary" />
                </div>
                {b.label}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 pt-1">
            <Link to="/pricing" className="flex-1" onClick={onClose}>
              <Button className="w-full gap-2">
                Upgrade Now <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose}>Not now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
