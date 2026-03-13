import { clientPage } from "@/lib/client-page";

const PricingView = clientPage(() => import("./Pricing"));

export default function PricingPage() {
  return <PricingView />;
}