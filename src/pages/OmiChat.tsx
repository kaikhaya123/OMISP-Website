import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, User, Bot, Sparkles, Brain, TrendingUp, Eye, Target, Users, Lightbulb, Zap, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFounderContext, buildContextSummary } from "@/hooks/useFounderContext";
import { publicEnv } from "@/lib/env";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona?: string;
  timestamp: Date;
}

interface Persona {
  id: string;
  name: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  systemPrompt: string;
  greetingTemplate: (ctx: any) => string;
}

const personas: Persona[] = [
  {
    id: "critic",
    name: "The Ruthless Critic",
    title: "Devil's Advocate",
    icon: Eye,
    color: "bg-red-500",
    description: "Challenges every assumption. Finds flaws before investors do.",
    systemPrompt: "You are a ruthless but caring startup critic. Your job is to find every flaw, weakness, and blind spot. Challenge assumptions aggressively using their ACTUAL metrics. Point out risks they haven't considered. Be direct and tough but always constructive.",
    greetingTemplate: (ctx) => {
      if (ctx?.profile?.current_mrr > 0) {
        return `Alright, let's talk. I see your MRR is $${ctx.profile.current_mrr.toLocaleString()} with ${ctx.profile.monthly_growth_rate}% growth. ${ctx.profile.monthly_growth_rate < 15 ? "That growth rate concerns me." : "Decent growth, but let's stress-test it."} Your OMISP Score is ${ctx.scores?.totalScore ?? 0}/100. I'm going to challenge every assumption — because VCs definitely will. What's the biggest risk you're ignoring right now? 🎯`;
      }
      return "Alright, let's hear it. What's your startup idea? I'm going to poke every hole I can find—because investors definitely will. Hit me. 🎯";
    },
  },
  {
    id: "cfo",
    name: "The CFO",
    title: "Financial Strategist",
    icon: TrendingUp,
    color: "bg-green-500",
    description: "Numbers-focused advisor. Ensures your unit economics work.",
    systemPrompt: "You are a seasoned CFO advisor. Think in terms of unit economics, LTV:CAC ratios, burn rate, and runway. Always reference the founder's ACTUAL financial metrics. Challenge their financial assumptions with real-world benchmarks.",
    greetingTemplate: (ctx) => {
      if (ctx?.profile?.current_mrr > 0) {
        return `Hello! Let's dive into your numbers. I see you're at $${ctx.profile.current_mrr.toLocaleString()} MRR with a team of ${ctx.profile.team_size}. ${ctx.profile.total_funding_raised > 0 ? `You've raised $${ctx.profile.total_funding_raised.toLocaleString()} — ` : ""}At ${ctx.profile.monthly_growth_rate}% MoM growth, you could hit $${Math.round(ctx.profile.current_mrr * Math.pow(1 + ctx.profile.monthly_growth_rate / 100, 12)).toLocaleString()} MRR in 12 months. Let's make sure your unit economics support that trajectory. 📊`;
      }
      return "Hello! Let's talk numbers. Tell me about your business — what's your current MRR, CAC, and LTV? 📊";
    },
  },
  {
    id: "visionary",
    name: "The Visionary",
    title: "Big Picture Thinker",
    icon: Lightbulb,
    color: "bg-purple-500",
    description: "Sees the 10-year view. Helps you dream bigger.",
    systemPrompt: "You are a visionary thinker who sees beyond the current product. Help founders think about platform potential, network effects, and market creation. Use their actual metrics to project future scenarios.",
    greetingTemplate: (ctx) => {
      if (ctx?.profile?.current_mrr > 0) {
        const projected = Math.round(ctx.profile.current_mrr * Math.pow(1 + ctx.profile.monthly_growth_rate / 100, 12));
        return `Welcome! With $${ctx.profile.current_mrr.toLocaleString()} MRR and ${ctx.profile.monthly_growth_rate}% growth, you could be at $${projected.toLocaleString()} in a year. But I want to know — where does this go in 10 years? The best companies don't just grow, they create entire categories. What's your category-defining vision? ✨`;
      }
      return "Welcome, dreamer! The best companies don't compete in markets — they create new ones. Tell me your vision. ✨";
    },
  },
  {
    id: "cmo",
    name: "The CMO",
    title: "Growth Marketing Expert",
    icon: Target,
    color: "bg-blue-500",
    description: "Discusses marketing, CAC/LTV, and scaling acquisition.",
    systemPrompt: "You are a battle-tested CMO who has scaled startups. Focus on customer acquisition, CAC optimization, channel strategy, and brand building. Use the founder's actual metrics to give specific marketing advice.",
    greetingTemplate: (ctx) => {
      if (ctx?.profile?.current_mrr > 0) {
        return `Let's talk growth! You're at $${ctx.profile.current_mrr.toLocaleString()} MRR with a team of ${ctx.profile.team_size}. ${ctx.profile.monthly_growth_rate > 20 ? "Your growth rate is strong — but can you sustain it?" : "Let's figure out how to accelerate your growth."} What's your primary acquisition channel right now, and what does your funnel look like? 🚀`;
      }
      return "Let's talk growth strategy. What's your primary acquisition channel, and what does your current funnel look like? 🚀";
    },
  },
  {
    id: "cto",
    name: "The CTO",
    title: "Tech Strategy Advisor",
    icon: Users,
    color: "bg-yellow-500",
    description: "Discusses tech strategy, architecture, and engineering.",
    systemPrompt: "You are a seasoned CTO who has built engineering teams from 2 to 200+. Focus on tech architecture, engineering team building, tech debt, and scalability. Reference the founder's team size and stage.",
    greetingTemplate: (ctx) => {
      if (ctx?.profile?.team_size) {
        return `Hey there! With a team of ${ctx.profile.team_size}, ${ctx.profile.team_size <= 5 ? "you need to be extremely deliberate about architecture decisions — every choice will compound." : "you're at the stage where engineering processes start to matter as much as the code."} What's your current tech stack, and what keeps you up at night technically? 💻`;
      }
      return "Let's talk tech strategy. What's your current stack, and where are the biggest technical risks? 💻";
    },
  },
  {
    id: "mentor",
    name: "Omi",
    title: "Your AI Co-founder",
    icon: Brain,
    color: "bg-gradient-to-br from-primary to-purple-600",
    description: "Balanced advice. Your go-to thinking partner who knows everything about OMISP.",
    systemPrompt: "You are Omi, a wise AI co-founder. You combine the best traits of great startup mentors. You're an expert on the OMISP scoring system and can explain how to improve any dimension. Draw on startup frameworks, real company examples, and founder psychology.",
    greetingTemplate: (ctx) => {
      if (ctx?.scores) {
        const s = ctx.scores;
        const weakest = Object.entries({
          "Idea Viability": s.ideaViability,
          "Founder Aptitude": s.founderAptitude,
          "Execution Readiness": s.executionReadiness,
          "Behavioral Resilience": s.behavioralResilience,
          "Progress Velocity": s.progressVelocity,
          "Unicorn Potential": s.unicornPotential,
        }).sort((a, b) => (a[1] as number) - (b[1] as number))[0];

        return `Hey${ctx.profile?.full_name ? ` ${ctx.profile.full_name}` : ''}! I'm Omi, your AI co-founder. Your OMISP Score is ${s.totalScore}/100${s.isVCEligible ? ' — you\'re VC eligible! 🎉' : ` — you need ${70 - s.totalScore} more points for VC eligibility.`} Your strongest area is great, but ${weakest[0]} (${weakest[1]}) could use attention. Want to work on improving that, or is something else on your mind? 🧠`;
      }
      return "Hey! I'm Omi, your AI co-founder. Whether you need to brainstorm strategy, improve your OMISP Score, or think through a tough decision, I'm here. What's on your mind? 🧠";
    },
  },
];

const OmiChat = () => {
  const { toast } = useToast();
  const { context, loading: contextLoading } = useFounderContext();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[5]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set greeting when persona changes or context loads
  useEffect(() => {
    if (selectedPersona && !contextLoading) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: selectedPersona.greetingTemplate(context),
        persona: selectedPersona.name,
        timestamp: new Date()
      }]);
      setStreamingContent("");
    }
  }, [selectedPersona, contextLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    const conversationHistory = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const founderContextStr = context ? buildContextSummary(context) : undefined;

      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/omi-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          persona: selectedPersona.name,
          personaPrompt: selectedPersona.systemPrompt,
          founderContext: founderContextStr,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setStreamingContent(fullContent);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullContent,
        persona: selectedPersona.name,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent("");

    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Connection issue",
        description: error instanceof Error ? error.message : "Failed to connect to AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Omi Chat
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Context-Aware AI
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">AI advisors with full knowledge of your business</p>
            </div>
          </div>
          {context?.scores && (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                OMISP: {context.scores.totalScore}/100
              </div>
              <div className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                MRR: ${context.profile?.mrr_usd?.toLocaleString() ?? 0}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex gap-6 max-h-[calc(100vh-80px)]">
        {/* Persona Selector */}
        <div className="w-80 hidden lg:block space-y-4 overflow-auto">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Choose Your Advisor</h2>
          <div className="space-y-2">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPersona.id === persona.id 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedPersona(persona)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${persona.color} flex items-center justify-center flex-shrink-0`}>
                    <persona.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm">{persona.name}</h3>
                    <p className="text-xs text-muted-foreground">{persona.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{persona.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Context Panel */}
          {context?.scores && (
            <Card className="mt-4 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-primary" />
                  Your Context
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OMISP Score</span>
                    <span className="font-medium">{context.scores.totalScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MRR</span>
                    <span className="font-medium">${context.profile?.mrr_usd?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-medium">{context.profile?.growth_percent ?? 0}% MoM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team</span>
                    <span className="font-medium">{context.profile?.team_size ?? 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milestones</span>
                    <span className="font-medium">{context.milestones.length}</span>
                  </div>
                  {context.scores.isVCEligible && (
                    <Badge className="w-full justify-center mt-2 bg-accent/50 text-accent-foreground">✅ VC Eligible</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Persona Selector */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {personas.map((persona) => (
                <Button
                  key={persona.id}
                  variant={selectedPersona.id === persona.id ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  onClick={() => setSelectedPersona(persona)}
                >
                  <persona.icon className="w-4 h-4" />
                  {persona.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Persona Header */}
          <Card className="mb-4 bg-gradient-to-r from-card to-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${selectedPersona.color} flex items-center justify-center shadow-lg`}>
                <selectedPersona.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedPersona.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedPersona.description}</p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="w-3 h-3" />
                AI Powered
              </Badge>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={selectedPersona.color}>
                          <Bot className="w-4 h-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {streamingContent && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={selectedPersona.color}>
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
                    </div>
                  </div>
                )}
                {isLoading && !streamingContent && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={selectedPersona.color}>
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${selectedPersona.name} anything...`}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Omi has full context of your metrics, scores, milestones, and business data
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OmiChat;
