import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const DashboardView = clientPage(() => import("./Dashboard"));

export default function DashboardPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <DashboardView />
    </RoleProtectedRoute>
  );
}