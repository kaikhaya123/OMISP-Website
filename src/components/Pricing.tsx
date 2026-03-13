import { Button } from "@/components/ui/button";
import { Check, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const founderPlans = [
  {
    name: "Founder",
    tier: "Free",
    price: "$0",
    period: "/month",
    features: [
      "2 Pitch sessions/month",
      "1 Financial model/month",
      "1 Game session/month",
      "50 Omi conversations",
      "Basic OMISP Score",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Strategist",
    tier: "Pro",
    price: "$39",
    period: "/month",
    features: [
      "Unlimited pitch sessions",
      "Unlimited financial models",
      "Unlimited game sessions",
      "Unlimited Omi conversations",
      "Advanced OMISP Score",
      "OMISP Capital eligibility",
      "Progress tracking & analytics",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Unicorn Builder",
    tier: "Premium",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Pro",
      "Guaranteed VC visibility",
      "Custom AI personas",
      "Quarterly strategy sessions",
      "Investor-ready reports",
      "VC introduction facilitation",
      "Premium community access",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

const vcPlans = [
  {
    name: "Partner",
    tier: "Free",
    price: "$0",
    period: "/month",
    features: [
      "Weekly 'Top 10 Founders' pop-up",
      "Basic founder feed (top 50)",
      "Favorite founders to watchlist",
      "Basic filtering by industry",
      "Monthly digest email",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Standard",
    tier: "Pro",
    price: "$499",
    period: "/month",
    features: [
      "All Partner features",
      "Full OMISP profiles (6 dimensions)",
      "Advanced filtering & search",
      "10 direct intro requests/month",
      "Founder behavioral data access",
      "Monthly top founders report",
      "Priority support",
    ],
    cta: "Upgrade",
    popular: true,
  },
  {
    name: "Premium",
    tier: "Enterprise",
    price: "$1,499",
    period: "/month",
    features: [
      "All Standard features",
      "48-hour exclusive first look",
      "Unlimited intro requests",
      "AI-powered screening reports",
      "Portfolio benchmarking",
      "Dedicated success manager",
      "API access & integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PlanGrid = ({ plans }: { plans: typeof founderPlans }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
    {plans.map((plan, index) => (
      <div
      key={index}
        className={`relative bg-card rounded-2xl border ${
          plan.popular ? "border-primary shadow-xl shadow-primary/10" : "border-border"
        } p-6 md:p-8`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
            Most Popular
          </div>
        )}

        <div className="mb-6">
          <p className="text-muted-foreground text-sm mb-1">{plan.name}</p>
          <p className="text-xl font-semibold text-foreground mb-4">{plan.tier}</p>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, fi) => (
            <li key={fi} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Link to="/signup">
          <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
            {plan.cta}
          </Button>
        </Link>
      </div>
    ))}
  </div>
);

const Pricing = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plans for founders building the future and VCs discovering them.
          </p>
        </div>

        <Tabs defaultValue="founders" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-8 md:mb-10">
            <TabsTrigger value="founders">For Founders</TabsTrigger>
            <TabsTrigger value="vcs" className="gap-1">
              <Building2 className="w-4 h-4" />
              For VCs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="founders">
            <PlanGrid plans={founderPlans} />
          </TabsContent>

          <TabsContent value="vcs">
            <PlanGrid plans={vcPlans} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
