import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Mic, MicOff, Clock, Target, ChevronRight, CheckCircle, XCircle, Sparkles, Loader2, Trophy, Flame, Zap, Square } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import MicrosoftBadge from "@/components/MicrosoftBadge";
import { publicEnv } from "@/lib/env";

interface PitchScore {
  clarity: number;
  conviction: number;
  storytelling: number;
  metrics: number;
  responsiveness: number;
}

interface AIFeedback {
  scores: PitchScore;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  investorFeedback: string;
  followUpQuestions: string[];
}

interface InvestorPersona {
  id: string;
  name: string;
  firm: string;
  style: string;
  avatar: string;
  focus: string[];
  difficulty: "easy" | "medium" | "hard" | "legendary";
  personality: string;
}

const investors: InvestorPersona[] = [
  {
    id: "1",
    name: "Jennifer Walsh",
    firm: "Sequoia Capital",
    style: "Direct and metrics-focused. Loves big markets.",
    avatar: "JW",
    focus: ["Market Size", "Unit Economics", "Team"],
    difficulty: "hard",
    personality: "I've invested in 12 unicorns. I'm looking for the next one. Show me why you're it."
  },
  {
    id: "2",
    name: "David Chen",
    firm: "Andreessen Horowitz",
    style: "Technical deep-dives. Wants to understand the product.",
    avatar: "DC",
    focus: ["Technology", "Product", "Moat"],
    difficulty: "hard",
    personality: "I'm an engineer at heart. I want to understand your architecture and why it's defensible."
  },
  {
    id: "3",
    name: "Maria Santos",
    firm: "First Round",
    style: "Founder-friendly. Focuses on vision and team.",
    avatar: "MS",
    focus: ["Vision", "Team", "Culture"],
    difficulty: "easy",
    personality: "I back founders, not just ideas. Tell me your story and why you're the one to build this."
  },
  {
    id: "4",
    name: "Robert Kim",
    firm: "Benchmark",
    style: "Contrarian thinker. Challenges assumptions.",
    avatar: "RK",
    focus: ["Differentiation", "Competition", "Timing"],
    difficulty: "medium",
    personality: "Everyone's building AI companies. Tell me what makes you different."
  },
  {
    id: "5",
    name: "The Shark Tank",
    firm: "Multiple VCs",
    style: "Rapid-fire questions. Maximum pressure.",
    avatar: "🦈",
    focus: ["Everything", "Speed", "Stress Test"],
    difficulty: "legendary",
    personality: "You have 60 seconds per answer. No fluff. Only signal."
  },
];

const pitchQuestions = [
  "Give me your 60-second elevator pitch.",
  "What problem are you solving and why is it urgent?",
  "How big is the total addressable market?",
  "Who is your ideal customer and what's your CAC?",
  "What's your business model and unit economics?",
  "Who's on the team and what's your unfair advantage?",
  "What traction do you have? Show me the numbers.",
  "How much are you raising and how will you use it?",
  "What's the biggest risk to this business?",
  "Why should we invest in you over 1000 other pitches?"
];

const questionTips = [
  "Lead with the problem, then solution. End with traction.",
  "Focus on timing. Why is NOW the right moment?",
  "Use bottom-up TAM. Be specific, not 'trillion dollar market'.",
  "Know your ICP deeply. Mention actual CAC numbers.",
  "LTV:CAC ratio and payback period are critical.",
  "Show relevant experience. Why YOUR team specifically?",
  "Numbers beat descriptions. Revenue, growth rate, retention.",
  "12-18 month runway. Clear milestones for the raise.",
  "Show self-awareness. Then explain risk mitigation.",
  "This is your close. Be memorable. Show conviction."
];

const PitchGauntlet = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"select" | "practice" | "results">("select");
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorPersona | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const timeLimit = selectedInvestor?.difficulty === "legendary" ? 60 : 90;

  useEffect(() => {
    if (isRecording && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, timeLeft]);

  const startPractice = (investor: InvestorPersona) => {
    setSelectedInvestor(investor);
    setMode("practice");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setTimeLeft(investor.difficulty === "legendary" ? 60 : 90);
    setIsRecording(false);
    setAiFeedback(null);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    toast({
      title: "Timer started!",
      description: `You have ${timeLimit} seconds. Speak clearly and confidently.`
    });
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsVoiceRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your answer clearly"
      });
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isVoiceRecording) {
      mediaRecorderRef.current.stop();
      setIsVoiceRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/transcribe-voice`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const { transcription } = await response.json();
      setCurrentAnswer(prev => prev + (prev ? ' ' : '') + transcription);

      toast({
        title: "Voice transcribed!",
        description: "Your answer has been added"
      });
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description: "Please type your answer instead",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < pitchQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(timeLimit);
      setIsRecording(false);
    } else {
      analyzePitch(newAnswers);
    }
  };

  const analyzePitch = async (allAnswers: string[]) => {
    setMode("results");
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/pitch-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: JSON.stringify({
          answers: allAnswers,
          questions: pitchQuestions,
          investorName: selectedInvestor?.name,
          investorStyle: selectedInvestor?.personality,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze pitch");
      }

      const feedback = await response.json();
      setAiFeedback(feedback);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Using fallback scoring. Please try again later.",
        variant: "destructive"
      });
      // Fallback to basic scoring
      setAiFeedback({
        scores: {
          clarity: 70 + Math.random() * 20,
          conviction: 65 + Math.random() * 25,
          storytelling: 60 + Math.random() * 30,
          metrics: 55 + Math.random() * 35,
          responsiveness: 70 + Math.random() * 20,
        },
        overallScore: 68,
        strengths: ["Good structure", "Clear problem statement"],
        improvements: ["Add more specific metrics", "Strengthen the ask"],
        investorFeedback: "Practice makes perfect. Keep refining your pitch!",
        followUpQuestions: ["What's your monthly burn rate?", "How do you retain customers?"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles: Record<string, string> = {
      easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      legendary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 animate-pulse"
    };
    return styles[difficulty] || styles.medium;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Pitch Perfect Gauntlet
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  <Flame className="w-3 h-3 mr-1" />
                  AI Scoring
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">Practice pitching to AI investors</p>
            </div>
          </div>
          {mode !== "select" && (
            <Button variant="outline" size="sm" onClick={() => setMode("select")}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {mode === "select" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Choose Your Investor</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each investor has a unique style and focus. Master all of them to become pitch-perfect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {investors.map((investor) => (
                <Card 
                  key={investor.id} 
                  className={`cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 ${
                    investor.difficulty === "legendary" ? "ring-2 ring-purple-500/50" : ""
                  }`}
                  onClick={() => startPractice(investor)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${
                          investor.difficulty === "legendary" 
                            ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                            : "bg-primary/10"
                        } flex items-center justify-center font-semibold ${
                          investor.difficulty === "legendary" ? "text-white" : "text-primary"
                        }`}>
                          {investor.avatar}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{investor.name}</CardTitle>
                          <CardDescription>{investor.firm}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getDifficultyBadge(investor.difficulty)}>
                        {investor.difficulty === "legendary" ? "🔥 " : ""}{investor.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">"{investor.personality}"</p>
                    <div className="flex flex-wrap gap-2">
                      {investor.focus.map((f) => (
                        <Badge key={f} variant="outline">{f}</Badge>
                      ))}
                    </div>
                    <Button className="w-full gap-2">
                      <Target className="w-4 h-4" />
                      {investor.difficulty === "legendary" ? "Accept Challenge" : "Start Practice"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {mode === "practice" && selectedInvestor && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Question {currentQuestionIndex + 1} of {pitchQuestions.length}</span>
                <span className="text-muted-foreground">{selectedInvestor.name} • {selectedInvestor.firm}</span>
              </div>
              <Progress value={(currentQuestionIndex / pitchQuestions.length) * 100} className="h-2" />
            </div>

            {/* Timer */}
            <Card className={`${timeLeft <= 15 ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""} transition-colors`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4">
                  <Clock className={`w-8 h-8 ${timeLeft <= 15 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
                  <span className={`text-5xl font-mono font-bold ${timeLeft <= 15 ? "text-red-500" : ""}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{pitchQuestions[currentQuestionIndex]}</CardTitle>
                <CardDescription>
                  Speak or type your answer. Be concise and data-driven.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  rows={6}
                  className="resize-none text-base"
                />
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {!isRecording ? (
                      <Button onClick={handleStartRecording} variant="outline" className="gap-2">
                        <Clock className="w-4 h-4" />
                        Start Timer
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handlePauseRecording} variant="outline" className="gap-2">
                          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          {isPaused ? "Resume" : "Pause"}
                        </Button>
                      </>
                    )}
                    
                    {/* Voice Recording */}
                    {isTranscribing ? (
                      <Button variant="outline" disabled className="gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transcribing...
                      </Button>
                    ) : isVoiceRecording ? (
                      <Button variant="destructive" onClick={stopVoiceRecording} className="gap-2">
                        <Square className="w-4 h-4" />
                        Stop Recording
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={startVoiceRecording} className="gap-2">
                        <Mic className="w-4 h-4" />
                        Record Voice
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleNextQuestion} className="gap-2" disabled={!currentAnswer.trim()}>
                    {currentQuestionIndex < pitchQuestions.length - 1 ? "Next Question" : "Finish & Analyze"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Pro Tip:</p>
                    <p className="text-sm text-muted-foreground">{questionTips[currentQuestionIndex]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === "results" && (
          <div className="max-w-3xl mx-auto space-y-8">
            {isAnalyzing ? (
              <div className="text-center space-y-6 py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-bold">Analyzing Your Pitch...</h2>
                <p className="text-muted-foreground">
                  {selectedInvestor?.name} is reviewing your responses with AI precision.
                </p>
              </div>
            ) : aiFeedback ? (
              <>
                <div className="text-center space-y-4">
                  <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                    aiFeedback.overallScore >= 80 ? "bg-gradient-to-br from-green-400 to-green-600" : 
                    aiFeedback.overallScore >= 60 ? "bg-gradient-to-br from-yellow-400 to-orange-500" : 
                    "bg-gradient-to-br from-red-400 to-red-600"
                  }`}>
                    <span className="text-4xl font-bold text-white">{Math.round(aiFeedback.overallScore)}</span>
                  </div>
                  <h2 className="text-3xl font-bold">Pitch Analysis Complete!</h2>
                  <p className="text-muted-foreground text-lg">
                    {aiFeedback.overallScore >= 80 && "🎉 Outstanding! You're investor-ready."}
                    {aiFeedback.overallScore >= 60 && aiFeedback.overallScore < 80 && "📈 Good progress! Keep refining."}
                    {aiFeedback.overallScore < 60 && "💪 Keep practicing! Every great founder started here."}
                  </p>
                </div>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                    <CardDescription>AI-analyzed across 5 key dimensions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { name: "Clarity", score: aiFeedback.scores.clarity, desc: "How clear and structured was your pitch?" },
                      { name: "Conviction", score: aiFeedback.scores.conviction, desc: "Did you show confidence and passion?" },
                      { name: "Storytelling", score: aiFeedback.scores.storytelling, desc: "Was there a compelling narrative?" },
                      { name: "Metrics", score: aiFeedback.scores.metrics, desc: "Did you use specific data and numbers?" },
                      { name: "Responsiveness", score: aiFeedback.scores.responsiveness, desc: "Did you answer what was actually asked?" },
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          <span className={`font-bold text-lg ${getScoreColor(item.score)}`}>{Math.round(item.score)}</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiFeedback.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600">✓</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-500/30 bg-orange-50/50 dark:bg-orange-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <Zap className="w-5 h-5" />
                        Areas to Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiFeedback.improvements.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-orange-600">→</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Investor Feedback */}
                <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Feedback from {selectedInvestor?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground italic">"{aiFeedback.investorFeedback}"</p>
                    
                    {aiFeedback.followUpQuestions.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Questions they'd ask next:</p>
                        <ul className="space-y-1">
                          {aiFeedback.followUpQuestions.map((q, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span>•</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => setMode("select")} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Another Investor
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => startPractice(selectedInvestor!)} className="gap-2">
                    <Target className="w-4 h-4" />
                    Practice Again
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default PitchGauntlet;
