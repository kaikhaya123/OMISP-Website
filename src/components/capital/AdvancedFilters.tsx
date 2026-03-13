import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FilterValues {
  minScore: number;
  maxScore: number;
  stage: string;
  minMrr: string;
  minTeamSize: number;
  fundingRaised: string;
}

interface AdvancedFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  isPremium?: boolean;
}

const AdvancedFilters = ({ filters, onFiltersChange, isPremium = false }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onFiltersChange({
      minScore: 0,
      maxScore: 100,
      stage: "all",
      minMrr: "any",
      minTeamSize: 0,
      fundingRaised: "any",
    });
  };

  const hasActiveFilters = 
    filters.minScore > 0 || 
    filters.maxScore < 100 || 
    filters.stage !== "all" ||
    filters.minMrr !== "any" ||
    filters.minTeamSize > 0 ||
    filters.fundingRaised !== "any";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* OMISP Score Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">OMISP Score Range</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-8">{filters.minScore}</span>
              <Slider
                value={[filters.minScore, filters.maxScore]}
                min={0}
                max={100}
                step={5}
                onValueChange={([min, max]) => 
                  onFiltersChange({ ...filters, minScore: min, maxScore: max })
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">{filters.maxScore}</span>
            </div>
          </div>

          {/* Stage */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Funding Stage</Label>
            <Select
              value={filters.stage}
              onValueChange={(value) => onFiltersChange({ ...filters, stage: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="pre-seed">Pre-seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series-a">Series A</SelectItem>
                <SelectItem value="series-b">Series B+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum MRR - Premium Feature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Minimum MRR</Label>
              {!isPremium && (
                <span className="text-xs text-primary">Standard+</span>
              )}
            </div>
            <Select
              value={filters.minMrr}
              onValueChange={(value) => onFiltersChange({ ...filters, minMrr: value })}
              disabled={!isPremium}
            >
              <SelectTrigger className={!isPremium ? "opacity-50" : ""}>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="10k">$10K+</SelectItem>
                <SelectItem value="25k">$25K+</SelectItem>
                <SelectItem value="50k">$50K+</SelectItem>
                <SelectItem value="100k">$100K+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Size - Premium Feature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Minimum Team Size</Label>
              {!isPremium && (
                <span className="text-xs text-primary">Standard+</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-8">{filters.minTeamSize}</span>
              <Slider
                value={[filters.minTeamSize]}
                min={0}
                max={50}
                step={1}
                onValueChange={([value]) => 
                  onFiltersChange({ ...filters, minTeamSize: value })
                }
                className="flex-1"
                disabled={!isPremium}
              />
              <span className="text-sm text-muted-foreground w-8">50+</span>
            </div>
          </div>

          {/* Funding Raised - Premium Feature */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Funding Raised</Label>
              {!isPremium && (
                <span className="text-xs text-primary">Standard+</span>
              )}
            </div>
            <Select
              value={filters.fundingRaised}
              onValueChange={(value) => onFiltersChange({ ...filters, fundingRaised: value })}
              disabled={!isPremium}
            >
              <SelectTrigger className={!isPremium ? "opacity-50" : ""}>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="100k">$100K+</SelectItem>
                <SelectItem value="500k">$500K+</SelectItem>
                <SelectItem value="1m">$1M+</SelectItem>
                <SelectItem value="5m">$5M+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleReset} className="flex-1 gap-2">
              <X className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>

          {!isPremium && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Upgrade to Standard</span> to unlock 
                advanced filtering by revenue, team size, and funding raised.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFilters;
