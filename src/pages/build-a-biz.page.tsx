import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const BuildABizView = clientPage(() => import("./BuildABiz"));

export default function BuildABizPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <BuildABizView />
    </RoleProtectedRoute>
  );
}