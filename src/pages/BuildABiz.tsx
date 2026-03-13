import { useState } from "react";
import { ArrowLeft, Play, RotateCcw, TrendingUp, TrendingDown, Users, DollarSign, Zap, AlertTriangle, CheckCircle, Clock, Sparkles, Brain, Lightbulb, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { publicEnv } from "@/lib/env";

interface GameState {
  month: number;
  cash: number;
  mrr: number;
  customers: number;
  employees: number;
  morale: number;
  burnRate: number;
  runway: number;
  score: number;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  context: string;
  options: {
    text: string;
    effects: Partial<GameState>;
    outcome: string;
  }[];
}

interface AIAdvice {
  analysis: string;
  optionInsights: {
    option: number;
    pros: string[];
    cons: string[];
    riskLevel: string;
  }[];
  recommendation: number;
  reasoning: string;
  realWorldExample: string;
}

const scenarios: Decision[] = [
  {
    id: "1",
    title: "Product Launch Strategy",
    description: "Your MVP is ready after months of building. How do you want to launch?",
    context: "The product has been tested with 50 beta users who gave positive feedback.",
    options: [
      { text: "Soft launch to beta users first", effects: { customers: 50, mrr: 2500, cash: -5000, morale: 5 }, outcome: "Slow start but valuable feedback. Users love the product! You've learned what features to prioritize." },
      { text: "Big launch with PR and Product Hunt", effects: { customers: 200, mrr: 10000, cash: -25000, morale: 10 }, outcome: "Massive attention! But servers crashed twice and support was overwhelmed. Still, you're on the map now." },
      { text: "Partner with an industry influencer", effects: { customers: 150, mrr: 7500, cash: -15000, morale: 8 }, outcome: "Great visibility. The influencer's authentic endorsement converted well and brought quality leads." }
    ]
  },
  {
    id: "2",
    title: "The Hiring Dilemma",
    description: "Your two-person team is stretched thin. You need to grow, but how?",
    context: "Current workload is unsustainable. Customers are waiting longer for support.",
    options: [
      { text: "Hire a senior engineer ($12k/mo)", effects: { employees: 1, burnRate: 12000, cash: -5000, morale: 5 }, outcome: "Velocity doubled. Technical debt is being addressed. The senior engineer also mentors you on architecture." },
      { text: "Hire two junior developers ($7k/mo each)", effects: { employees: 2, burnRate: 14000, cash: -3000, morale: 3 }, outcome: "More hands on deck but training takes time. They're eager and bringing fresh perspectives." },
      { text: "Outsource to a dev agency", effects: { burnRate: 8000, cash: -10000, morale: -2 }, outcome: "Fast delivery but communication gaps. The agency delivers features but doesn't understand your vision." }
    ]
  },
  {
    id: "3",
    title: "Market Downturn",
    description: "Economic uncertainty hits. VCs are pulling back. Customers are churning.",
    context: "Two of your enterprise customers just cancelled. News headlines are grim.",
    options: [
      { text: "Cut costs aggressively (layoff)", effects: { employees: -1, burnRate: -8000, morale: -15, cash: 0 }, outcome: "Runway extended to 18 months. Team morale is low but survivors are focused. You had to let go of a good person." },
      { text: "Double down on sales outreach", effects: { customers: 30, mrr: 1500, cash: -10000, morale: 5 }, outcome: "Revenue grew despite the market. Your team's hustle impressed. Some deals were discounted but they're real customers." },
      { text: "Pivot to enterprise/government", effects: { customers: 5, mrr: 15000, cash: -20000, morale: 0 }, outcome: "Longer sales cycles but bigger contracts. You landed a government contract that's recession-proof." }
    ]
  },
  {
    id: "4",
    title: "Competitor Crisis",
    description: "A well-funded competitor just launched a similar product at half your price.",
    context: "They raised $50M and are aggressively marketing. You're seeing mentions on social.",
    options: [
      { text: "Match their pricing immediately", effects: { mrr: -5000, customers: 20, morale: -5 }, outcome: "Retained most customers but margins are now razor thin. The team is worried about sustainability." },
      { text: "Go premium with better features", effects: { mrr: 3000, customers: -10, cash: -15000, morale: 5 }, outcome: "Lost price-sensitive customers but ARPU increased significantly. You're now the 'premium' choice." },
      { text: "Target a different niche market", effects: { customers: 40, mrr: 2000, cash: -8000, morale: 10 }, outcome: "Found an underserved vertical. Competition is less fierce and customers value your specialization." }
    ]
  },
  {
    id: "5",
    title: "Acquisition Offer",
    description: "A tech giant wants to acquire you for $2M. Your company is valued at $1.5M.",
    context: "The acquirer is a Fortune 500 company. Team would join but founders vest over 3 years.",
    options: [
      { text: "Accept the offer", effects: { cash: 2000000, score: 100 }, outcome: "Congratulations! You've had a successful exit! Your team has jobs, and you have capital for your next venture." },
      { text: "Negotiate for $5M or walk", effects: { cash: 0, morale: 5 }, outcome: "They walked away. Risky bet but you believe in the vision. Your team is galvanized by your confidence." },
      { text: "Decline and keep building", effects: { morale: 15, customers: 20, mrr: 1000 }, outcome: "Team is energized! The acquisition interest validated your work. New customers are coming in from the publicity." }
    ]
  },
  {
    id: "6",
    title: "Technical Debt Reckoning",
    description: "The codebase is crumbling. Site is slow, bugs are piling up, deploys are scary.",
    context: "Last week's deploy caused 4 hours of downtime. Customers noticed.",
    options: [
      { text: "Two-week refactor sprint", effects: { cash: -20000, morale: 10, customers: -5, burnRate: 2000 }, outcome: "No new features for two weeks but the foundation is solid now. Deploys are calm again." },
      { text: "Hire a consulting architect", effects: { cash: -30000, morale: 5 }, outcome: "Expert identified critical issues and created a roadmap. Money well spent on avoiding disaster." },
      { text: "Keep shipping features anyway", effects: { morale: -10, customers: 30, mrr: 1500 }, outcome: "Revenue up but tech debt compounds. The senior dev is updating their LinkedIn. Warning signs everywhere." }
    ]
  }
];

const BuildABiz = () => {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);
  const [state, setState] = useState<GameState>({
    month: 1,
    cash: 100000,
    mrr: 0,
    customers: 0,
    employees: 2,
    morale: 80,
    burnRate: 10000,
    runway: 10,
    score: 0,
  });

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentScenarioIndex(0);
    setLastOutcome(null);
    setAiAdvice(null);
    setShowAdvice(false);
    setState({
      month: 1,
      cash: 100000,
      mrr: 0,
      customers: 0,
      employees: 2,
      morale: 80,
      burnRate: 10000,
      runway: 10,
      score: 0,
    });
  };

  const getAIAdvice = async () => {
    setIsLoadingAdvice(true);
    setShowAdvice(true);
    
    try {
      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/game-advisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: JSON.stringify({
          scenario: scenarios[currentScenarioIndex],
          gameState: state,
        }),
      });

      if (!response.ok) throw new Error("Failed to get advice");

      const advice = await response.json();
      setAiAdvice(advice);
    } catch (error) {
      console.error("AI advice error:", error);
      toast({
        title: "Couldn't get AI advice",
        description: "Make your best decision!",
        variant: "destructive"
      });
      setShowAdvice(false);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const makeDecision = (optionIndex: number) => {
    const scenario = scenarios[currentScenarioIndex];
    const option = scenario.options[optionIndex];
    
    const newState = { ...state };
    
    if (option.effects.cash) newState.cash += option.effects.cash;
    if (option.effects.mrr) newState.mrr += option.effects.mrr;
    if (option.effects.customers) newState.customers += option.effects.customers;
    if (option.effects.employees) newState.employees += option.effects.employees;
    if (option.effects.morale) newState.morale = Math.max(0, Math.min(100, newState.morale + option.effects.morale));
    if (option.effects.burnRate) newState.burnRate += option.effects.burnRate;
    if (option.effects.score) newState.score += option.effects.score;
    
    newState.month += 1;
    newState.cash = newState.cash - newState.burnRate + newState.mrr;
    newState.runway = newState.burnRate > newState.mrr 
      ? Math.floor(newState.cash / (newState.burnRate - newState.mrr))
      : 999;
    newState.score += Math.floor(newState.mrr / 100) + newState.customers;

    setLastOutcome(option.outcome);
    setState(newState);
    setAiAdvice(null);
    setShowAdvice(false);

    if (newState.cash <= 0) {
      setGameOver(true);
      toast({ title: "Game Over!", description: "You ran out of cash. Every founder fails before they succeed.", variant: "destructive" });
    } else if (newState.morale <= 0) {
      setGameOver(true);
      toast({ title: "Game Over!", description: "Team morale hit rock bottom. The company fell apart.", variant: "destructive" });
    } else if (currentScenarioIndex >= scenarios.length - 1) {
      setGameOver(true);
      toast({ title: "🎉 Congratulations!", description: `You completed the game with a score of ${newState.score}!` });
    } else {
      setCurrentScenarioIndex((prev) => prev + 1);
    }
  };

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Build-a-Biz Game
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Mentor
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">Startup simulation with AI guidance</p>
            </div>
          </div>
          {gameStarted && (
            <Button variant="outline" size="sm" onClick={startGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!gameStarted ? (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Welcome to Build-a-Biz</h2>
              <p className="text-muted-foreground text-lg">
                Experience the journey of building a startup. Make critical decisions, 
                manage your runway, and get AI mentorship along the way.
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p>You start with $100,000 in funding and a small team</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p>Each turn presents real startup scenarios with multiple options</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <p><strong>NEW:</strong> Get AI mentor advice before making decisions</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <p>Don't run out of cash or let morale hit zero!</p>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="gap-2" onClick={startGame}>
              <Play className="w-5 h-5" />
              Start Your Startup Journey
            </Button>
          </div>
        ) : gameOver ? (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className={`w-24 h-24 ${state.cash > 0 && state.morale > 0 ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-gradient-to-br from-red-400 to-red-600"} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                {state.cash > 0 && state.morale > 0 ? (
                  <CheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold">
                {state.cash > 0 && state.morale > 0 ? "🎉 You Did It!" : "Game Over"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {state.cash > 0 && state.morale > 0 
                  ? "You navigated the startup journey successfully!"
                  : "Every founder fails before they succeed. Try again!"}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{state.score}</p>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{state.month}</p>
                  <p className="text-sm text-muted-foreground">Months</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">${(state.mrr / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Final MRR</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{state.customers}</p>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="gap-2" onClick={startGame}>
              <RotateCcw className="w-5 h-5" />
              Play Again
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Month</span>
                  </div>
                  <p className="text-xl font-bold">{state.month}</p>
                </CardContent>
              </Card>
              <Card className={state.cash < 20000 ? "border-red-500/50" : ""}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Cash</span>
                  </div>
                  <p className={`text-xl font-bold ${state.cash < 20000 ? "text-red-500" : ""}`}>
                    ${(state.cash / 1000).toFixed(0)}k
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">MRR</span>
                  </div>
                  <p className="text-xl font-bold text-green-500">${(state.mrr / 1000).toFixed(1)}k</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Customers</span>
                  </div>
                  <p className="text-xl font-bold">{state.customers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs">Burn Rate</span>
                  </div>
                  <p className="text-xl font-bold">${(state.burnRate / 1000).toFixed(0)}k</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs">Score</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{state.score}</p>
                </CardContent>
              </Card>
            </div>

            {/* Morale & Runway */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className={state.morale < 30 ? "border-red-500/50" : ""}>
                <CardContent className="pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Team Morale</span>
                    <span className={`text-sm font-medium ${state.morale < 30 ? "text-red-500" : state.morale < 50 ? "text-yellow-500" : "text-green-500"}`}>
                      {state.morale}%
                    </span>
                  </div>
                  <Progress value={state.morale} className="h-2" />
                </CardContent>
              </Card>
              <Card className={state.runway < 3 ? "border-red-500/50" : ""}>
                <CardContent className="pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Runway</span>
                    <span className={`text-sm font-medium ${state.runway < 3 ? "text-red-500" : state.runway < 6 ? "text-yellow-500" : "text-green-500"}`}>
                      {state.runway > 100 ? "∞" : state.runway} months
                    </span>
                  </div>
                  <Progress value={Math.min(state.runway * 5, 100)} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Last Outcome */}
            {lastOutcome && (
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">What happened:</p>
                      <p className="text-sm text-muted-foreground">{lastOutcome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scenario Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Scenario {currentScenarioIndex + 1} of {scenarios.length}</Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={getAIAdvice}
                    disabled={isLoadingAdvice || showAdvice}
                  >
                    {isLoadingAdvice ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    Ask AI Mentor
                  </Button>
                </div>
                <CardTitle className="text-xl">{currentScenario.title}</CardTitle>
                <CardDescription>{currentScenario.description}</CardDescription>
                <p className="text-sm text-muted-foreground italic mt-2">Context: {currentScenario.context}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Advice Panel */}
                {showAdvice && (
                  <Card className="bg-gradient-to-br from-purple-500/10 to-primary/5 border-purple-500/20">
                    <CardContent className="pt-4">
                      {isLoadingAdvice ? (
                        <div className="flex items-center gap-3 py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-muted-foreground">AI mentor is analyzing the situation...</span>
                        </div>
                      ) : aiAdvice ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Brain className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">AI Mentor Analysis:</p>
                              <p className="text-sm text-muted-foreground">{aiAdvice.analysis}</p>
                            </div>
                          </div>
                          <div className="pl-8">
                            <p className="text-sm font-medium text-primary">
                              Recommendation: Option {aiAdvice.recommendation}
                            </p>
                            <p className="text-sm text-muted-foreground">{aiAdvice.reasoning}</p>
                          </div>
                          {aiAdvice.realWorldExample && (
                            <div className="pl-8 pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Real example:</span> {aiAdvice.realWorldExample}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}

                {/* Options */}
                <div className="grid gap-3">
                  {currentScenario.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-4 px-4 hover:bg-primary/5 hover:border-primary/50 transition-all ${
                        aiAdvice?.recommendation === index + 1 ? "border-primary/50 bg-primary/5" : ""
                      }`}
                      onClick={() => makeDecision(index)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium">{option.text}</span>
                          {aiAdvice?.recommendation === index + 1 && (
                            <Badge className="ml-2 bg-primary/20 text-primary border-0">AI Pick</Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuildABiz;
