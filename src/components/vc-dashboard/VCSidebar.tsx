import {
  LayoutDashboard,
  Trophy,
  Bookmark,
  BarChart3,
  Send,
  GitCompare,
  FileText,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Overview", url: "/vc-dashboard", icon: LayoutDashboard },
  { title: "Founder Discovery", url: "/vc-dashboard/founders", icon: Users },
  { title: "Leaderboard", url: "/vc-dashboard/leaderboard", icon: Trophy },
  { title: "Watchlist", url: "/vc-dashboard/watchlist", icon: Bookmark },
  { title: "Analytics", url: "/vc-dashboard/analytics", icon: BarChart3 },
];

const advancedItems = [
  { title: "Intro Requests", url: "/vc-dashboard/intros", icon: Send },
  { title: "Compare", url: "/vc-dashboard/compare", icon: GitCompare },
  { title: "AI Reports", url: "/vc-dashboard/reports", icon: FileText },
];

const bottomItems = [
  { title: "Settings", url: "/vc-dashboard/settings", icon: Settings },
];

export function VCSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === "/vc-dashboard"}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <img src="/logo/omisp-logo.png" alt="OMISP" className="w-8 h-8 object-contain shrink-0" />
        {!collapsed && (
          <div>
            <span className="font-semibold text-sm text-sidebar-foreground">OMISP</span>
            <span className="text-xs text-sidebar-foreground/50 ml-1">Capital</span>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 uppercase tracking-wider">Deal Flow</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs text-sidebar-foreground/40 uppercase tracking-wider">Tools</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(advancedItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(bottomItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
