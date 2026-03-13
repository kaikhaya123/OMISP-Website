import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCCompareView = clientPage(() => import("./VCCompare"));

export default function VCComparePage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCCompareView />
    </RoleProtectedRoute>
  );
}