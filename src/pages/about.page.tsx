import { clientPage } from "@/lib/client-page";

const AboutView = clientPage(() => import("./About"));

export default function AboutPage() {
  return <AboutView />;
}