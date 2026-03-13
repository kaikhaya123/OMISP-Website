import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const FounderDashboardView = clientPage(() => import("../FounderDashboard"));

export default function FounderDashboardPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <FounderDashboardView />
    </RoleProtectedRoute>
  );
}