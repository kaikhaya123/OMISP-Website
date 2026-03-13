import { clientPage } from "@/lib/client-page";

const LoginView = clientPage(() => import("./Login"));

export default function SignInPage() {
  return <LoginView />;
}