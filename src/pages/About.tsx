import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Target, Shield, Users, Rocket, Zap, Sparkles } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Our mission is to democratize access to venture capital by providing founders with the tools to prove their potential.",
    color: "bg-feature-orange",
  },
  {
    icon: Shield,
    title: "Data Integrity",
    description: "We believe in verified credibility. Every point in an OMISP Score is backed by real actions and progress.",
    color: "bg-feature-pink",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a company is lonely. We're creating a global ecosystem where founders support each other.",
    color: "bg-feature-teal",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About <span className="font-serif italic text-primary">OMISP</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the infrastructure for the next generation of founders.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                The Credit Score for <span className="font-serif italic text-primary">Founders</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  For too long, venture capital has relied on warm introductions and prestigious 
                  backgrounds. We believe that great founders can come from anywhere. OMISP 
                  (Open Market Investor-Startup Protocol) provides a standardized way for founders 
                  to build, track, and prove their credibility.
                </p>
                <p>
                  By combining AI-powered strategic training with real-world milestone tracking, 
                  we give VCs a data-driven way to discover high-potential founders and founders 
                  a clear path to becoming investor-ready.
                </p>
              </div>

              {/* Stats Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Rocket className="w-4 h-4" />
                  <span className="font-medium">12K+ Founders</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">340+ VCs</span>
                </div>
              </div>
            </div>

            {/* Decorative Box */}
            <div className="bg-muted/50 rounded-2xl p-12 flex items-center justify-center">
              <Sparkles className="w-24 h-24 text-primary/30" />
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className={`w-12 h-12 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
