import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

// /auth is an alias for the login page — but redirects away if already signed in
const Auth = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) return;
    if (role === "founder") navigate("/dashboard", { replace: true });
    else if (role === "investor") navigate("/vc-dashboard", { replace: true });
    else navigate("/choose-role", { replace: true });
  }, [user, role, authLoading, roleLoading, navigate]);

  return <Login />;
};

export default Auth;
