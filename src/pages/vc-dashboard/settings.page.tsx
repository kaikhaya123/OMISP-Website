import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCSettingsView = clientPage(() => import("./VCSettings"));

export default function VCSettingsPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCSettingsView />
    </RoleProtectedRoute>
  );
}