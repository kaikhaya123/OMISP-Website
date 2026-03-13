import { clientPage } from "@/lib/client-page";

const LoginView = clientPage(() => import("./Login"));

export default function LoginPage() {
  return <LoginView />;
}