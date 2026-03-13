import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const PitchGauntletView = clientPage(() => import("./PitchGauntlet"));

export default function PitchGauntletPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <PitchGauntletView />
    </RoleProtectedRoute>
  );
}