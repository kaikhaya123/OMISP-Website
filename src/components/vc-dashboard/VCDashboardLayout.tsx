import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VCSidebar } from "./VCSidebar";

interface VCDashboardLayoutProps {
  children: React.ReactNode;
}

export default function VCDashboardLayout({ children }: VCDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <VCSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-medium text-muted-foreground">VC Dashboard</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
