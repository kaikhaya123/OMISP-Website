import { clientPage } from "@/lib/client-page";

const CapitalPricingView = clientPage(() => import("../CapitalPricing"));

export default function CapitalPricingPage() {
  return <CapitalPricingView />;
}