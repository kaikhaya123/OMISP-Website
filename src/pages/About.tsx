import { Header } from "@/components/ui/header-2";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const platformFeatures = [
  {
    icon: "/Icons/leadership (1).png",
    title: "Mission-Driven",
    description: "Our mission is to democratize access to venture capital by providing founders with the tools to prove their potential.",
    color: "bg-feature-orange",
  },
  {
    icon: "/Icons/blocks (1).png",
    title: "Build Your Score",
    description: "Use AI tools to improve your pitch, validate ideas, and track real-time progress with your OMISP Score.",
    color: "bg-feature-purple",
  },
  {
    icon: "/Icons/database.png",
    title: "Data Integrity",
    description: "We believe in verified credibility. Every point in an OMISP Score is backed by real actions and progress.",
    color: "bg-feature-pink",
  },
  {
    icon: "/Icons/partners.png",
    title: "Community First",
    description: "Building a company is lonely. We're creating a global ecosystem where founders support each other.",
    color: "bg-feature-teal",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/20 overflow-hidden min-h-screen flex items-center">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-tanker font-bold leading-tight">
                  The Credit Score for <span className="font-tanker text-primary">Founders</span>
                </h1>
                <p className="text-lg text-black leading-relaxed max-w-xl">
                  For too long, venture capital has relied on warm introductions and prestigious 
                  backgrounds. We believe that great founders can come from anywhere. OMISP 
                  provides a standardized way to build, track, and prove your credibility.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-tanker text-base px-8 py-6">
                    Get Started
                  </Button>
                </Link>
              </motion.div>

              {/* Right Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Hidden SVG with clip path definition */}
                <svg className="absolute -top-[999px] -left-[999px] w-0 h-0">
                  <defs>
                    <clipPath id="differentone23" clipPathUnits="objectBoundingBox">
                      <path
                        d="M0 0H0.479167C0.766667 0 1 0.233333 1 0.520833V1H0.520833C0.233333 1 0 0.766667 0 0.479167V0Z"
                        fill="black"
                      />
                    </clipPath>
                  </defs>
                </svg>
                
                {/* Image with clip path applied */}
                <figure style={{ clipPath: 'url(#differentone23)' }} className="relative overflow-hidden">
                  <img
                    src="/Images/Group Celebration.png"
                    alt="Global Collaboration"
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </figure>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm font-tanker text-primary mb-2 uppercase tracking-wide">OMISP Platform</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-tanker font-bold text-black mb-4">
                Infrastructure for the next<br />generation of founders
              </h2>
              <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
                OMISP combines AI-powered strategic training with real-world milestone tracking, 
                giving VCs a data-driven way to discover high-potential founders and founders 
                a clear path to becoming investor-ready. Build credibility, connect with capital, 
                and grow with tools designed for success.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center space-y-4 border-0"
                >
                  <div className="flex items-center justify-center mx-auto">
                    <img src={feature.icon} alt={feature.title} className="w-16 h-16" />
                  </div>
                  <h3 className="text-xl font-tanker font-semibold text-black">{feature.title}</h3>
                  <p className="text-sm text-black leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Story Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-sm font-tanker text-primary mb-2 uppercase tracking-wide">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-tanker font-bold text-black mb-6">
                How OMISP came about
              </h2>
              
              <div className="space-y-4 text-black mb-12 leading-relaxed">
                <p>
                  The venture capital industry has long operated on connections and pedigree. 
                  If you didn't go to the right school or know the right people, your chances 
                  of raising capital were slim—no matter how good your idea was. We knew there 
                  had to be a better way.
                </p>
                <p>
                  OMISP was born from a simple question: What if founders could build credibility 
                  the same way consumers build credit scores? What if VCs could discover talent 
                  based on real progress and validated milestones, not just warm introductions?
                </p>
                <p>
                  Today, OMISP is making that vision a reality. We're building the infrastructure 
                  for a new generation of founders—one where your OMISP Score speaks louder than 
                  your zip code. We're creating a world where anyone with drive, grit, and a 
                  great idea can prove they're investment-ready.
                </p>
              </div>

              {/* Team Collaboration Image */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Hidden SVG with clip path definition */}
                  <svg className="absolute -top-[999px] -left-[999px] w-0 h-0">
                    <defs>
                      <clipPath id="clip-mask-1" clipPathUnits="objectBoundingBox">
                        <path
                          d="M0.71161 0H0V1H0.0362048C0.236734 1 0.42296 0.940031 0.577199 0.837408H0.74407V0.718826H0.888889V0.5H1V0.0562347V0H0.71161Z"
                          fill="black"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  
                  {/* Image with clip path applied */}
                  <figure style={{ clipPath: 'url(#clip-mask-1)' }} className="2xl:h-[44rem] h-80">
                    <img
                      src="/Images/pexels-ketut-subiyanto-4623510.jpg"
                      alt="Professional Collaboration"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </figure>
                  <h3 className="text-xl font-tanker font-bold text-black mt-4">Empowering Founders</h3>
                  <p className="text-sm text-black">Building credibility through verified milestones</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Hidden SVG with clip path definition */}
                  <svg className="absolute -top-[999px] -left-[999px] w-0 h-0">
                    <defs>
                      <clipPath id="clip-mask-2" clipPathUnits="objectBoundingBox">
                        <path
                          d="M0.71161 0H0V1H0.0362048C0.236734 1 0.42296 0.940031 0.577199 0.837408H0.74407V0.718826H0.888889V0.5H1V0.0562347V0H0.71161Z"
                          fill="black"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  
                  {/* Image with clip path applied */}
                  <figure style={{ clipPath: 'url(#clip-mask-2)' }} className="2xl:h-[44rem] h-80">
                    <img
                      src="/Images/pexels-yankrukov-7793692.jpg"
                      alt="Team Collaboration"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </figure>
                  <h3 className="text-xl font-tanker font-bold text-black mt-4">Connecting Capital</h3>
                  <p className="text-sm text-black">Data-driven discovery for venture capitalists</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
