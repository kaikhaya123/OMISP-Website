import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Eye, FileCheck2, FileUp, Shield, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: FileUp,
    title: "Log a milestone",
    copy: "Founders submit traction proof like launches, customers, revenue, team growth, and funding movement.",
  },
  {
    icon: Eye,
    title: "Admin review",
    copy: "OMISP checks the evidence before the milestone influences visibility and downstream investor trust.",
  },
  {
    icon: BadgeCheck,
    title: "Verified credibility",
    copy: "Approved milestones strengthen Progress Velocity and make founder profiles materially more investable.",
  },
];

const differentiators = [
  "Validated progress instead of self-claimed traction",
  "Behavior and execution signals instead of static pitch decks",
  "Investor discovery based on score quality, not cold outreach volume",
];

const ValidationSection = () => {
  return (
    <section className="py-24 bg-[#FFF8DC] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,195,0,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div>
            <Badge className="mb-4 bg-primary text-black border-primary">Verified Milestones</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-tanker">
              Credibility is earned, reviewed, and made visible
            </h2>
            <p className="text-black text-lg leading-relaxed mb-6">
              OMISP separates itself from founder communities and pitch tools by validating meaningful progress.
              That gives investors cleaner signal and gives founders a fairer path to visibility.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold text-primary mb-1">3-step</div>
                <p className="text-sm text-black">submission to approval workflow</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold text-primary mb-1">70+</div>
                <p className="text-sm text-black">score unlocks VC discovery</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold text-primary mb-1">Real</div>
                <p className="text-sm text-black">proof drives ranking, not claims</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {differentiators.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-black">{item}</p>
                </div>
              ))}
            </div>

            <Button asChild className="bg-primary text-black hover:bg-primary/90">
              <Link to="/capital">
                Explore OMISP Capital
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shrink-0">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">Step 0{index + 1}</div>
                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-black/75 leading-relaxed">{step.copy}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-primary text-black p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Investor trust compounds faster</h3>
              </div>
              <p className="text-black/75 mb-4">
                Once founders have verified milestones and stronger score quality, OMISP can surface them through reports,
                discovery feeds, watchlists, and intro workflows.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold">
                <FileCheck2 className="w-4 h-4" />
                Validation is part of the product, not an afterthought.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationSection;