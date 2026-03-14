import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCard, PricingCardProps } from "@/components/ui/animated-glassy-pricing";

const founderPlans: PricingCardProps[] = [
  {
    planName: "Founder",
    description: "Perfect for getting started",
    price: "0",
    features: [
      "2 Pitch sessions/month",
      "1 Financial model/month",
      "1 Game session/month",
      "50 Omi conversations",
      "Basic OMISP Score",
    ],
    buttonText: "Start Free",
    isPopular: false,
    buttonVariant: "secondary",
  },
  {
    planName: "Strategist",
    description: "For serious founders",
    price: "39",
    features: [
      "Unlimited pitch sessions",
      "Unlimited financial models",
      "Unlimited game sessions",
      "Unlimited Omi conversations",
      "Advanced OMISP Score",
      "OMISP Capital eligibility",
      "Progress tracking & analytics",
    ],
    buttonText: "Go Pro",
    isPopular: true,
    buttonVariant: "primary",
  },
  {
    planName: "Unicorn Builder",
    description: "Premium features for growth",
    price: "99",
    features: [
      "Everything in Pro",
      "Guaranteed VC visibility",
      "Custom AI personas",
      "Quarterly strategy sessions",
      "Investor-ready reports",
      "VC introduction facilitation",
      "Premium community access",
    ],
    buttonText: "Go Premium",
    isPopular: false,
    buttonVariant: "primary",
  },
];

const vcPlans: PricingCardProps[] = [
  {
    planName: "Partner",
    description: "Discover top founders",
    price: "0",
    features: [
      "Weekly 'Top 10 Founders' pop-up",
      "Basic founder feed (top 50)",
      "Favorite founders to watchlist",
      "Basic filtering by industry",
      "Monthly digest email",
    ],
    buttonText: "Get Started",
    isPopular: false,
    buttonVariant: "secondary",
  },
  {
    planName: "Standard",
    description: "Full investment insights", 
    price: "499",
    features: [
      "All Partner features",
      "Full OMISP profiles (6 dimensions)",
      "Advanced filtering & search",
      "10 direct intro requests/month",
      "Founder behavioral data access",
      "Monthly top founders report",
      "Priority support",
    ],
    buttonText: "Upgrade",
    isPopular: true,
    buttonVariant: "primary",
  },
  {
    planName: "Premium",
    description: "Enterprise-grade access",
    price: "1,499",
    features: [
      "All Standard features",
      "48-hour exclusive first look",
      "Unlimited intro requests",
      "AI-powered screening reports",
      "Portfolio benchmarking",
      "Dedicated success manager",
      "API access & integrations",
    ],
    buttonText: "Contact Sales",
    isPopular: false,
    buttonVariant: "primary",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  
  const founderPlansWithNavigation = founderPlans.map(plan => ({
    ...plan,
    onButtonClick: () => navigate("/signup")
  }));
  
  const vcPlansWithNavigation = vcPlans.map(plan => ({
    ...plan,
    onButtonClick: () => navigate(plan.planName === "Premium" ? "/contact" : "/signup")
  }));

  return (
    <section className="py-20 bg-background relative min-h-screen">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-tanker">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-tanker">
            Plans for founders building the future and VCs discovering them.
          </p>
        </div>

        <Tabs defaultValue="founders" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-12 md:mb-14">
            <TabsTrigger value="founders">For Founders</TabsTrigger>
            <TabsTrigger value="vcs" className="gap-1">
              <Building2 className="w-4 h-4" />
              For VCs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="founders">
            <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center w-full">
              {founderPlansWithNavigation.map((plan) => (
                <PricingCard key={plan.planName} {...plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vcs">
            <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center w-full">
              {vcPlansWithNavigation.map((plan) => (
                <PricingCard key={plan.planName} {...plan} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
