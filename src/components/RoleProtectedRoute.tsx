import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  // "founder" guards founder routes; "vc" guards investor/vc routes
  requiredRole: "founder" | "vc";
}

const RoleProtectedRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!role) {
    return <Navigate to="/choose-role" replace />;
  }

  // "vc" route accepts DB role "investor"
  const effectiveRequiredRole = requiredRole === "vc" ? "investor" : requiredRole;

  if (role !== effectiveRequiredRole) {
    // Wrong role — redirect to their correct home
    return <Navigate to={role === "investor" ? "/vc-dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
