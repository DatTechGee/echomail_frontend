import { Templates } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/templates")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Templates />;
}
