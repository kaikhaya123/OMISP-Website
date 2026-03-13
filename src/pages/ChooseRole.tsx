import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, BarChart3, ArrowRight, Target, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type Role = "founder" | "investor";

const ChooseRole = () => {
  const [loading, setLoading] = useState<Role | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectRole = async (role: Role) => {
    if (!user) return;
    setLoading(role);

    // Upsert profile row — safe to call multiple times, won't duplicate
    const { error } = await (supabase.from("profiles") as any).upsert(
      {
        id: user.id,
        role,
        full_name: user.user_metadata?.full_name ?? null,
      },
      { onConflict: "id" }
    );

    if (error) {
      toast({ title: "Failed to save role", description: error.message, variant: "destructive" });
      setLoading(null);
      return;
    }

    if (role === "founder") {
      // Check if founder_profiles row already exists before inserting
      const { data: existing } = await (supabase.from("founder_profiles") as any)
        .select("founder_id, company_name")
        .eq("founder_id", user.id)
        .maybeSingle();

      if (!existing) {
        const { error: fpError } = await (supabase.from("founder_profiles") as any).insert({
          founder_id: user.id,
        });
        if (fpError) console.error("[ChooseRole] founder_profiles insert error:", fpError.message);
      }

      // If company_name is already set, go straight to dashboard
      navigate(existing?.company_name ? "/dashboard" : "/founder/profile-setup");
    } else {
      // investor — upsert vc_profiles (safe no-op if already exists)
      const { error: vcError } = await (supabase.from("vc_profiles") as any).upsert(
        { id: user.id },
        { onConflict: "id" }
      );
      if (vcError) console.error("[ChooseRole] vc_profiles upsert error:", vcError.message);
      navigate("/vc-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/logo/omisp-logo.png" alt="OMISP" className="w-12 h-12 object-contain" />
            <span className="font-semibold text-2xl text-foreground">OMISP</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How will you use OMISP?
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your path to unlock a tailored experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Founder Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("founder")}
            disabled={!!loading}
            className="group relative bg-card rounded-2xl border-2 border-border hover:border-primary p-8 text-left transition-colors shadow-lg hover:shadow-xl disabled:opacity-60"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Rocket className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">I'm a Founder</h2>
            <p className="text-muted-foreground mb-5">
              Build, measure, and prove your startup's potential with AI-powered tools.
            </p>
            <div className="space-y-2.5">
              {["AI-scored founder readiness", "Pitch & revenue simulators", "Get discovered by investors"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              {loading === "founder"
                ? <span className="text-xs font-medium text-primary uppercase tracking-wider">Saving…</span>
                : <span className="text-xs font-medium text-primary uppercase tracking-wider">Free to start →</span>}
            </div>
          </motion.button>

          {/* Investor Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole("investor")}
            disabled={!!loading}
            className="group relative bg-card rounded-2xl border-2 border-border hover:border-foreground p-8 text-left transition-colors shadow-lg hover:shadow-xl disabled:opacity-60"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
            <div className="w-14 h-14 rounded-xl bg-foreground/10 flex items-center justify-center mb-5">
              <BarChart3 className="w-7 h-7 text-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">I'm a VC / Investor</h2>
            <p className="text-muted-foreground mb-5">
              Discover data-verified founders before the rest of the market does.
            </p>
            <div className="space-y-2.5">
              {["Objective founder scoring", "Behavioral & execution data", "Early-stage deal flow"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-3.5 h-3.5 text-foreground flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              {loading === "investor"
                ? <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Saving…</span>
                : <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore plans →</span>}
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseRole;
