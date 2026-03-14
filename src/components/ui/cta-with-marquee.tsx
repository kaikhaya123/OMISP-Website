"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface MarqueeProps {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  speed?: number;
}

function Marquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 40,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] [gap:var(--gap)]",
        className
      )}
      style={
        {
          "--duration": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

// Founder and startup related images
const images = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
];

const images2 = [
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop",
];

interface ScrambleButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  icon?: ReactNode;
}

function ScrambleButton({ text, onClick, variant = "primary", className, icon }: ScrambleButtonProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 border-2 border-black";
  const variantStyles = variant === "primary" 
    ? "bg-primary text-black hover:bg-primary/90" 
    : "border-2 border-foreground text-foreground hover:bg-foreground hover:text-background";

  return (
    <button
      onMouseEnter={scramble}
      onClick={onClick}
      className={cn(baseStyles, variantStyles, className)}
    >
      {displayText}
    </button>
  );
}

interface CTAWithMarqueeProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function CTAWithMarquee({
  title = "Ready to Build Your Credibility?",
  subtitle = "Join 12,000+ founders who are proving their potential and getting discovered by top VCs.",
  primaryButtonText = "Start Building Your Score",
  secondaryButtonText = "I'm a VC",
  onPrimaryClick,
  onSecondaryClick,
}: CTAWithMarqueeProps) {
  return (
    <div className="min-h-[600px] bg-[#FFC300] text-black flex items-center overflow-hidden relative py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-tanker">
              {title}
            </h2>
            <p className="text-lg text-black border-black max-w-xl font-tanker">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <ScrambleButton 
                text={primaryButtonText}
                onClick={onPrimaryClick}
                variant="primary"
              />
            </div>
          </div>

          {/* Right Marquee Grid */}
          <div className="space-y-4 overflow-hidden">
            <Marquee speed={30} reverse className="[--gap:1rem]">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={`Founder ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
            <Marquee speed={30} className="[--gap:1rem]">
              {images2.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={`Founder ${idx + 5}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
