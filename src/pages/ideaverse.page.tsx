import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const IdeaverseView = clientPage(() => import("./Ideaverse"));

export default function IdeaversePage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <IdeaverseView />
    </RoleProtectedRoute>
  );
}