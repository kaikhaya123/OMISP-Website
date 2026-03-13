import ProtectedRoute from "@/components/ProtectedRoute";
import { clientPage } from "@/lib/client-page";

const ChooseRoleView = clientPage(() => import("./ChooseRole"));

export default function ChooseRolePage() {
  return (
    <ProtectedRoute>
      <ChooseRoleView />
    </ProtectedRoute>
  );
}