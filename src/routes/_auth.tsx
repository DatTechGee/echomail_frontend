import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { getToken } from "@/utils/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    // Get auth state from store
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const token = getToken();

    // Double check: store says authenticated AND we have a valid token
    if (isAuthenticated && token) {
      throw redirect({
        to: "/dashboard",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
