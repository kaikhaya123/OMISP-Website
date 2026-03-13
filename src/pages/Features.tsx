import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Gamepad2, 
  MessageSquare, 
  Users, 
  Target, 
  Building2,
  ArrowRight,
  Check,
  Sparkles,
  BarChart3,
  Brain,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const featureDashboardPaths: Record<string, string> = {
  "revenue-architect": "/dashboard/revenue-architect",
  "build-a-biz": "/dashboard/build-a-biz",
  "omi-chat": "/dashboard/omi-chat",
  "ideaverse": "/dashboard/ideaverse",
  "pitch-gauntlet": "/dashboard/pitch-gauntlet",
  "omisp-capital": "/capital",
};

const features = [
  {
    id: "revenue-architect",
    icon: TrendingUp,
    title: "AI Revenue Architect",
    tagline: "Build investor-ready financial models in minutes",
    description: "Create professional 3-year projections, unit economics, and comprehensive financial reports without hiring a CFO. Our AI guides you through every assumption and calculation.",
    color: "bg-feature-orange",
    benefits: [
      "3-year revenue projections with multiple scenarios",
      "Unit economics calculator (CAC, LTV, payback period)",
      "Burn rate and runway analysis",
      "Investor-ready PDF exports",
      "Real-time sensitivity analysis",
    ],
    stats: { value: "2.5x", label: "Faster than traditional modeling" },
  },
  {
    id: "build-a-biz",
    icon: Gamepad2,
    title: "Market Heartbeat Saga",
    tagline: "Learn entrepreneurship through simulation",
    description: "Master real-world decision-making through our turn-based business simulation. Navigate market crashes, manage burn rate, hire talent, and build your execution muscle—all without the real-world risk.",
    color: "bg-feature-purple",
    benefits: [
      "Realistic market scenarios and challenges",
      "Strategic decision-making practice",
      "Burn rate and cash flow management",
      "Team building and resource allocation",
      "Competitive leaderboards",
    ],
    stats: { value: "10K+", label: "Simulations completed" },
  },
  {
    id: "omi-chat",
    icon: MessageSquare,
    title: "Omi Chat",
    tagline: "Your 24/7 AI co-founder",
    description: "Get strategic mentorship from 6 unique AI personas. From The Ruthless Critic who stress-tests your ideas to The Visionary who helps you dream bigger—always available, always honest.",
    color: "bg-feature-teal",
    benefits: [
      "6 specialized AI mentorship personas",
      "The Ruthless Critic for honest feedback",
      "The CFO for financial guidance",
      "The Visionary for big-picture thinking",
      "24/7 availability, unlimited conversations (Pro)",
    ],
    stats: { value: "500K+", label: "Mentorship sessions" },
  },
  {
    id: "ideaverse",
    icon: Users,
    title: "Ideaverse Hub",
    tagline: "Connect with founders worldwide",
    description: "Join a curated community of ambitious founders. Share ideas, find co-founders, get feedback on your pitch, and build meaningful connections with high-quality entrepreneurs on similar journeys.",
    color: "bg-feature-blue",
    benefits: [
      "Curated founder community",
      "Co-founder matching algorithm",
      "Idea feedback and validation",
      "Industry-specific channels",
      "Mentor office hours",
    ],
    stats: { value: "340+", label: "Co-founder matches made" },
  },
  {
    id: "pitch-gauntlet",
    icon: Target,
    title: "Pitch Perfect Gauntlet",
    tagline: "Perfect your pitch before real VC meetings",
    description: "Practice pitching to AI investors who simulate different VC personalities and investment theses. Get scored on clarity, conviction, and responsiveness. Transform from nervous to confident.",
    color: "bg-feature-pink",
    benefits: [
      "AI-powered VC simulation",
      "Real-time pitch scoring",
      "Personalized improvement tips",
      "Different investor personalities",
      "Video recording and playback",
    ],
    stats: { value: "85%", label: "Improvement in pitch confidence" },
  },
  {
    id: "omisp-capital",
    icon: Building2,
    title: "OMISP Capital",
    tagline: "Get discovered by top VCs",
    description: "Your OMISP Score opens doors. Eligible founders get discovered by our network of 340+ VC partners actively looking for their next investment. No cold emails needed—let your credibility speak.",
    color: "bg-feature-green",
    benefits: [
      "Access to 340+ VC partners",
      "Score-based matching with investors",
      "Warm introductions facilitated",
      "Investor meeting scheduling",
      "Due diligence preparation tools",
    ],
    stats: { value: "$850M+", label: "Total funding raised" },
  },
];

const FeaturesPage = () => {
  const { user } = useAuth();
  const { role } = useUserRole();

  const resolveFeaturePath = (slug: string): string => {
    if (!user) {
      return `/signup?next=${featureDashboardPaths[slug] ?? "/dashboard"}`;
    }
    if (role === "founder") {
      return featureDashboardPaths[slug] ?? "/dashboard";
    }
    if (role === "investor") {
      return slug === "omisp-capital" ? "/capital" : "/vc-dashboard";
    }
    return "/choose-role";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Powerful Tools for Founders</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Everything You Need to{" "}
              <span className="font-serif italic text-primary">Succeed</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Six powerful features designed to build your credibility, sharpen your skills, 
              and connect you with investors. All in one platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={user ? (role === "investor" ? "/capital" : "/dashboard") : "/signup"}>
                <Button size="lg" className="gap-2">
                  {user ? "Go to Dashboard" : "Start Building Your Score"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid Overview — cards now deep-link to the feature */}
        <section className="container mx-auto px-4 md:px-6 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={resolveFeaturePath(feature.id)}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{feature.tagline}</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                  {user ? "Open →" : "Get started →"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Individual Feature Sections */}
        {features.map((feature, index) => (
          <section
            key={feature.id}
            id={feature.id}
            className={`py-20 ${index % 2 === 1 ? "bg-muted/30" : ""}`}
          >
            <div className="container mx-auto px-4 md:px-6">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-xl text-primary font-medium mb-4">{feature.tagline}</p>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>

                  {/* Benefits */}
                  <ul className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={resolveFeaturePath(feature.id)}>
                    <Button className="gap-2">
                      {user
                        ? `Open ${feature.title}`
                        : `Try ${feature.title}`}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Visual/Stats Card */}
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                    <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary mb-2">{feature.stats.value}</p>
                      <p className="text-muted-foreground">{feature.stats.label}</p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <BarChart3 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Analytics</p>
                        </div>
                        <div>
                          <Brain className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">AI-Powered</p>
                        </div>
                        <div>
                          <Shield className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Secure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-20 bg-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
              Ready to Transform Your Founder Journey?
            </h2>
            <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
              Join 12,000+ founders who are building credibility and getting discovered by top VCs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={user ? (role === "investor" ? "/capital" : "/dashboard") : "/signup"}>
                <Button size="lg" variant="secondary" className="gap-2">
                  {user ? "Go to Dashboard" : "Start Free Today"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/capital">
                <Button size="lg" variant="outline" className="bg-transparent border-background/30 text-background hover:bg-background/10">
                  I'm a VC
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
