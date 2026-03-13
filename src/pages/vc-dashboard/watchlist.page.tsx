import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const VCWatchlistView = clientPage(() => import("./VCWatchlist"));

export default function VCWatchlistPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <VCWatchlistView />
    </RoleProtectedRoute>
  );
}