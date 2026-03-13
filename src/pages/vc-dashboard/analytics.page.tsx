import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCAnalyticsView = clientPage(() => import("./VCAnalytics"));

export default function VCAnalyticsPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCAnalyticsView />
    </RoleProtectedRoute>
  );
}