import ProtectedRoute from "@/components/ProtectedRoute";
import { clientPage } from "@/lib/client-page";

const ProfileSetupView = clientPage(() => import("./ProfileSetup"));

export default function ProfileSetupPage() {
  return (
    <ProtectedRoute>
      <ProfileSetupView />
    </ProtectedRoute>
  );
}