import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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
      {/* Full Screen Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 -top-20 bottom-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 -top-20 bottom-0 bg-black/40 z-0" />
        
        {/* Content Container */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10 py-12">
          <div className="flex flex-col items-center gap-8 md:gap-12 max-w-7xl mx-auto">
            
            {/* Headline Section - Centered */}
            <div className="flex gap-4 md:gap-6 items-center flex-col text-center w-full">
              {/* Animated Title */}
              <div className="flex gap-3 md:gap-4 flex-col items-center w-full">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-center font-regular leading-[1.1]">
                  <span className="text-white">Build something</span>
                  <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
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

                <p className="text-xs md:text-sm lg:text-base leading-relaxed text-white max-w-2xl text-center mt-2" style={{ fontFamily: 'Tanker, sans-serif' }}>
                  Stop guessing and start winning. OMISP transforms your raw potential into AI-validated credibility that top-tier VCs can't ignore.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Link to="/signup">
                  <Button size="default" className="shadow-lg shadow-primary/25 w-full sm:w-auto" style={{ fontFamily: 'Tanker, sans-serif' }}>
                    Start Building Your Score
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Scroll Animation Section */}
    <section className="bg-white relative overflow-hidden bg-background">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-black text-3xl md:text-5xl font-bold mb-4">
              Your AI-Powered
              <br />
              <span className="text-4xl md:text-[4rem] font-bold mt-1 leading-none bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Credibility Engine
              </span>
            </h2>
            <p className="text-black text-lg md:text-xl max-w-2xl mx-auto">
              Track milestones, validate progress, and build your OMISP Score in real-time
            </p>
          </>
        }
      >
        <video
          src="/Videos/573273_Business_Stock_3840x2160.mp4"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          autoPlay
          loop
          muted
          playsInline
        />
      </ContainerScroll>
    </section>
    </>
  );
};

export default Hero;
