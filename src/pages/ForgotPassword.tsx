import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
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
        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Top stripe */}
          <div className="h-1.5 bg-primary w-full" />

          <div className="p-8 md:p-10">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <img src="/logo/omisp-logo.png" alt="OMISP" className="w-9 h-9 object-contain" />
              <span className="font-bold text-lg text-foreground tracking-tight">OMISP</span>
            </Link>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a reset link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                  It expires in 1 hour.
                </p>
                <Button variant="outline" className="mt-2" onClick={() => setSent(false)}>
                  Try a different email
                </Button>
              </motion.div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-1">Forgot your password?</h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email" type="email" placeholder="name@example.com"
                        className="pl-9" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              </>
            )}

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
