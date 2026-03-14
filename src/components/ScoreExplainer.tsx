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
    image: "/Images/Data Analysis Discussion.png",
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
    <section className="bg-[#FFC300] py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-24 flex flex-col items-center gap-6">
          <p className="mb-2 text-black font-tanker text-lg font-semibold">OMISP Score System</p>
          <h1 className="text-center text-3xl font-semibold text-white lg:max-w-4xl lg:text-5xl font-tanker">
            The 6D score that turns founder potential into investor signal
          </h1>
          <p className="text-center text-lg font-medium text-black md:max-w-4xl lg:text-xl">
            OMISP does not rank founders on self-reported hype. It scores credibility across six measurable dimensions,
            then combines them into a 100-point profile investors can actually use.
          </p>
        </div>

        {/* 6 Dimensions Grid - Feature166 Style */}
        <div className="relative flex justify-center mb-16">
          <div className="relative flex w-full flex-col border border-muted">
            {/* Top Row: 3 columns */}
            <div className="relative flex flex-col lg:flex-row">
              <div className="relative group flex flex-col justify-between border-b border-r border-solid border-muted p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[0].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[0].detail}</p>
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
              
              <div className="relative group flex flex-col justify-between border-b border-r border-solid border-muted p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[1].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[1].detail}</p>
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

              <div className="relative group flex flex-col justify-between border-b border-solid border-muted p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[2].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[2].detail}</p>
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

            {/* Bottom Row: 3 columns */}
            <div className="relative flex flex-col border-t border-solid border-muted lg:flex-row">
              <div className="relative group flex flex-col justify-between border-r border-solid border-muted p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[3].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[3].detail}</p>
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
              
              <div className="relative group flex flex-col justify-between border-r border-solid border-muted p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[4].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[4].detail}</p>
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

              <div className="relative group flex flex-col justify-between p-10 lg:w-1/3 hover:bg-gray-50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-white mb-2">{dimensions[5].title}</h2>
                  <p className="text-black font-tanker mb-4">{dimensions[5].detail}</p>
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
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-black mb-4 font-tanker">What investors look for</h3>
            <Badge className="bg-black text-primary border-black">Thresholds</Badge>
          </div>
          
          <div className="flex rounded-2xl overflow-hidden shadow-2xl">
            {/* Left Panel - Threshold Buttons */}
            <div className="w-96 bg-black">
              {thresholdItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveThreshold(index)}
                  className={`relative w-full text-left p-6 border-b border-white/10 transition-all duration-300 ${
                    activeThreshold === index ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Progress Bar */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-primary/30">
                    <div 
                      className="bg-primary w-full transition-all duration-300"
                      style={{ 
                        height: activeThreshold === index ? '100%' : '0%',
                        transitionDelay: activeThreshold === index ? '0ms' : '300ms'
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h2 className='text-2xl font-bold text-primary font-tanker'>
                      {item.title}
                    </h2>
                    <span className='px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full font-tanker'>
                      {item.status}
                    </span>
                  </div>
                  <p className='text-sm font-medium text-white leading-relaxed font-tanker'>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
            
            {/* Right Panel - Images */}
            <div className="flex-1 relative overflow-hidden bg-black min-h-[400px]">
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild className="bg-black text-primary hover:bg-black/90 font-tanker text-lg px-8 py-3">
              <Link to="/signup">
                Build My Score
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-black bg-transparent text-black hover:bg-black hover:text-primary font-tanker text-lg px-8 py-3">
              <Link to="/pricing">See Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoreExplainer;