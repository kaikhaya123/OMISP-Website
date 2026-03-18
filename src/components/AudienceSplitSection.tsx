import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warp } from "@paper-design/shaders-react";

const founderItems = [
  {
    title: "Founder dashboard",
    copy: "Track OMISP score, milestone progress, and investor readiness from one place.",
  },
  {
    title: "6D score growth",
    copy: "Improve the exact dimensions investors care about instead of guessing what matters.",
  },
  {
    title: "Milestone validation",
    copy: "Upload proof, get reviewed, and turn traction into verified credibility.",
  },
  {
    title: "Investor-ready reports",
    copy: "Export a polished summary of your score, milestones, and growth trajectory.",
  },
];

const investorItems = [
  {
    title: "Founder discovery",
    copy: "Filter and inspect ranked founders using score, traction, sector, and growth signals.",
  },
  {
    title: "Live investor visibility",
    copy: "Founders can see real engagement while investors get cleaner deal flow at the top.",
  },
  {
    title: "Watchlists and intros",
    copy: "Save high-potential founders and request warm introductions through structured workflows.",
  },
  {
    title: "Screening reports",
    copy: "Generate faster diligence snapshots before deeper founder conversations.",
  },
];

const GradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute -top-24 -left-20 h-72 w-72" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/85" />
    </div>
  );
};

const shaderConfigs = [
  {
    proportion: 0.3,
    softness: 0.8,
    distortion: 0.15,
    swirl: 0.6,
    swirlIterations: 8,
    shape: "checks" as const,
    shapeScale: 0.08,
    colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
  },
  {
    proportion: 0.4,
    softness: 1.2,
    distortion: 0.2,
    swirl: 0.9,
    swirlIterations: 12,
    shape: "stripes" as const,
    shapeScale: 0.12,
    colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
  },
  {
    proportion: 0.35,
    softness: 0.9,
    distortion: 0.18,
    swirl: 0.7,
    swirlIterations: 10,
    shape: "checks" as const,
    shapeScale: 0.1,
    colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
  },
  {
    proportion: 0.45,
    softness: 1.1,
    distortion: 0.22,
    swirl: 0.8,
    swirlIterations: 15,
    shape: "edge" as const,
    shapeScale: 0.09,
    colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"],
  },
  {
    proportion: 0.38,
    softness: 0.95,
    distortion: 0.16,
    swirl: 0.85,
    swirlIterations: 11,
    shape: "checks" as const,
    shapeScale: 0.11,
    colors: ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"],
  },
  {
    proportion: 0.42,
    softness: 1,
    distortion: 0.19,
    swirl: 0.75,
    swirlIterations: 9,
    shape: "stripes" as const,
    shapeScale: 0.13,
    colors: ["hsl(330, 100%, 30%)", "hsl(350, 100%, 60%)", "hsl(340, 90%, 35%)", "hsl(345, 100%, 75%)"],
  },
];

const AudienceSplitSection = () => {
  return (
    <section className="py-24 bg-[#000000]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-[#FF8225] text-black font-tanker">Two-Sided Platform</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FF8225] mb-4 font-tanker">
            Built for founders raising capital and investors sourcing conviction
          </h2>
          <p className="text-lg text-white/80">
            The landing page now needs to reflect both sides of the marketplace. OMISP is not just a founder tool,
            and it is not just a VC directory. It is the system connecting both.
          </p>
        </div>

        <Tabs defaultValue="founders" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-10 bg-[#FF8225] text-white font-tanker">
            <TabsTrigger value="founders">For Founders</TabsTrigger>
            <TabsTrigger value="investors">For Investors</TabsTrigger>
          </TabsList>

          <TabsContent value="founders">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4 content-center">
                {founderItems.map((item, index) => {
                  const shaderConfig = shaderConfigs[index % shaderConfigs.length];
                  return (
                  <div key={item.title} className="relative isolate rounded-3xl p-6 border border-white/20 text-center flex flex-col items-center overflow-hidden">
                    <div className="absolute inset-0 -z-20">
                      <Warp
                        style={{ height: "100%", width: "100%" }}
                        proportion={shaderConfig.proportion}
                        softness={shaderConfig.softness}
                        distortion={shaderConfig.distortion}
                        swirl={shaderConfig.swirl}
                        swirlIterations={shaderConfig.swirlIterations}
                        shape={shaderConfig.shape}
                        shapeScale={shaderConfig.shapeScale}
                        scale={1}
                        rotation={0}
                        speed={0.8}
                        colors={shaderConfig.colors}
                      />
                    </div>
                    <div className="absolute inset-0 -z-10 bg-black/70" />
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{item.copy}</p>
                  </div>
                );
                })}
              </div>
                <div className="relative rounded-[2rem] bg-black text-white p-8 shadow-2xl overflow-hidden text-center">
                <GradientBackground />
                <div className="absolute inset-0 -z-10 bg-black/20" />
                <div className="relative z-10">
                  <p className="text-sm uppercase tracking-[0.3em] text-white mb-3">Founder path</p>
                  <h3 className="text-3xl font-semibold mb-4">Build proof, earn trust, become visible</h3>
                  <p className="text-white/75 leading-relaxed mb-6">
                  Founders use OMISP to improve capability, log real progress, and package their traction into a form
                  investors can evaluate faster.
                  </p>
                  <div className="space-y-3 mb-8 text-left">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">AI coaching and strategic feedback</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Milestones that strengthen Progress Velocity</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Exportable investor-ready report for outreach</div>
                  </div>
                  <Button asChild className="bg-white text-black hover:bg-[#FF8225]/90 mx-auto">
                  <Link to="/signup">
                    Start as Founder
                  </Link>
                  </Button>
                </div>
                </div>
              </div>
              </TabsContent>

          <TabsContent value="investors">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                {investorItems.map((item, index) => {
                  const shaderConfig = shaderConfigs[(index + 2) % shaderConfigs.length];
                  return (
                  <div key={item.title} className="relative isolate rounded-3xl p-6 shadow-lg border border-white/20 overflow-hidden">
                    <div className="absolute inset-0 -z-20">
                      <Warp
                        style={{ height: "100%", width: "100%" }}
                        proportion={shaderConfig.proportion}
                        softness={shaderConfig.softness}
                        distortion={shaderConfig.distortion}
                        swirl={shaderConfig.swirl}
                        swirlIterations={shaderConfig.swirlIterations}
                        shape={shaderConfig.shape}
                        shapeScale={shaderConfig.shapeScale}
                        scale={1}
                        rotation={0}
                        speed={0.8}
                        colors={shaderConfig.colors}
                      />
                    </div>
                    <div className="absolute inset-0 -z-10 bg-black/70" />
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{item.copy}</p>
                  </div>
                );
                })}
              </div>
              <div className="rounded-[2rem] bg-[#FF8225] p-8 shadow-2xl border border-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-white mb-3font-tanker ">Investor path</p>
                <h3 className="text-3xl font-semibold text-black mb-4">See ranked founders before everyone else</h3>
                <p className="text-black/75 leading-relaxed mb-6">
                  Investors get structured discovery, high-signal founder profiles, and direct workflows for tracking and
                  requesting intros when conviction starts to build.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="">Leaderboard and founder discovery feed</div>
                  <div className="">Watchlists, comparison, and intro requests</div>
                  <div className="">AI screening reports and faster diligence</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-white text- hover:bg-black/90">
                    <Link to="/capital">
                      Explore for Investors
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-black/20 text-white hover:bg-black hover:text-white">
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