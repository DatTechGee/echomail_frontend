import { TwoFactor } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/2fa")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TwoFactor />;
}
