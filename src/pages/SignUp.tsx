import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, User, Rocket, BarChart3, TrendingUp, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell, AuthSidePanel, AuthDivider, GoogleButton } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";

type Role = "founder" | "vc" | null;

const SignUp = () => {
  const [role, setRole] = useState<Role>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, role },
      },
    });
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (error) toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
  };

  // ── Role picker ──────────────────────────────────────────────────────────
  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <img src="/logo/Omisp.png" alt="OMISP" className="w-10 h-10 object-contain" />
              <span className="font-tanker font-bold text-2xl text-foreground tracking-tight">OMISP</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
              How will you use OMISP?
            </h1>
            <p className="text-muted-foreground text-lg">Choose your path to unlock a tailored experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Founder */}
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("founder")}
              className="group relative bg-card rounded-2xl border-2 border-border hover:border-primary p-8 text-left transition-all shadow-md hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">I'm a Founder</h2>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Build, measure, and prove your startup's potential with AI-powered tools.
              </p>
              <ul className="space-y-2">
                {["AI-scored founder readiness", "Pitch & revenue simulators", "Get discovered by investors"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Free to start</span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>

            {/* VC */}
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("vc")}
              className="group relative bg-card rounded-2xl border-2 border-border hover:border-foreground p-8 text-left transition-all shadow-md hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">I'm a VC / Investor</h2>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Discover data-verified founders before the rest of the market does.
              </p>
              <ul className="space-y-2">
                {["Objective founder scoring", "Behavioral & execution data", "Early-stage deal flow"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-3.5 h-3.5 text-foreground flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore plans</span>
                <ArrowRight className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const isFounder = role === "founder";

  const sidePanel = (
    <AuthSidePanel
      accentClass={isFounder ? "bg-primary" : "bg-foreground"}
      headline={
        isFounder
          ? "Your startup is more<br/>than an idea.<br/><span class='opacity-75'>Prove it with data.</span>"
          : "Stop betting on decks.<br/><span class='opacity-75'>Start betting on data.</span>"
      }
      subheadline={
        isFounder
          ? "OMISP scores your founder readiness across 6 dimensions — stop guessing and build with conviction."
          : "OMISP Capital gives you objective, behavioral data on founders — before you take a meeting."
      }
      bullets={
        isFounder
          ? [
              { icon: TrendingUp, text: "12,000+ founders scored" },
              { icon: Target, text: "87% improved within 30 days" },
              { icon: Rocket, text: "Top scorers seen by VCs first" },
            ]
          : [
              { icon: BarChart3, text: "6-dimension objective scoring" },
              { icon: Target, text: "Filter by execution readiness" },
              { icon: TrendingUp, text: "Watch velocity trends over time" },
            ]
      }
    />
  );

  // ── Success state ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <AuthShell sidePanel={sidePanel}>
        <div className="text-center space-y-5 py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            We sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
            Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-2 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell sidePanel={sidePanel}>
      <button
        onClick={() => setRole(null)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Change role
      </button>

      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${
        isFounder ? "bg-primary/10 text-primary" : "bg-foreground/10 text-foreground"
      }`}>
        {isFounder ? <Rocket className="w-3 h-3" /> : <BarChart3 className="w-3 h-3" />}
        {isFounder ? "Founder account" : "Investor account"}
      </span>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        {isFounder ? "Start proving your potential" : "Access verified deal flow"}
      </h1>
      <p className="text-muted-foreground text-sm mb-7">
        {isFounder
          ? "Create your account and get your OMISP Score in minutes."
          : "Join OMISP Capital and discover data-backed founders."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName" type="text"
              placeholder={isFounder ? "Jane Doe" : "Alex Morgan"}
              className="pl-9"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{isFounder ? "Email address" : "Work email"}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email" type="email"
              placeholder={isFounder ? "founder@startup.com" : "partner@fund.com"}
              className="pl-9"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          showStrength
        />

        <Button
          type="submit"
          className={`w-full gap-2 mt-1 ${!isFounder ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating account…" : isFounder ? "Create founder account" : "Join OMISP Capital"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      <AuthDivider label="Or sign up with" />
      <GoogleButton onClick={handleGoogle} />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
};

export default SignUp;
