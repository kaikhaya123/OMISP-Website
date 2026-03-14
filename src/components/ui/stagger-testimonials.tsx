"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "OMISP helped me build a financial model that impressed investors. Raised $1.5M seed round within 3 months.",
    by: "Sarah Chen, Founder at TechFlow",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "The Pitch Perfect Gauntlet transformed my pitch. I went from nervous to confident in just 2 weeks.",
    by: "Marcus Johnson, CEO at DataPulse",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "Found my co-founder on Ideaverse Hub. Now we're a team of 12 with $3M ARR.",
    by: "Priya Sharma, Co-founder at FinLeap",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "OMISP's financial modeling tools are a game changer. Saved me weeks of work and made my deck investor-ready.",
    by: "David Park, Founder at CloudVenture",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. OMISP is essential for every founder.",
    by: "Andre Williams, Head of Product at CreativeLabs",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! The OMISP score gave me clarity on what investors actually care about.",
    by: "Jeremy Davis, Product Manager at GrowthStack",
    imgSrc: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're using OMISP, it's part of our daily workflow.",
    by: "Pam Torres, Marketing Director at BrandLabs",
    imgSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop"
  },
  {
    tempId: 7,
    testimonial: "OMISP's analytics showed me exactly what metrics VCs want to see. The ROI is EASILY 100X for my time.",
    by: "Daniel Kim, Data Scientist at MetricsPro",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    tempId: 8,
    testimonial: "It's just the best platform for founders. Period.",
    by: "Fernando Lopez, UX Designer at UserVerse",
    imgSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop"
  },
  {
    tempId: 9,
    testimonial: "I switched to OMISP 2 years ago and never looked back. Every founder needs this.",
    by: "Andy Chen, DevOps Engineer at ScaleTech",
    imgSrc: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=150&h=150&fit=crop"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a fundraising solution like OMISP for YEARS. So glad I finally found one!",
    by: "Pete Anderson, Sales Director at RevOps",
    imgSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
  },
  {
    tempId: 11,
    testimonial: "It's so simple and intuitive, our entire founding team was up to speed in 10 minutes.",
    by: "Marina Santos, Operations Lead at StartupForge",
    imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
  },
  {
    tempId: 12,
    testimonial: "OMISP's fundraising tools are unparalleled. They guided us through our entire $2M Series A.",
    by: "Olivia Brown, Founder at GrowthHub",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  },
  {
    tempId: 13,
    testimonial: "The efficiency gains we've seen since using OMISP are off the charts! Cut our fundraising prep by 60%.",
    by: "Raj Patel, Operations Manager at StreamlineAI",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    tempId: 14,
    testimonial: "OMISP has revolutionized how we approach fundraising. It's a complete game-changer!",
    by: "Lila Martinez, Strategy Lead at VentureFlow",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
  },
  {
    tempId: 15,
    testimonial: "The AI pitch coaching on OMISP feels like having a VC in my pocket. Incredible preparation tool.",
    by: "Trevor Jackson, Founder at ScaleUp",
    imgSrc: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop"
  },
  {
    tempId: 16,
    testimonial: "I appreciate how OMISP continually innovates. The Build-a-Biz feature is genius!",
    by: "Naomi Lee, Innovation Lead at FutureLabs",
    imgSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop"
  },
  {
    tempId: 17,
    testimonial: "The ROI we've seen with OMISP is incredible. It paid for itself before we even closed our round.",
    by: "Victor Rhodes, Finance Lead at CapitalWise",
    imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop"
  },
  {
    tempId: 18,
    testimonial: "OMISP's platform is so robust, yet easy to use. Perfect for first-time founders like me.",
    by: "Yuki Tanaka, Tech Founder at InnovateCo",
    imgSrc: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop"
  },
  {
    tempId: 19,
    testimonial: "We've tried many fundraising platforms, but OMISP stands out in terms of reliability and depth.",
    by: "Zoe Williams, Founder at NextGenTech",
    imgSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-primary text-primary-foreground border-primary" 
          : "z-0 bg-[#FFF8DC] text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-primary-foreground" : "text-foreground"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/30"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
