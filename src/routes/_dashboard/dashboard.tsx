import { Dashboard } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
