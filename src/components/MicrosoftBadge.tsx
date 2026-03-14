import microsoftLogo from "@/assets/microsoft-logo.png";

interface MicrosoftBadgeProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

const MicrosoftBadge = ({ variant = "default", className = "" }: MicrosoftBadgeProps) => {
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <img src={microsoftLogo.src} alt="Microsoft" className="w-4 h-4 object-contain" />
        <span>Microsoft for Startups</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border ${className}`}>
        <img src={microsoftLogo.src} alt="Microsoft" className="w-4 h-4 object-contain" />
        <span className="text-xs font-medium text-muted-foreground">Microsoft for Startups</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 ${className}`}>
      <img src={microsoftLogo.src} alt="Microsoft" className="w-6 h-6 object-contain" />
      <div className="text-left">
        <p className="text-xs font-semibold text-foreground">Microsoft for Startups</p>
        <p className="text-[10px] text-muted-foreground">Founders Hub Member</p>
      </div>
    </div>
  );
};

export default MicrosoftBadge;
