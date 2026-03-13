import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const InvestorFounderListView = clientPage(() => import("./InvestorFounderList"));

export default function VCFoundersPage() {
  return (
    <RoleProtectedRoute requiredRole="vc">
      <InvestorFounderListView />
    </RoleProtectedRoute>
  );
}