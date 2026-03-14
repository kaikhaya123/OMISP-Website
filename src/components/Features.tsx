import { TrendingUp, Gamepad2, MessageSquare, Users, Target, Building2 } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import Lottie from "lottie-react";
import femaleStudentAnimation from "../../public/Lottie/Female Student.json";
import techAssistantAnimation from "../../public/Lottie/Tech Assistant.json";
import racesAnimation from "../../public/Lottie/Races.json";
import videoMessageAnimation from "../../public/Lottie/Video Message.json";
import digitalPortalAnimation from "../../public/Lottie/Digital Portal.json";
import onlineBankingAnimation from "../../public/Lottie/Online Banking.json";

// Custom Lottie Icon for Ideaverse
const IdeaverseIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={femaleStudentAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

// Custom Lottie Icon for Revenue Architect
const RevenueArchitectIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={techAssistantAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

// Custom Lottie Icon for Market Heartbeat Saga
const MarketHeartbeatIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={racesAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

// Custom Lottie Icon for Omi Chat
const OmiChatIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={videoMessageAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

// Custom Lottie Icon for Pitch Perfect Gauntlet
const PitchGauntletIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={digitalPortalAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

// Custom Lottie Icon for OMISP Capital
const OMISPCapitalIcon = ({ className }: { className?: string }) => (
  <div className="h-48 w-48">
    <Lottie 
      animationData={onlineBankingAnimation} 
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

const features = [
  {
    Icon: RevenueArchitectIcon,
    name: "AI Revenue Architect",
    description: "Build investor-ready financial models with AI. Get 3-year projections, unit economics, and TAM analysis.",
    href: "/revenue-architect",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-white" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    scoring: "Idea Viability (0-20)",
    scoringDetail: "+10 for model quality, +6 for strong TAM, +3 for competitive positioning",
    descriptionColor: "black",
  },
  {
    Icon: MarketHeartbeatIcon,
    name: "Market Heartbeat Saga",
    description: "Navigate real-world business scenarios through turn-based simulation. Handle market crashes, manage burn rate, and prove your execution ability.",
    href: "/build-a-biz",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-black" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    scoring: "Execution Readiness (0-20)",
    scoringDetail: "+8 for game scores, +5 for decision speed, +6 for crisis management",
    descriptionColor: "white",
  },
  {
    Icon: OmiChatIcon,
    name: "Omi Chat",
    description: "Get strategic mentorship from 6 AI personas — The Ruthless Critic, The CFO, The Visionary, and more. Every conversation builds your Founder Aptitude score.",
    href: "/omi-chat",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-black" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    scoring: "Founder Aptitude (0-20)",
    scoringDetail: "+8 for engagement & learning, +4 for coachability (feedback receptiveness)",
    descriptionColor: "white",
  },
  {
    Icon: IdeaverseIcon,
    name: "Ideaverse Hub",
    description: "Connect with founders worldwide. Share ideas, find co-founders, get peer feedback, and build your network with high-quality entrepreneurs.",
    href: "/ideaverse",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-black" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    scoring: "Community",
    scoringDetail: "Network effects — collaboration boosts all dimensions",
    descriptionColor: "white",
  },
  {
    Icon: PitchGauntletIcon,
    name: "Pitch Perfect Gauntlet",
    description: "Face AI investors who ask tough questions. Get scored on clarity, conviction, and how you handle pressure.",
    href: "/pitch-gauntlet",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-black" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    scoring: "Behavioral Resilience (0-20)",
    scoringDetail: "+8 for pitch confidence under pressure, +2 for improvement trend",
    descriptionColor: "white",
  },
  {
    Icon: OMISPCapitalIcon,
    name: "OMISP Capital",
    description: "Get discovered by 150+ VCs through your verified OMISP Score. No cold emails. Top-scoring founders get weekly visibility to active investors seeking deals.",
    href: "/capital",
    cta: "Try it now",
    background: (
      <div className="absolute inset-0 bg-black" />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    scoring: "VC Eligible at 70+",
    scoringDetail: "Score ≥70 unlocks VC visibility, ≥85 = elite status, 🦄 badge at 8+",
    descriptionColor: "white",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Everything You Need to <span className="text-[#FFC300]">Succeed</span>
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Six powerful features designed to build your credibility, sharpen your skills, and connect you with investors. Each one directly impacts your 0-100 OMISP Score.
          </p>
        </div>

        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Features;
