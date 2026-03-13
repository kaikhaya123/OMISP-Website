import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCReportsView = clientPage(() => import("./VCReports"));

export default function VCReportsPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCReportsView />
    </RoleProtectedRoute>
  );
}