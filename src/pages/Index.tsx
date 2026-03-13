import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header-2";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) return; // Not signed in — show landing page normally

    // Auto-redirect authenticated users to their correct home
    if (role === "founder") {
      navigate("/dashboard", { replace: true });
    } else if (role === "investor") {
      navigate("/vc-dashboard", { replace: true });
    } else if (user) {
      // Signed in but no role yet
      navigate("/choose-role", { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
