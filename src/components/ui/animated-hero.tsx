import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedHero() {
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
    <div className="w-full bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 py-20 lg:py-32 items-center">
          {/* Left Side - Text Content */}
          <div className="flex gap-6 flex-col order-2 lg:order-1">
            <div>
              <Button variant="secondary" size="sm" className="gap-4 mb-6">
                Read our launch article <MoveRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-4 flex-col">
              <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-2xl tracking-tighter text-left font-regular">
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

              <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                Stop guessing and start winning. OMISP transforms your raw potential into AI-validated credibility that top-tier VCs can't ignore. Build your score, prove your execution, and secure your round—before your competitors do.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button size="lg" className="gap-4">
                Start Building <MoveRight className="w-4 h-4" />
              </Button>
              <Button size="lg" className="gap-4" variant="outline">
                Talk to Sales <PhoneCall className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-border mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12,000+</p>
                  <p className="text-sm text-muted-foreground">Active Founders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$850M+</p>
                  <p className="text-sm text-muted-foreground">Funding Raised</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Visual */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                <div className="aspect-[4/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
                    alt="OMISP Dashboard Analytics"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  
                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute bottom-6 left-6 right-6"
                  >
                    <div className="bg-background/95 backdrop-blur-lg border border-border rounded-xl p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">OMISP Score</p>
                          <p className="text-sm text-muted-foreground">AI-Validated Credibility</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">87</p>
                          <p className="text-xs text-muted-foreground">Top 5%</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
