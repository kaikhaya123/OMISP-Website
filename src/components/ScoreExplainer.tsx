import { Link } from "react-router-dom";
import { ArrowRight, Brain, Rocket, ShieldCheck, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

const dimensions = [
  {
    title: "Idea Viability",
    range: "0-20",
    score: "18",
    icon: Target,
    detail: "Model quality, market size, and clarity of commercial logic.",
    image: "/Images/business-executives-reading-sticky-notes.jpg",
  },
  {
    title: "Founder Aptitude", 
    range: "0-20",
    score: "17",
    icon: Brain,
    detail: "Coachability, decision quality, and strategic learning velocity.",
    image: "/Images/lifestyle-people-office.jpg",
  },
  {
    title: "Execution Readiness",
    range: "0-20", 
    score: "16",
    icon: Rocket,
    detail: "How well the founder performs when the business gets operational.",
    image: "/Images/pexels-vlada-karpovich-7433822.jpg",
  },
  {
    title: "Behavioral Resilience",
    range: "0-20",
    score: "15", 
    icon: ShieldCheck,
    detail: "Pressure handling, pitch confidence, and consistency under scrutiny.",
    image: "/Images/close-up-portrait-gorgeous-young-woman.jpg",
  },
  {
    title: "Progress Velocity",
    range: "0-10",
    score: "8",
    icon: TrendingUp,
    detail: "Verified milestones that show real movement, not just intention.",
    image: "/Images/businessman-holding-virtual-download-icon-progress-increasing-value-added-business-product-service-concept.jpg",
  },
  {
    title: "Unicorn Potential",
    range: "0-10",
    score: "7",
    icon: Sparkles,
    detail: "Growth, scale signals, and upside attractive to venture investors.",
    image: "/Images/Professional Meeting Scene.png",
  },
];

const thresholdItems = [
  {
    img: '/Images/Business Meeting Scene.png',
    title: '0-49',
    desc: 'Foundation stage. Build proof and sharpen fundamentals.',
    sliderName: 'foundation',
    status: 'Building',
  },
  {
    img: '/Images/Leadership Illustration.png',
    title: '50-69',
    desc: 'Emerging traction. Strong enough to attract early investor attention.',
    sliderName: 'emerging',
    status: 'Growing',
  },
  {
    img: '/Images/Team Collaboration Session.png',
    title: '70+',
    desc: 'VC eligible. Founder can enter OMISP Capital discovery workflows.',
    sliderName: 'eligible',
    status: 'VC Ready',
  },
  {
    img: '/Images/Digital Financial Chart.png',
    title: '85+',
    desc: 'Elite signal. High-conviction profile for investors scanning the leaderboard.',
    sliderName: 'elite',
    status: 'Elite',
  },
];

const ScoreExplainer = () => {
  const [activeThreshold, setActiveThreshold] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveThreshold((prev) => (prev + 1) % thresholdItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="bg-[#FF8225] py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 lg:mb-24 flex flex-col items-center gap-4 md:gap-6">
          <p className="mb-1 md:mb-2 text-black font-tanker text-base md:text-lg font-semibold">OMISP Score System</p>
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white max-w-4xl font-tanker leading-tight">
            The 6D score that turns founder potential into investor signal
          </h1>
          <p className="text-center text-base md:text-lg lg:text-xl font-medium text-black max-w-4xl px-4">
            OMISP does not rank founders on self-reported hype. It scores credibility across six measurable dimensions,
            then combines them into a 100-point profile investors can actually use.
          </p>
        </div>

        {/* 6 Dimensions Grid - Mobile Optimized Feature166 Style */}
        <div className="relative flex justify-center mb-12 md:mb-16 px-4">
          <div className="relative flex w-full flex-col border border-muted">
            {/* Top Row: 3 columns -> stacked on mobile */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative group flex flex-col justify-between border-b border-solid border-muted md:border-r p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[0].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[0].detail}</p>
                </div>
                <img
                  src={dimensions[0].image}
                  alt={dimensions[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[0].image}
                    alt={dimensions[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="relative group flex flex-col justify-between border-b border-solid border-muted lg:border-r p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[1].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[1].detail}</p>
                </div>
                <img
                  src={dimensions[1].image}
                  alt={dimensions[1].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[1].image}
                    alt={dimensions[1].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="relative group flex flex-col justify-between border-b border-solid border-muted md:border-r lg:border-r-0 p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[2].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[2].detail}</p>
                </div>
                <img
                  src={dimensions[2].image}
                  alt={dimensions[2].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[2].image}
                    alt={dimensions[2].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: 3 columns -> stacked on mobile */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-solid border-muted lg:border-t-0">
              <div className="relative group flex flex-col justify-between border-b border-solid border-muted md:border-r md:border-b-0 lg:border-b p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[3].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[3].detail}</p>
                </div>
                <img
                  src={dimensions[3].image}
                  alt={dimensions[3].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[3].image}
                    alt={dimensions[3].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="relative group flex flex-col justify-between border-b border-solid border-muted lg:border-r lg:border-b p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[4].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[4].detail}</p>
                </div>
                <img
                  src={dimensions[4].image}
                  alt={dimensions[4].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[4].image}
                    alt={dimensions[4].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="relative group flex flex-col justify-between md:border-r-0 p-6 md:p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden min-h-[200px] md:min-h-[250px]">
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2">{dimensions[5].title}</h2>
                  <p className="text-black font-tanker mb-4 text-sm md:text-base">{dimensions[5].detail}</p>
                </div>
                <img
                  src={dimensions[5].image}
                  alt={dimensions[5].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
                <div className="hidden group-hover:block absolute inset-0 overflow-hidden z-10">
                  <img
                    src={dimensions[5].image}
                    alt={dimensions[5].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Thresholds - Custom Progressive Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-black mb-4 font-tanker px-4">What investors look for</h3>
          </div>
          
          <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
            {/* Left Panel - Threshold Buttons */}
            <div className="w-full lg:w-96 bg-white">
              {thresholdItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveThreshold(index)}
                  className={`relative w-full text-left p-4 md:p-6 border-b lg:border-b border-black/10 transition-all duration-300 ${
                    activeThreshold === index ? 'bg-black/5' : 'hover:bg-black/5'
                  }`}
                >
                  {/* Progress Bar */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-black/20 lg:block hidden">
                    <div 
                      className="bg-black w-full transition-all duration-300"
                      style={{ 
                        height: activeThreshold === index ? '100%' : '0%',
                        transitionDelay: activeThreshold === index ? '0ms' : '300ms'
                      }}
                    />
                  </div>
                  
                  {/* Mobile Progress Bar - Bottom */}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-black/20 lg:hidden">
                    <div 
                      className="bg-black h-full transition-all duration-300"
                      style={{ 
                        width: activeThreshold === index ? '100%' : '0%',
                        transitionDelay: activeThreshold === index ? '0ms' : '300ms'
                      }}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <h2 className='text-xl md:text-2xl font-bold text-black font-tanker'>
                      {item.title}
                    </h2>
                  </div>
                  <p className='text-xs md:text-sm font-medium text-black/70 leading-relaxed font-tanker'>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
            
            {/* Right Panel - Images */}
            <div className="flex-1 relative overflow-hidden bg-black min-h-[300px] md:min-h-[400px] lg:min-h-[400px]">
              {thresholdItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                    activeThreshold === index 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    className='absolute inset-0 h-full w-full object-cover object-center'
                    src={item.img}
                    alt={item.desc}
                    style={{ objectFit: 'cover', minWidth: '100%', minHeight: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-8 md:mt-12 px-4">
            <Button asChild className="bg-white text-primary hover:bg-black/90 font-tanker text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
              <Link to="/signup">
                <span className="text-black">Build My Score</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-black bg-transparent text-black hover:bg-black hover:text-primary font-tanker text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
              <Link to="/pricing">See Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoreExplainer;