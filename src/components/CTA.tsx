import { CTAWithMarquee } from "@/components/ui/cta-with-marquee";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <CTAWithMarquee
      title="Ready to Build Your Credibility?"
      subtitle="Join 12,000+ founders who are proving their potential and getting discovered by top VCs."
      primaryButtonText="Start Building Your Score"
      secondaryButtonText="I'm a VC"
      onPrimaryClick={() => navigate("/signup")}
      onSecondaryClick={() => navigate("/capital")}
    />
  );
};

export default CTA;
