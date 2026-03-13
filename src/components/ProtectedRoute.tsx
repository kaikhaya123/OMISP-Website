import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  // Show spinner while auth state is being resolved
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not authenticated → send to login, preserving intended destination
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated but no role yet → choose role (unless already there)
  if (!role && location.pathname !== "/choose-role") {
    return <Navigate to="/choose-role" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
