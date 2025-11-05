import { ForgotPassword } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgetpassword")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ForgotPassword />;
}
