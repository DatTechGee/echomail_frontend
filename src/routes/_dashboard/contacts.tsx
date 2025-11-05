import { Contacts } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/contacts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Contacts />;
}
