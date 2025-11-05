import { JoinNewsletter } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/join-newsletters")({
  component: RouteComponent,
});

function RouteComponent() {
  return <JoinNewsletter />;
}
