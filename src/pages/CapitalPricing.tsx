import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import VCPricingCard from "@/components/capital/VCPricingCard";
import MicrosoftBadge from "@/components/MicrosoftBadge";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, Shield, ArrowRight, CheckCircle, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const vcTiers = [
  {
    name: "Partner",
    price: "$0",
    period: "/month",
    description: "Get started with OMISP Capital for free",
    features: [
      "Weekly 'Top 10 Founders' pop-up",
      "Basic founder feed (top 50 founders)",
      "Favorite founders to watchlist",
      "Basic filtering by industry & stage",
      "Monthly digest email",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
  },
  {
    name: "Standard",
    price: "$499",
    period: "/month",
    description: "For VCs actively sourcing deals",
    features: [
      "All Partner features",
      "Full OMISP founder profiles (6 dimensions)",
      "Advanced filtering (revenue, team, funding)",
      "Direct intro requests (10/month)",
      "Founder behavioral data access",
      "Monthly 'Top 10 Founders' report",
      "Priority support",
    ],
    buttonText: "Upgrade to Standard",
    buttonVariant: "default" as const,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$1,499",
    period: "/month",
    description: "For top-tier VCs & larger funds",
    features: [
      "All Standard features",
      "48-hour exclusive first look at top 1%",
      "Unlimited intro requests",
      "Portfolio benchmarking vs. OMISP data",
      "AI-powered founder screening reports",
      "Investor-ready founder PDFs",
      "Weekly 'Top 10 Founders' report",
      "Dedicated success manager",
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "outline" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For mega-funds & institutional investors",
    features: [
      "All Premium features",
      "White-labeled OMISP portal",
      "AI screening of cold inbound",
      "Custom founder filters & scoring",
      "Dedicated account manager",
      "API access for integrations",
      "Custom reporting & dashboards",
      "SLA guarantees",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
];

const stats = [
  { icon: Users, value: "2,500+", label: "Pre-vetted Founders" },
  { icon: Building2, value: "150+", label: "VC Partners" },
  { icon: TrendingUp, value: "$50M+", label: "Deals Facilitated" },
  { icon: Shield, value: "6-Dimension", label: "Scoring System" },
];

const testimonials = [
  {
    quote: "OMISP Capital has completely transformed how we source deals. The quality of founders is exceptional.",
    author: "Sarah Chen",
    role: "Partner, Sequoia Capital"
  },
  {
    quote: "The 6-dimension scoring gives us insights we couldn't get anywhere else. Worth every penny.",
    author: "David Kim",
    role: "Principal, Andreessen Horowitz"
  }
];

const CapitalPricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">OMISP Capital for VCs</span>
              </div>
              <MicrosoftBadge variant="compact" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Your Next <span className="font-serif italic text-primary">Unicorn</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access pre-vetted founders with verified metrics, behavioral data, and real-time 
              progress tracking. No cold emails. No wasted meetings.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-xl border border-border">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* What You Get */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Top VCs Choose OMISP Capital</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Pre-Vetted Quality</h3>
                <p className="text-sm text-muted-foreground">Every founder is scored across 6 dimensions. No more sifting through unqualified deals.</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Behavioral Data</h3>
                <p className="text-sm text-muted-foreground">See how founders execute, not just what they pitch. Real-time progress tracking.</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Direct Intros</h3>
                <p className="text-sm text-muted-foreground">Skip the cold outreach. Request warm intros to any founder on the platform.</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {vcTiers.map((tier, index) => (
              <VCPricingCard key={index} {...tier} />
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Trusted by Top VCs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6">
                  <p className="text-muted-foreground italic mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12">
            <MicrosoftBadge className="mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to discover exceptional founders?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join 150+ VCs already using OMISP Capital to find their next investments. 
              Start free, upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/capital">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CapitalPricingPage;
