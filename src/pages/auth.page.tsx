import { clientPage } from "@/lib/client-page";

const AuthView = clientPage(() => import("./Auth"));

export default function AuthPage() {
  return <AuthView />;
}