import { Link } from "react-router-dom";
import { ArrowRight, Eye, FileText, Heart, LayoutDashboard, LineChart, Search, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const founderItems = [
  {
    icon: LayoutDashboard,
    title: "Founder dashboard",
    copy: "Track OMISP score, milestone progress, and investor readiness from one place.",
  },
  {
    icon: LineChart,
    title: "6D score growth",
    copy: "Improve the exact dimensions investors care about instead of guessing what matters.",
  },
  {
    icon: UserRoundCheck,
    title: "Milestone validation",
    copy: "Upload proof, get reviewed, and turn traction into verified credibility.",
  },
  {
    icon: FileText,
    title: "Investor-ready reports",
    copy: "Export a polished summary of your score, milestones, and growth trajectory.",
  },
];

const investorItems = [
  {
    icon: Search,
    title: "Founder discovery",
    copy: "Filter and inspect ranked founders using score, traction, sector, and growth signals.",
  },
  {
    icon: Eye,
    title: "Live investor visibility",
    copy: "Founders can see real engagement while investors get cleaner deal flow at the top.",
  },
  {
    icon: Heart,
    title: "Watchlists and intros",
    copy: "Save high-potential founders and request warm introductions through structured workflows.",
  },
  {
    icon: FileText,
    title: "Screening reports",
    copy: "Generate faster diligence snapshots before deeper founder conversations.",
  },
];

const AudienceSplitSection = () => {
  return (
    <section className="py-24 bg-[#FFC300]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-black text-white border-black">Two-Sided Platform</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-tanker">
            Built for founders raising capital and investors sourcing conviction
          </h2>
          <p className="text-lg text-black/80">
            The landing page now needs to reflect both sides of the marketplace. OMISP is not just a founder tool,
            and it is not just a VC directory. It is the system connecting both.
          </p>
        </div>

        <Tabs defaultValue="founders" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-10 bg-black text-white">
            <TabsTrigger value="founders">For Founders</TabsTrigger>
            <TabsTrigger value="investors">For Investors</TabsTrigger>
          </TabsList>

          <TabsContent value="founders">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                {founderItems.map((item) => (
                  <div key={item.title} className="rounded-3xl bg-white p-6 shadow-lg border border-black/10">
                    <div className="w-12 h-12 rounded-2xl bg-black text-primary flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">{item.title}</h3>
                    <p className="text-sm text-black/75 leading-relaxed">{item.copy}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] bg-black text-white p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-3">Founder path</p>
                <h3 className="text-3xl font-semibold mb-4">Build proof, earn trust, become visible</h3>
                <p className="text-white/75 leading-relaxed mb-6">
                  Founders use OMISP to improve capability, log real progress, and package their traction into a form
                  investors can evaluate faster.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">AI coaching and strategic feedback</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Milestones that strengthen Progress Velocity</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Exportable investor-ready report for outreach</div>
                </div>
                <Button asChild className="bg-primary text-black hover:bg-primary/90">
                  <Link to="/signup">
                    Start as Founder
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investors">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                {investorItems.map((item) => (
                  <div key={item.title} className="rounded-3xl bg-white p-6 shadow-lg border border-black/10">
                    <div className="w-12 h-12 rounded-2xl bg-black text-primary flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">{item.title}</h3>
                    <p className="text-sm text-black/75 leading-relaxed">{item.copy}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-black/60 mb-3">Investor path</p>
                <h3 className="text-3xl font-semibold text-black mb-4">See ranked founders before everyone else</h3>
                <p className="text-black/75 leading-relaxed mb-6">
                  Investors get structured discovery, high-signal founder profiles, and direct workflows for tracking and
                  requesting intros when conviction starts to build.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">Leaderboard and founder discovery feed</div>
                  <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">Watchlists, comparison, and intro requests</div>
                  <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">AI screening reports and faster diligence</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-black text-white hover:bg-black/90">
                    <Link to="/capital">
                      Explore for Investors
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-black/20 text-black hover:bg-black hover:text-white">
                    <Link to="/pricing">View VC Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AudienceSplitSection;