import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const metrics = [
  { value: "6D", label: "score dimensions measured" },
  { value: "70+", label: "threshold for VC discovery" },
  { value: "3", label: "core workflows: score, validation, discovery" },
  { value: "2", label: "sides of the marketplace connected" },
];

const ProductProofSection = () => {
  return (
    <section className="bg-[#FFF8DC] py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center gap-8 mb-10">
          <div className="w-full max-w-3xl">
            <Badge className="mb-4 bg-black text-white font-tanker border-0 block w-fit mx-auto">Product Proof</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-tanker">
              A real product, not just a landing page promise
            </h2>
            <p className="text-lg text-black/80 leading-relaxed mb-6">
              OMISP now has founder dashboards, milestone validation, investor reports, and VC discovery routes.
              The homepage should prove that with concrete previews and direct paths into the experience.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
              {metrics.map((metric) => (
                <div key={metric.label} className="p-4 bg-transparent">
                  <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
                  <p className="text-sm text-black/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
            <div className="bg-transparent text-black p-5 shadow-none text-center">
              <div className="flex justify-center mb-6">
                <Badge className="bg-primary text-black border-0">FOUNDER</Badge>
              </div>
              <h3 className="text-xl font-semibold mb-3">Dashboard and score tracking</h3>
              <div className="space-y-3 mb-6">
                <div className="h-3 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF8225] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "82%" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
                <div className="h-3 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-black rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "71%" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                  />
                </div>
                <div className="h-3 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-black rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "66%" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className="text-sm text-black/80">Founders can already track score movement, milestones, and investor visibility.</p>
            </div>

            <div className="bg-transparent text-black p-5 shadow-none text-center">
              <div className="flex justify-center mb-6">
                <Badge className="bg-black text-white border-0">REPORT</Badge>
              </div>
              <h3 className="text-xl font-semibold mb-3">Investor-ready founder report</h3>
              <div className="bg-black/5 p-4 mb-5">
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

            <div className="bg-transparent text-black p-5 shadow-none text-center">
              <div className="flex justify-center mb-6">
                <Badge className="bg-white text-black border-0">VC</Badge>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discovery, ranking, and diligence</h3>
              <div className="space-y-3 mb-5">
                <div className="bg-black/5 p-3 text-center">
                  <span className="text-sm">Top founder leaderboard</span>
                </div>
                <div className="bg-black/5 p-3 text-center">
                  <span className="text-sm">Watchlists and intros</span>
                </div>
              </div>
              <p className="text-sm text-black/75">Investors have clearer signal and faster ways to act on it.</p>
            </div>
          </div>
        </div>

        <div className="bg-transparent text-black p-8 flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Direct paths into the product</h3>
            <p className="text-black/75 max-w-2xl mx-auto">
              The homepage should not trap users at the marketing layer. It should move them into founder onboarding,
              investor discovery, pricing, or capital exploration immediately.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-[#FF8225] text-black hover:bg-primary/90">
              <Link to="/signup">Create Founder Account</Link>
            </Button>
            <Button asChild className="bg-black text-white hover:bg-black/90 border-0">
              <Link to="/capital">Explore Investor Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductProofSection;