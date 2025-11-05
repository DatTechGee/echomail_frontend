import React, { useEffect } from "react";
import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({ to: "/login" });
    }
  },
});

function RootComponent() {
  const location = useLocation();

  // Handle scroll restoration manually
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
