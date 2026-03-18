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
        <div className="absolute inset-0 -top-20 bottom-0 bg-black/45  z-0" />
        
        {/* Bottom-left floating content */}
        <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-2rem)] sm:bottom-6 sm:left-6 sm:w-auto md:bottom-10 md:left-12 lg:bottom-12 lg:left-16">
          <div className="max-w-xs sm:max-w-md">
            {/* Headline Section - Left-aligned */}
            <div className="flex w-full flex-col gap-4 text-left md:gap-6">
              {/* Animated Title */}
              <div className="flex w-full flex-col gap-3 md:gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter text-left font-regular leading-[1.1]">
                  <span className="text-white">Build something</span>
                  <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                    &nbsp;
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute font-semibold text-primary"
                        style={{ color: '#FF8225' }}
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

                <p className="mt-2 max-w-sm text-left text-sm leading-relaxed text-white md:text-base" style={{ fontFamily: 'Tanker, sans-serif' }}>
                  Stop guessing and start winning. OMISP transforms your raw potential into AI-validated credibility that top-tier VCs can't ignore.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-2 flex w-full">
                <Link to="/signup" className="w-auto">
                  <Button size="default" className="w-auto px-6 py-3" style={{ fontFamily: 'Tanker, sans-serif', backgroundColor: '#FF8225', color: 'black' }}>
                    Start Building Your Score
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Scroll Animation Section */}
    <section className="bg-white relative overflow-hidden bg-background py-8 md:py-16">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 px-4 text-center">
              Your AI-Powered
              <br className="hidden sm:block" />
              <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-1 leading-none bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
                <span className="text-[#FF8225]"> Credibility Engine</span>
              </span>
            </h2>
            <p className="text-black text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4 text-center">
              Track milestones, validate progress, and build your OMISP Score in real-time
            </p>
          </>
        }
      >
        <video
          src="/Videos/0_Business_Meeting_Teamwork_3840x2160 (1).mp4"
          className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
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
