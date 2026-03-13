import { clientPage } from "@/lib/client-page";

const CapitalView = clientPage(() => import("../Capital"));

export default function CapitalPage() {
  return <CapitalView />;
}