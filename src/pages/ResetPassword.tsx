import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { PasswordInput } from "@/components/auth/PasswordInput";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="h-1.5 bg-primary w-full" />

          <div className="p-8 md:p-10">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <img src="/logo/Omisp.png" alt="OMISP" className="w-9 h-9 object-contain" />
              <span className="font-tanker font-bold text-lg text-foreground tracking-tight">OMISP</span>
            </Link>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Password updated!</h1>
                <p className="text-muted-foreground text-sm">Your password has been reset successfully.</p>
                <Button className="gap-2 mt-2" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-1">Set a new password</h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Choose a strong password for your OMISP account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <PasswordInput
                    id="password"
                    label="New password"
                    value={password}
                    onChange={setPassword}
                    showStrength
                  />
                  <PasswordInput
                    id="confirm"
                    label="Confirm password"
                    value={confirm}
                    onChange={setConfirm}
                    hint={confirm && confirm !== password ? "Passwords don't match" : undefined}
                  />

                  <Button type="submit" className="w-full gap-2 mt-1" disabled={loading}>
                    {loading ? "Updating…" : "Update password"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
