import React, { useEffect } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { initTheme } from "@/utils/theme";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, []);

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
