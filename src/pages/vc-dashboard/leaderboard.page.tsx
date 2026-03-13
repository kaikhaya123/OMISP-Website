import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCLeaderboardView = clientPage(() => import("./VCLeaderboard"));

export default function VCLeaderboardPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCLeaderboardView />
    </RoleProtectedRoute>
  );
}