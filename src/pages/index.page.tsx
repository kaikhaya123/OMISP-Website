import { clientPage } from "@/lib/client-page";

const IndexView = clientPage(() => import("./Index"));

export default function IndexPage() {
  return <IndexView />;
}