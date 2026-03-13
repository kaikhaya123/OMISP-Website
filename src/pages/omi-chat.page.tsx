import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { clientPage } from "@/lib/client-page";

const OmiChatView = clientPage(() => import("./OmiChat"));

export default function OmiChatPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <OmiChatView />
    </RoleProtectedRoute>
  );
}