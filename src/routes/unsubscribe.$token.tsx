import { Unsubscribe } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unsubscribe/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useParams();
  return <Unsubscribe token={token} />;
}
