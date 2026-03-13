import { clientPage } from "@/lib/client-page";

const FounderDetailView = clientPage(() => import("../FounderDetail"));

export default function FounderDetailPage() {
  return <FounderDetailView />;
}