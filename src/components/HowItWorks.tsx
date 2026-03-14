// Stacking Cards Design - thanks to oliver: https://www.youtube.com/@olivierlarose1
'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: "01",
    title: "Build Your Profile",
    description: "Create your founder profile and start using our AI-powered tools to validate your ideas and track progress.",
    image: "/Images/Business Handshake Scene.png",
    color: '#FFC300',
  },
  {
    number: "02",
    title: "Train & Improve",
    description: "Practice pitching, build financial models, and learn through simulation. Get AI-powered feedback to refine your approach.",
    image: "/Images/Professional Meeting Scene.png",
    color: '#000000',
  },
  {
    number: "03",
    title: "Track Progress",
    description: "Log real milestones like revenue, team size, and funding to boost your OMISP score and build verified credibility.",
    image: "/Images/Data Analysis Discussion.png",
    color: '##FFC300',
  },
  {
    number: "04",
    title: "Get Discovered",
    description: "VCs find you through OMISP Capital based on your verified credibility and AI-validated potential.",
    image: "/Images/Office Collaboration Scene.png",
    color: '#000000',
  },
];

const HowItWorks = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <main ref={container} className="bg-white">
        {/* Header Section */}
        <section className="text-foreground h-[70vh] w-full bg-white grid place-content-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          <div className="relative z-10 text-center px-8">
            <h2 className="text-black 2xl:text-7xl text-5xl font-bold tracking-tight leading-[120%] mb-4 font-tanker">
              How OMISP Works
            </h2>
            <p className="text-black text-lg  max-w-2xl mx-auto font-tanker">
              A simple path from aspiring founder to funded startup. Scroll down! 👇
            </p>
          </div>
        </section>

        {/* Stacking Cards Section */}
        <section className="text-foreground w-full bg-white pb-20">
          {steps.map((step, i) => {
            const targetScale = 1 - (steps.length - i) * 0.05;
            return (
              <Card
                key={`step_${i}`}
                i={i}
                number={step.number}
                title={step.title}
                color={step.color}
                description={step.description}
                image={step.image}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
};

interface CardProps {
  i: number;
  number: string;
  title: string;
  description: string;
  image: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  number,
  title,
  description,
  image,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] h-[450px] w-[90%] md:w-[80%] lg:w-[70%] rounded-2xl p-4 sm:p-6 lg:p-10 origin-top shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl font-bold text-white/30 font-tanker">{number}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white font-tanker">{title}</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-10">
          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <p className="text-sm md:text-base text-white leading-relaxed font-tanker">
              {description}
            </p>
          </div>

          <div className="relative w-full lg:w-[60%] h-full min-h-[200px] rounded-lg overflow-hidden shadow-lg">
            <motion.div
              className="w-full h-full"
              style={{ scale: imageScale }}
            >
              <img 
                src={image} 
                alt={title} 
                className="object-cover w-full h-full" 
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
