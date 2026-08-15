import { Analytics } from "@/pages/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Analytics />;
}
