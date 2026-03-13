import { clientPage } from "@/lib/client-page";

const AdminDashboardView = clientPage(() => import("./AdminDashboard"));

export default function AdminPage() {
  return <AdminDashboardView />;
}