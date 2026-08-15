import { Automations } from "@/pages/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/automations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Automations />;
}
