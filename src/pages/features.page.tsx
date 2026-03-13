import { clientPage } from "@/lib/client-page";

const FeaturesView = clientPage(() => import("./Features"));

export default function FeaturesPage() {
  return <FeaturesView />;
}