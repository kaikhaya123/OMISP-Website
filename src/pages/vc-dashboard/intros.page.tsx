import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCIntrosView = clientPage(() => import("./VCIntros"));

export default function VCIntrosPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCIntrosView />
    </RoleProtectedRoute>
  );
}