import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const BuildABizView = clientPage(() => import("../BuildABiz"));

export default function DashboardBuildABizPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <BuildABizView />
    </RoleProtectedRoute>
  );
}