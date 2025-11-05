import { ResetPassword } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/resetpassword")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPassword />;
}
