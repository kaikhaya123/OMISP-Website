import { clientPage } from "@/lib/client-page";

const ResetPasswordView = clientPage(() => import("./ResetPassword"));

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}