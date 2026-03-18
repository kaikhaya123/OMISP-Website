import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import gadgetsAnimation from "../../public/Lottie/Gadgets.json";

const steps = [
  {
    imageSrc: "/Icons/send.png",
    imageLabel: "Icon 01",
    title: "Log a milestone",
    copy: "Founders submit traction proof like launches, customers, revenue, team growth, and funding movement.",
  },
  {
    imageSrc: "/Icons/user-setting.png",
    title: "Admin review",
    copy: "OMISP checks the evidence before the milestone influences visibility and downstream investor trust.",
  },
  {
    imageSrc: "/Icons/customer-royalty.png",
    imageLabel: "Icon 03",
    title: "Verified credibility",
    copy: "Approved milestones strengthen Progress Velocity and make founder profiles materially more investable.",
  },
];

const differentiators = [
  {
    imageSrc: "/Icons/shield.png",
    imageLabel: "Icon A",
    copy: "Validated progress instead of self-claimed traction",
  },
  {
    imageSrc: "/Icons/shield.png",
    imageLabel: "Icon B",
    copy: "Behavior and execution signals instead of static pitch decks",
  },
  {
    imageSrc: "/Icons/shield.png",
    imageLabel: "Icon C",
    copy: "Investor discovery based on score quality, not cold outreach volume",
  },
];

const ImageIconPlaceholder = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        {hasError ? (
          <svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="h-full w-full text-black/45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="7" y="9" width="34" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17" cy="19" r="3" fill="currentColor" />
            <path d="M13 33L22 24L27 29L31 25L35 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};

const ValidationSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8DC] py-24 text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,195,0,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-tanker text-4xl font-bold text-[#FF8225] md:text-5xl">
              Credibility is earned, reviewed, and made visible
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-black">
              OMISP separates itself from founder communities and pitch tools by validating meaningful progress.
              That gives investors cleaner signal and gives founders a fairer path to visibility.
            </p>
          </div>

          {/* Steps — full-width 3-column horizontal row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center  bg-[#FFF8DC]">
                <ImageIconPlaceholder src={step.imageSrc} alt={step.title} className="mb-4 h-14 w-14 shrink-0" />
                <div className="mb-2 text-xs uppercase tracking-[0.25em] text-[#FF8225] font-semibold">Step 0{index + 1}</div>
                <h3 className="mb-3 text-xl font-bold font-tanker">{step.title}</h3>
                <p className="leading-relaxed text-black text-sm">{step.copy}</p>
              </div>
            ))}
          </div>

          {/* Investor trust card */}
          <div className="flex h-full flex-col rounded-3xl p-6 text-black">
              <div className="mt-6 h-[28rem] md:h-[34rem] lg:h-[40rem] w-full rounded-2xl bg-[#FFF8DC] p-2 md:p-3">
                <Lottie animationData={gadgetsAnimation} loop className="h-full w-full" />
              </div>

              <div className="mt-6 mb-3 flex flex-col items-center text-center gap-3">
                <ImageIconPlaceholder src="/Icons/trustworthiness.png" alt="Investor trust compounds faster" className="h-12 w-12 shrink-0" />
                <h3 className="text-xl font-semibold">Investor trust compounds faster</h3>
              </div>
              <p className="text-black text-center">
                Once founders have verified milestones and stronger score quality, OMISP can surface them through reports,
                discovery feeds, watchlists, and intro workflows.
              </p>

              <div className="mt-6 flex flex-col items-center text-center gap-2">
                <ImageIconPlaceholder src="/Icons/validation.png" alt="Validation is part of the product" className="h-10 w-10 shrink-0" />
                <h3 className="text-xl font-semibold font-tanker">Validation is part of the product</h3>
                <p className="text-black">Not an afterthought.</p>
              </div>
            </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-1 text-3xl font-bold text-primary font-tanker">3-step</div>
              <p className="text-sm text-black font-tanker">submission to approval workflow</p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-1 text-3xl font-bold text-primary font-tanker">70+</div>
              <p className="text-sm text-black font-tanker">score unlocks VC discovery</p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-1 text-3xl font-bold text-primary font-tanker">Real</div>
              <p className="text-sm text-black font-tanker">proof drives ranking, not claims</p>
            </div>
          </div>

          {/* Differentiators — 3 columns to fill the row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {differentiators.map((item) => (
              <div key={item.copy} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <ImageIconPlaceholder src={item.imageSrc} alt={item.copy} className="mt-0.5 h-10 w-10 shrink-0" />
                <p className="text-sm text-black">{item.copy}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Button asChild className="bg-[#FF8225] text-black font-tanker hover:bg-primary/90">
              <Link to="/capital">Explore OMISP Capital</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationSection;