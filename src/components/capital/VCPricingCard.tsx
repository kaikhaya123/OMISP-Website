import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface VCPricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  badge?: string;
}

const VCPricingCard = ({
  name,
  price,
  period = "/month",
  description,
  features,
  highlighted = false,
  buttonText,
  buttonVariant = "outline",
  badge,
}: VCPricingCardProps) => {
  return (
    <div
      className={`relative flex flex-col p-6 rounded-2xl border ${
        highlighted
          ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
          : "bg-card border-border"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {period && price !== "Custom" && (
          <span className="text-muted-foreground">{period}</span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={highlighted ? "default" : buttonVariant} 
        className="w-full gap-2"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default VCPricingCard;
