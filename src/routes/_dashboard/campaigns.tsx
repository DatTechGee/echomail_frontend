import { Campaigns } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/campaigns")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Campaigns />;
}
