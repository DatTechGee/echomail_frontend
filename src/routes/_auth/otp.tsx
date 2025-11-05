import { ResetPasswordOtp } from "@/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/otp")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPasswordOtp />;
}
