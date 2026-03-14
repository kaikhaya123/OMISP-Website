import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Crown, FileText, Radar, SearchCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const metrics = [
  { value: "6D", label: "score dimensions measured" },
  { value: "70+", label: "threshold for VC discovery" },
  { value: "3", label: "core workflows: score, validation, discovery" },
  { value: "2", label: "sides of the marketplace connected" },
];

const ProductProofSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start mb-10">
          <div>
            <Badge className="mb-4 bg-primary text-black border-primary">Product Proof</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-tanker">
              A real product, not just a landing page promise
            </h2>
            <p className="text-lg text-black/80 leading-relaxed mb-6">
              OMISP now has founder dashboards, milestone validation, investor reports, and VC discovery routes.
              The homepage should prove that with concrete previews and direct paths into the experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-black/10 p-4 bg-[#fff7d1]">
                  <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
                  <p className="text-sm text-black/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-[2rem] bg-black text-white p-5 shadow-xl md:translate-y-8">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-primary text-black border-primary">Founder</Badge>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dashboard and score tracking</h3>
              <div className="space-y-3 mb-6">
                <div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[82%] bg-primary rounded-full" /></div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[71%] bg-white rounded-full" /></div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[66%] bg-primary/70 rounded-full" /></div>
              </div>
              <p className="text-sm text-white/75">Founders can already track score movement, milestones, and investor visibility.</p>
            </div>

            <div className="rounded-[2rem] bg-[#FFC300] text-black p-5 shadow-xl md:-translate-y-3">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-black text-white border-black">Report</Badge>
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Investor-ready founder report</h3>
              <div className="rounded-2xl bg-white/70 p-4 mb-5 border border-black/10">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span>OMISP Score</span>
                  <span className="font-semibold">81 / 100</span>
                </div>
                <div className="h-2 rounded-full bg-black/10 overflow-hidden mb-3"><div className="h-full w-[81%] bg-black rounded-full" /></div>
                <div className="space-y-2 text-sm text-black/70">
                  <div className="flex justify-between"><span>Verified milestones</span><span>6</span></div>
                  <div className="flex justify-between"><span>VC ready</span><span>Yes</span></div>
                  <div className="flex justify-between"><span>Unicorn potential</span><span>8 / 10</span></div>
                </div>
              </div>
              <p className="text-sm text-black/75">Founders can package proof into a format investors can assess quickly.</p>
            </div>

            <div className="rounded-[2rem] bg-[#111111] text-white p-5 shadow-xl md:translate-y-12">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-white text-black border-white">VC</Badge>
                <SearchCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discovery, ranking, and diligence</h3>
              <div className="space-y-3 mb-5">
                <div className="rounded-2xl bg-white/5 p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-sm">Top founder leaderboard</span>
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-white/5 p-3 border border-white/10 flex items-center justify-between">
                  <span className="text-sm">Watchlists and intros</span>
                  <Radar className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-sm text-white/75">Investors have clearer signal and faster ways to act on it.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-black text-white p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Direct paths into the product</h3>
            <p className="text-white/75 max-w-2xl">
              The homepage should not trap users at the marketing layer. It should move them into founder onboarding,
              investor discovery, pricing, or capital exploration immediately.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild className="bg-primary text-black hover:bg-primary/90">
              <Link to="/signup">
                Create Founder Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black">
              <Link to="/capital">Explore Investor Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductProofSection;