import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { getToken, clearAuth } from "@/utils/auth";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ location }) => {
    // Get auth state from store
    const { isAuthenticated, setLastAttemptedRoute, logout } =
      useAuthStore.getState();
    const token = getToken();

    // If store says authenticated but no token exists, clear everything
    if (isAuthenticated && !token) {
      logout();
      clearAuth();
      setLastAttemptedRoute(location.pathname);
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // If user is not authenticated, save attempted route and redirect to login
    if (!isAuthenticated || !token) {
      setLastAttemptedRoute(location.pathname);
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      <Topbar
        onMenuToggle={handleMobileMenuToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? isSidebarCollapsed
                ? 80
                : 280
              : 0,
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
