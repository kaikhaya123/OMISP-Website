import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import creatingAppAnimation from "../../public/Lottie/Creating Application.json";

const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["credible", "fundable", "unstoppable", "validated", "investable"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <>
      {/* Full Screen Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Content Container */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left Column - Content */}
            <div className="flex gap-4 md:gap-5 items-start flex-col">

          {/* Animated Title */}
          <div className="flex gap-3 md:gap-4 flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-left font-regular leading-[1.1]">
              <span className="text-foreground">Build something</span>
              <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-primary"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-sm text-black-900 md:text-base lg:text-lg leading-relaxed text-foreground/80 max-w-xl text-left mt-2" style={{ fontFamily: 'Lora, serif' }}>
              Stop guessing and start winning. OMISP transforms your raw potential into AI-validated credibility that top-tier VCs can't ignore.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-start mt-2">
            <Link to="/signup">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 w-full sm:w-auto" style={{ fontFamily: 'Tanker, sans-serif' }}>
                Start Building Your Score
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

            {/* Right Column - Lottie Animation */}
            <div className="flex items-center justify-center">
              <Lottie 
                animationData={creatingAppAnimation} 
                loop={true}
                className="w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

    {/* Scroll Animation Section */}
    <section className="relative overflow-hidden bg-background">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Your AI-Powered
              <br />
              <span className="text-4xl md:text-[4rem] font-bold mt-1 leading-none bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Credibility Engine
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Track milestones, validate progress, and build your OMISP Score in real-time
            </p>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop&q=80"
          alt="OMISP Dashboard"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </section>
    </>
  );
};

export default Hero;
