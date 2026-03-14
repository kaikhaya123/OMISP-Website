import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const founderPlans = [
  {
    name: "FOUNDER",
    tier: "Free",
    price: "$0",
    period: "/month",
    description: "Start your journey with essential tools",
    features: [
      "2 Pitch Perfect Gauntlet pitches/month",
      "1 AI Revenue Architect model/month",
      "1 Market Heartbeat Saga game/month",
      "50 Omi Chat conversations/month",
      "Basic OMISP Score (4 dimensions)",
      "Limited milestone visibility",
    ],
    limitations: [
      "Not eligible for OMISP Capital",
      "No progress tracking",
    ],
    cta: "Start Free",
    popular: false,
    icon: Users,
  },
  {
    name: "STRATEGIST",
    tier: "Pro",
    price: "$39",
    period: "/month",
    yearlyPrice: "$349",
    description: "For serious founders building credibility",
    features: [
      "Unlimited access to all core features",
      "Advanced OMISP Score (4D + Progress Velocity)",
      "Full progress tracking & milestone logging",
      "Company registration, revenue, team tracking",
      "Monthly 'Founder Briefing' market insights",
      "Pro community access",
      "OMISP Capital eligible (Score ≥70)",
      "Detailed score breakdown & history",
    ],
    cta: "Go Pro",
    popular: true,
    icon: Star,
  },
  {
    name: "UNICORN BUILDER",
    tier: "Premium",
    price: "$99",
    period: "/month",
    yearlyPrice: "$899",
    description: "For founders ready for VC visibility",
    features: [
      "Everything in Pro, plus:",
      "Elite OMISP Score (6D + Unicorn Potential)",
      "Guaranteed monthly VC visibility (5-10 curated VCs)",
      "Custom VC personas for pitching",
      "Quarterly strategic sessions with Omi",
      "Real-time VC dashboard (who's viewing)",
      "Investor-ready progress reports (auto PDF)",
      "Premium mastermind community (top 1%)",
      "VC introduction facilitation",
      "Early access to new features",
    ],
    cta: "Go Premium",
    popular: false,
    icon: Crown,
  },
];

const vcPlans = [
  {
    name: "PARTNER",
    tier: "Free",
    price: "$0",
    period: "/month",
    description: "Explore the founder pipeline",
    features: [
      "Weekly 'Top 10 Founders' pop-up",
      "Basic founder feed (top 50 by score)",
      "Favorite founders (watchlist)",
      "Basic filtering (industry, stage)",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "STANDARD",
    tier: "$499",
    price: "$499",
    period: "/month",
    description: "For active deal sourcing",
    features: [
      "All Partner features, plus:",
      "Full OMISP profiles (4D + Progress Velocity)",
      "Advanced filtering (industry, stage, score, revenue, team)",
      "Direct intro requests",
      "Founder behavioral data (pitch scores, resilience)",
      "Monthly 'Top 10 Founders' report",
    ],
    cta: "Upgrade to Standard",
    popular: true,
  },
  {
    name: "PREMIUM",
    tier: "$1,499",
    price: "$1,499",
    period: "/month",
    description: "For competitive advantage",
    features: [
      "All Standard features, plus:",
      "48-hour exclusive first look at top 1% founders (score ≥90)",
      "Portfolio benchmarking (compare to OMISP data)",
      "AI-powered founder screening reports",
      "Investor-ready founder reports (auto PDF)",
      "Weekly 'Top 10 Founders' report",
    ],
    cta: "Upgrade to Premium",
    popular: false,
  },
  {
    name: "ENTERPRISE",
    tier: "Custom",
    price: "Custom",
    period: "",
    description: "For institutional investors",
    features: [
      "White-labeled OMISP portal (your brand)",
      "AI screening of cold inbound",
      "Custom founder filters & scoring criteria",
      "Dedicated account manager",
      "API access for integration",
      "Custom reporting & dashboards",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Invest in Your <span className="font-serif italic text-primary">Founder Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that matches your ambition. Upgrade anytime as you grow.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="founders" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="founders" className="gap-2">
                <Users className="w-4 h-4" />
                For Founders
              </TabsTrigger>
              <TabsTrigger value="vcs" className="gap-2">
                <Crown className="w-4 h-4" />
                For VCs
              </TabsTrigger>
            </TabsList>

            {/* Founder Plans */}
            <TabsContent value="founders">
              <div className="grid grid-cols-3 gap-8">
                {founderPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-card rounded-2xl border ${
                      plan.popular ? "border-primary shadow-xl shadow-primary/10" : "border-border"
                    } p-8 flex flex-col`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <plan.icon className="w-5 h-5 text-primary" />
                        <p className="text-muted-foreground text-xs tracking-wider">{plan.name}</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground mb-2">{plan.tier}</p>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                      </div>
                      {plan.yearlyPrice && (
                        <p className="text-sm text-muted-foreground mt-1">
                          or {plan.yearlyPrice}/year (save 25%)
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations?.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start gap-3 opacity-50">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs">✕</span>
                          </div>
                          <span className="text-muted-foreground text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/dashboard">
                      <Button
                        className="w-full gap-2"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* VC Plans */}
            <TabsContent value="vcs">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {vcPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-card rounded-2xl border ${
                      plan.popular ? "border-primary shadow-xl shadow-primary/10" : "border-border"
                    } p-6 flex flex-col`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Recommended
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-muted-foreground text-xs tracking-wider mb-1">{plan.name}</p>
                      <p className="text-xl font-bold text-foreground mb-1">{plan.tier}</p>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-2 mb-4 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-xs">
                          <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/capital">
                      <Button
                        className="w-full text-sm"
                        variant={plan.popular ? "default" : "outline"}
                        size="sm"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* FAQ CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Have questions about which plan is right for you?
            </p>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
