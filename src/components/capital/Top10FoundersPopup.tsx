import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  TrendingUp, 
  Heart, 
  Mail,
  Sparkles,
  X,
  Building2,
  DollarSign,
  Users
} from "lucide-react";

interface Founder {
  name: string;
  company: string;
  score: number;
  category: string;
  mrr: string;
  growth: string;
  team: number;
  image: string;
  badges: string[];
}

interface Top10FoundersPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  founders: Founder[];
  onSaveFounder: (index: number) => void;
}

const Top10FoundersPopup = ({ open, onOpenChange, founders, onSaveFounder }: Top10FoundersPopupProps) => {
  const top10 = founders
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            Top 10 Founders This Month
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground mb-6">
          The highest-scoring founders who have made significant progress in the past 30 days. 
          Don't miss out on the next unicorn.
        </p>

        <div className="space-y-4">
          {top10.map((founder, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-500 text-yellow-950' :
                index === 1 ? 'bg-gray-300 text-gray-700' :
                index === 2 ? 'bg-amber-600 text-amber-950' :
                'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>

              {/* Avatar */}
              <img
                src={founder.image}
                alt={founder.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground truncate">{founder.name}</h4>
                  {founder.badges.includes("Unicorn Potential") && (
                    <span className="text-lg">🦄</span>
                  )}
                </div>
                <p className="text-sm text-primary truncate">{founder.company}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {founder.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {founder.mrr}
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    {founder.growth}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{founder.score}</p>
                <p className="text-xs text-muted-foreground">OMISP Score</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onSaveFounder(index)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" className="gap-1">
                  <Mail className="w-3 h-3" />
                  Intro
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Premium members get 48-hour exclusive first look at top founders
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Top10FoundersPopup;
