import { clientPage } from "@/lib/client-page";

const ForgotPasswordView = clientPage(() => import("./ForgotPassword"));

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}