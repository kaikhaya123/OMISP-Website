import { clientPage } from "@/lib/client-page";

const SignUpView = clientPage(() => import("./SignUp"));

export default function SignUpPage() {
  return <SignUpView />;
}