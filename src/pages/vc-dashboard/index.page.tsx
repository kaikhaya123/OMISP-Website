import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCOverviewView = clientPage(() => import("./VCOverview"));

export default function VCDashboardPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCOverviewView />
    </RoleProtectedRoute>
  );
}