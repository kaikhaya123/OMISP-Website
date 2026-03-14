import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Rocket, BarChart3, TrendingUp, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell, AuthSidePanel, AuthDivider, GoogleButton } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

type Role = "founder" | "vc";

const SIDE_CONTENT: Record<Role, {
  accent: string;
  headline: string;
  sub: string;
  bullets: { icon: React.ElementType; text: string }[];
  backgroundImage: string;
}> = {
  founder: {
    accent: "bg-primary",
    headline: "Every day you wait,<br/><span class='opacity-75'>your score falls behind.</span>",
    sub: "Pick up where you left off. Your OMISP Score tracks your momentum — sign in to keep climbing.",
    bullets: [
      { icon: TrendingUp, text: "Track your progress velocity" },
      { icon: Target, text: "Unlock improvement insights" },
      { icon: Rocket, text: "Stay visible on VC leaderboards" },
    ],
    backgroundImage: "/Images/Blue Piggy Bank.png",
  },
  vc: {
    accent: "bg-foreground",
    headline: "The best deals aren't pitched.<br/><span class='opacity-75'>They're discovered.</span>",
    sub: "New founders enter the leaderboard daily. Sign in to see who's rising before anyone else.",
    bullets: [
      { icon: BarChart3, text: "Live leaderboard updates" },
      { icon: Target, text: "Saved search filters & alerts" },
      { icon: TrendingUp, text: "Portfolio founder tracking" },
    ],
    backgroundImage: "/Images/Modern Digital Communication.png",
  },
};

const Login = () => {
  const [role, setRole] = useState<Role>("founder");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { role: userRole, loading: roleLoading } = useUserRole();
  const isFounder = role === "founder";
  const side = SIDE_CONTENT[role];

  // If already authenticated, redirect without requiring sign-in again
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) return;
    if (userRole === "founder") navigate("/dashboard", { replace: true });
    else if (userRole === "investor") navigate("/vc-dashboard", { replace: true });
    else navigate("/choose-role", { replace: true });
  }, [user, userRole, authLoading, roleLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Read persisted role from profiles table
    const { data: profileData } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const userRole: string | undefined = profileData?.role ?? data.user?.user_metadata?.role;

    if (!userRole) {
      navigate("/choose-role");
    } else if (userRole === "investor" || userRole === "vc") {
      navigate("/vc-dashboard");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (error) toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
  };

  const sidePanel = (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ 
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        className="contents"
      >
        <AuthSidePanel
          accentClass={side.accent}
          headline={side.headline}
          subheadline={side.sub}
          bullets={side.bullets}
          backgroundImage={side.backgroundImage}
        />
      </motion.div>
    </AnimatePresence>
  );

  return (
    <AuthShell sidePanel={sidePanel}>
      {/* Role toggle */}
      <div className="flex bg-muted rounded-xl p-1 mb-8 gap-1">
        {(["founder", "vc"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-tanker font-medium transition-all duration-300 ease-in-out ${
              role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === "founder" ? <Rocket className="w-3.5 h-3.5" /> : <BarChart3 className="w-3.5 h-3.5" />}
            {r === "founder" ? "Founder" : "VC / Investor"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.4,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <h1 className="text-2xl font-tanker font-bold text-foreground mb-1">
            {isFounder ? "Welcome back, builder" : "Welcome back, investor"}
          </h1>
          <p className="text-muted-foreground text-sm font-tanker mb-7">
            {isFounder
              ? "Sign in to check your score and keep building momentum."
              : "Sign in to explore the latest data-verified founders."}
          </p>
        </motion.div>
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-tanker">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email" type="email"
              placeholder={isFounder ? "founder@startup.com" : "partner@fund.com"}
              className="pl-9 font-tanker"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-tanker">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline font-tanker font-medium">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" label="" value={password} onChange={setPassword} />
        </div>

        <Button
          type="submit"
          className="w-full gap-2 mt-1 bg-blue-600 hover:bg-blue-700 text-white font-tanker"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      <AuthDivider />
      <GoogleButton onClick={handleGoogle} />

      <p className="text-center text-sm text-muted-foreground font-tanker mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary font-tanker font-semibold hover:underline">Create one</Link>
      </p>
    </AuthShell>
  );
};

export default Login;
