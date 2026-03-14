import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Footer from "@/components/Footer";
import InvestorReadyReport from "@/components/dashboard/InvestorReadyReport";
import { Header } from "@/components/ui/header-2";

export default function DashboardInvestorReadyReportPage() {
  return (
    <RoleProtectedRoute requiredRole="founder">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Investor-Ready Report</h1>
              <p className="text-muted-foreground mt-2">
                Review your score, verified milestones, and export your founder report.
              </p>
            </div>
            <InvestorReadyReport />
          </div>
        </main>
        <Footer />
      </div>
    </RoleProtectedRoute>
  );
}