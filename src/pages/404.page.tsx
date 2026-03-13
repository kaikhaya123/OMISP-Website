import { clientPage } from "@/lib/client-page";

const NotFoundView = clientPage(() => import("./NotFound"));

export default function NotFoundPage() {
  return <NotFoundView />;
}