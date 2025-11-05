import { Newsletters } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/newsletters")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Newsletters />;
}
