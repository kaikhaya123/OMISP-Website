import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const RevenueArchitectView = clientPage(() => import("../RevenueArchitect"));

export default function DashboardRevenueArchitectPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <RevenueArchitectView />
    </RoleProtectedRoute>
  );
}